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
const maxMediaCount = 4;

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
		if (text.length == 0) {
			text = null;
		} else if (text.length > maxTextLength) {
			return rej('too long text');
		}
	} else {
		text = null;
	}

	// Get 'media_ids' parameter
	let media = params.media_ids;
	let files = [];
	if (media !== undefined && media !== null) {
		media = media.split(',');

		if (media.length > maxMediaCount) {
			return rej('too many media');
		}

		// Drop duplicates
		media = media.filter((x, i, s) => s.indexOf(x) == i);

		// Fetch files
		// forEach だと途中でエラーなどがあっても return できないので
		// 敢えて for を使っています。
		for (let i = 0; i < media.length; i++) {
			const image = media[i];

			// Fetch file
			// SELECT _id
			const entity = await DriveFile.findOne({
				_id: new mongo.ObjectID(image),
				user_id: user._id
			}, {
				_id: true
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

	// Get 'repost_id' parameter
	let repost = params.repost_id;
	if (repost !== undefined && repost !== null) {
		// Fetch repost to post
		repost = await Post.findOne({
			_id: new mongo.ObjectID(repost)
		});

		if (repost == null) {
			return rej('repostee is not found');
		} else if (repost.repost_id && !repost.text && !repost.media_ids) {
			return rej('cannot repost to repost');
		}

		// Fetch recently post
		const latestPost = await Post.findOne({
			user_id: user._id
		}, {}, {
			sort: {
				_id: -1
			}
		});

		// 直近と同じRepost対象かつ引用じゃなかったらエラー
		if (latestPost &&
				latestPost.repost_id &&
				latestPost.repost_id.equals(repost._id) &&
				text === null && files === null) {
			return rej('二重Repostです(NEED TRANSLATE)');
		}

		// 直近がRepost対象かつ引用じゃなかったらエラー
		if (latestPost &&
				latestPost._id.equals(repost._id) &&
				text === null && files === null) {
			return rej('二重Repostです(NEED TRANSLATE)');
		}
	} else {
		repost = null;
	}

	// Get 'reply_to_id' parameter
	let replyTo = params.reply_to_id;
	if (replyTo !== undefined && replyTo !== null) {
		replyTo = await Post.findOne({
			_id: new mongo.ObjectID(replyTo)
		});

		if (replyTo === null) {
			return rej('reply to post is not found');
		}

		// 返信対象が引用でないRepostだったらエラー
		if (replyTo.repost_id && !replyTo.text && !replyTo.media_ids) {
			return rej('cannot reply to repost');
		}
	} else {
		replyTo = null;
	}

	// テキストが無いかつ添付ファイルが無いかつRepostも無かったらエラー
	if (text === null && files === null && repost === null) {
		return rej('text, media_ids or repost_id is required');
	}

	// 投稿を作成
	const inserted = await Post.insert({
		created_at: new Date(),
		media_ids: media ? files.map(file => file._id) : undefined,
		reply_to_id: replyTo ? replyTo._id : undefined,
		repost_id: repost ? repost._id : undefined,
		text: text,
		user_id: user._id,
		app_id: app ? app._id : null
	});

	const post = inserted.ops[0];

	// Serialize
	const postObj = await serialize(post);

	// Reponse
	res(postObj);

	//--------------------------------
	// Post processes

	let mentions = [];

	// Publish event to myself's stream
	event(user._id, 'post', postObj);

	// Fetch all followers
	const followers = await Following
		.find({
			followee_id: user._id,
			// 削除されたドキュメントは除く
			deleted_at: { $exists: false }
		}, {
			follower_id: true,
			_id: false
		})
		.toArray();

	// Publish event to followers stream
	followers.forEach(following => {
		event(following.follower_id, 'post', postObj);
	});

	// Increment my posts count
	User.updateOne({ _id: user._id }, {
		$inc: {
			posts_count: 1
		}
	});

	// If has in reply to post
	if (replyTo) {
		// Increment replies count
		Post.updateOne({ _id: replyTo._id }, {
			$inc: {
				replies_count: 1
			}
		});

		// 自分自身へのリプライでない限りは通知を作成
		if (!replyTo.user_id.equals(user._id)) {
			notify(replyTo.user_id, user._id, 'reply', {
				post_id: post._id
			});
		}

		// Add mention
		mentions.push(replyTo.user_id);
	}

	// If it is repost
	if (repost) {
		// Notify
		if (!repost.user_id.equals(user._id)) {
			const type = text ? 'quote' : 'repost';
			notify(repost.user_id, user._id, type, {
				post_id: post._id
			});
		}

		// If it is quote repost
		if (text) {
			// Add mention
			mentions.push(repost.user_id);
		}

		// 今までで同じ投稿をRepostしているか
		const existRepost = await Post.findOne({
			user_id: user._id,
			repost_id: repost._id,
			_id: {
				$ne: post._id
			}
		});

		if (existRepost == null) return;

		// Update repostee status
		Post.updateOne({ _id: repost._id }, {
			$inc: {
				repost_count: 1
			}
		});
	}

	// If has text content
	if (text) {
		// Register to search database
		es.index({
			index: 'misskey',
			type: 'post',
			id: post._id.toString(),
			body: {
				text: post.text
			}
		});

		// Analyze
		const tokens = parse(text);

		// Extract a hashtags
		const hashtags = tokens
			.filter(t => t.type == 'hashtag')
			.map(m => m.hashtag)
			// Drop dupulicates
			.filter((v, i, s) => s.indexOf(v) == i);

		// ハッシュタグをデータベースに登録
		//registerHashtags(user, hashtags);

		// Extract an '@' mentions
		const atMentions = tokens
			.filter(t => t.type == 'mention')
			.map(m => m.username)
			// Drop dupulicates
			.filter((v, i, s) => s.indexOf(v) == i);

		// Notify all mentions
		await Promise.all(atMentions.map(async (mention) => {
			// Fetch mentioned user
			// SELECT _id
			const mentionee = await User
				.findOne({
					username_lower: mention.toLowerCase()
				}, { _id: true });

			// When mentioned user not found
			if (mentionee == null) return;

			// Add mention
			mentions.push(mentionee);

			// Ignore myself mention
			if (mentionee._id.equals(user._id)) return;

			// 既に言及されたユーザーに対する返信や引用repostの場合も無視
			if (replyTo && replyTo.user_id.equals(mentionee._id)) return;
			if (repost && repost.user_id.equals(mentionee._id)) return;

			// Create notification
			notify(mentionee._id, user._id, 'mention', {
				post_id: post._id
			});

			return;
		}));
	}

	if (mentions.length == 0) return;

	// Drop dupulicates
	// ObjectID同士では比較できないのでtoStringする
	mentions = mentions
		.filter((v, i, s) =>
			s.map(x => x.toString())
			.indexOf(v.toString()) == i);

	// Append mentions data
	Post.updateOne({ _id: post._id }, {
		$set: {
			mentions: mentions
		}
	});
});
