'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import parse from 'misskey-text';
import Post from '../../models/post';
import User from '../../models/user';
import Following from '../../models/following';
import DriveFile from '../../models/drive-file';
import serialize from '../../serializers/post';
//import extractHashtags from '../../core/extract-hashtags';
//import registerHashtags from '../../core/register-hashtags';
import createFile from '../../common/add-file-to-drive';
import notify from '../../common/notify';
import event from '../../event';
import es from '../../../db/elasticsearch';

/**
 * 最大文字数
 */
const maxTextLength = 300;

/**
 * 添付できるファイルの数
 */
const maxFileLength = 4;

/**
 * Create a post
 *
 * @param {Object} params
 * @param {Object} user
 * @param {Object} app
 * @return {Promise<object>}
 */
module.exports = (params, user, app) =>
	new Promise(async (res, rej) =>
{
	// Get 'text' parameter
	let text = params.text;
	if (text !== undefined && text !== null) {
		text = text.trim();
		if (text.length === 0) {
			text = null;
		} else if (text.length > maxTextLength) {
			return rej('too long text');
		}
	} else {
		text = null;
	}

	// Get 'images' parameter
	let images = params.images;
	let files = [];
	if (images !== undefined && images !== null) {
		images = images.split(',');

		if (images.length > maxFileLength) {
			return rej('too many images');
		}

		// Drop duplicates
		images = images.filter((x, i, self) => self.indexOf(x) === i);

		// Fetch files
		// forEach だと途中でエラーなどがあっても return できないので
		// 敢えて for を使っています。
		for (let i = 0; i < images.length; i++) {
			const image = images[i];

			const entity = await DriveFile.findOne({
				_id: new mongo.ObjectID(image),
				user: user._id
			}, {
				data: false
			});

			if (entity === null) {
				return rej('file not found');
			} else {
				files.push(entity);
			}
		}
	} else {
		files = null;
	}

	// Get 'repost' parameter
	let repost = params.repost;
	if (repost !== undefined && repost !== null) {
		// Get repostee
		repost = await Post.findOne({
			_id: new mongo.ObjectID(repost)
		});

		if (repost === null) {
			return rej('repostee is not found');
		} else if (repost.repost && !repost.text && !repost.images) {
			return rej('cannot repost from repost');
		}

		// Get recently post
		const latestPost = await Post.findOne({
			user: user._id
		}, {}, {
			sort: {
				_id: -1
			}
		});

		// 直近と同じRepost対象かつ引用じゃなかったらエラー
		if (latestPost &&
				latestPost.repost &&
				latestPost.repost.toString() === repost._id.toString() &&
				text === null && files === null) {
			return rej('二重Repostです(NEED TRANSLATE)');
		}

		// 直近がRepost対象かつ引用じゃなかったらエラー
		if (latestPost &&
				latestPost._id.toString() === repost._id.toString() &&
				text === null && files === null) {
			return rej('二重Repostです(NEED TRANSLATE)');
		}
	} else {
		repost = null;
	}

	// Get 'reply_to' parameter
	let replyTo = params.reply_to;
	if (replyTo !== undefined && replyTo !== null) {
		replyTo = await Post.findOne({
			_id: new mongo.ObjectID(replyTo)
		});

		if (replyTo === null) {
			return rej('reply to post is not found');
		}

		// 返信対象が引用でないRepostだったらエラー
		if (replyTo.repost && !replyTo.text && !replyTo.images) {
			return rej('cannot reply to repost');
		}
	} else {
		replyTo = null;
	}

	// テキストが無いかつ添付ファイルが無いかつRepostも無かったらエラー
	if (text === null && files === null && repost === null) {
		return rej('text, images or repost is required');
	}

	// 投稿を作成
	const inserted = await Post.insert({
		created_at: new Date(),
		images: images ? files.map(file => file._id) : undefined,
		reply_to: replyTo ? replyTo._id : undefined,
		repost: repost ? repost._id : undefined,
		text: text,
		user: user._id,
		app: app ? app._id : null
	});

	const post = inserted.ops[0];

	// Serialize
	const postObj = await serialize(post);

	// Reponse
	res(postObj);

	// 自分のストリーム
	event(user._id, 'post', postObj);

	const followers = await Following
		.find({ followee: user._id }, {
			follower: true,
			_id: false
		})
		.toArray();

	// 自分のフォロワーのストリーム
	followers.forEach(following => {
		event(following.follower, 'post', postObj);
	});

	// Increment my posts count
	User.updateOne({ _id: user._id }, {
		$inc: {
			posts_count: 1
		}
	});

	// Update replyee status
	if (replyTo) {
		if (replyTo.user.toString() !== user._id.toString()) {
			// Publish event
			event(replyTo.user, 'reply', postObj);

			// Create notification
			notify(replyTo.user, 'reply', {
				post: post._id
			});
		}

		Post.updateOne({ _id: replyTo._id }, {
			$inc: {
				replies_count: 1
			}
		});
	}

	if (repost) {
		// Publish event
		event(repost.user, 'repost', postObj);

		// Notify
		if (repost.user.toString() !== user._id.toString()) {
			notify(repost.user, 'repost', {
				post: post._id
			});
		}

		// 今までで同じ投稿をRepostしているか
		const existRepost = await Post.findOne({
			user: user._id,
			repost: repost._id,
			_id: {
				$ne: post._id
			}
		});

		if (existRepost === null) {
			// Update repostee status
			Post.updateOne({ _id: repost._id }, {
				$inc: {
					repost_count: 1
				}
			});
		}
	}

	// Register to search database
	if (text != null) {
		es.index({
			index: 'misskey',
			type: 'post',
			id: post._id.toString(),
			body: {
				text: post.text
			}
		});

		const tokens = parse(text);

		// Extract a mentions
		const mentions = tokens
			.filter(t => t.type == 'mention')
			.map(m => m.username)
			// Drop dupulicates
			.filter((v, i, s) => s.indexOf(v) == i);

		mentions.forEach(async (mention) => {
			// Fetch mentioned user
			const mentionedUser = await User
				.findOne({ username_lower: mention.toLowerCase() });

			// Notify
			if (mentionedUser._id.toString() !== user._id.toString()) {
				if (replyTo && replyTo.user.toString() == mentionedUser._id.toString()) return;
				if (repost && repost.user.toString() == mentionedUser._id.toString()) return;

				// Publish event
				event(mentionedUser._id, 'mention', postObj);

				// Create notification
				notify(mentionedUser._id, 'mention', {
					post: post._id
				});
			}
		});

		// ハッシュタグ抽出
		//const hashtags = extractHashtags(text);

		// ハッシュタグをデータベースに登録
		//registerHashtags(user, hashtags);
	}
});
