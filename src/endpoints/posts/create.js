'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../models/post';
import User from '../../models/user';
import Following from '../../models/following';
import DriveFile from '../../models/drive-file';
import serialize from '../../serializers/post';
//import savePostMentions from '../../core/save-post-mentions';
//import extractHashtags from '../../core/extract-hashtags';
//import registerHashtags from '../../core/register-hashtags';
import createFile from '../../common/add-file-to-drive';
import notify from '../../common/notify';
import event from '../../event';
import es from '../../db/elasticsearch';

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
 * @param {Object} reply
 * @param {Object} user
 * @param {Object} app
 * @return {void}
 */
module.exports = async (params, reply, user, app) =>
{
	// Init 'text' parameter
	let text = params.text;
	if (text !== undefined && text !== null) {
		text = text.trim();
		if (text.length === 0) {
			text = null;
		} else if (text[0] === '$') {
			return command(text);
		} else if (text.length > maxTextLength) {
			return reply(400, 'too long text');
		}
	} else {
		text = null;
	}

	// Init 'images' parameter
	let images = params.images;
	let files = [];
	if (images !== undefined && images !== null) {
		images = images.split(',');

		if (images.length > maxFileLength) {
			return reply(400, 'too many images');
		}

		// 重複チェック
		images = images.filter((x, i, self) => self.indexOf(x) === i);

		// Check file entities
		for (let i = 0; i < images.length; i++) {
			const image = images[i];

			// Get drive file
			const entity = await DriveFile.findOne({
				_id: new mongo.ObjectID(image),
				user: user._id
			}, {
				data: false
			});

			if (entity === null) {
				return reply(400, 'file not found');
			} else {
				files.push(entity);
			}
		}
	} else {
		files = null;
	}

	// Init 'repost' parameter
	let repost = params.repost;
	if (repost !== undefined && repost !== null) {
		// Get repostee
		repost = await Post.findOne({
			_id: new mongo.ObjectID(repost)
		});

		if (repost === null) {
			return reply(404, 'repostee is not found');
		} else if (repost.repost && !repost.text && !repost.images) {
			return reply(400, 'cannot repost from repost');
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
			return reply(400, '二重Repostです(NEED TRANSLATE)');
		}

		// 直近がRepost対象かつ引用じゃなかったらエラー
		if (latestPost &&
				latestPost._id.toString() === repost._id.toString() &&
				text === null && files === null) {
			return reply(400, '二重Repostです(NEED TRANSLATE)');
		}
	} else {
		repost = null;
	}

	// Init 'reply_to' parameter
	let replyTo = params.reply_to;
	if (replyTo !== undefined && replyTo !== null) {
		replyTo = await Post.findOne({
			_id: new mongo.ObjectID(replyTo)
		});

		if (replyTo === null) {
			return reply(404, 'reply to post is not found');
		}

		// 返信対象が引用でないRepostだったらエラー
		if (replyTo.repost && !replyTo.text && !replyTo.images) {
			return reply(400, 'cannot reply to repost');
		}
	} else {
		replyTo = null;
	}

	// テキストが無いかつ添付ファイルが無いかつRepostも無かったらエラー
	if (text === null && files === null && repost === null) {
		return reply(400, 'text, images or repost is required');
	}

	// 投稿を作成
	const res = await Post.insert({
		created_at: Date.now(),
		images: images ? files.map(file => file._id) : undefined,
		reply_to: replyTo ? replyTo._id : undefined,
		repost: repost ? repost._id : undefined,
		text: text,
		user: user._id
	});

	const post = res.ops[0];

	// Serialize
	const postObj = await serialize(post);

	// Reponse
	reply(postObj);

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
		notify(repost.user, 'repost', {
			post: post._id
		});

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
	if (post.text != null) {
		es.index({
			index: 'misskey',
			type: 'post',
			id: post._id.toString(),
			body: {
				text: post.text
			}
		});
	}

	// ハッシュタグ抽出
	//const hashtags = extractHashtags(text);

	// ハッシュタグをデータベースに登録
	//registerHashtags(user, hashtags);

	// メンションを抽出してデータベースに登録
	//savePostMentions(user, post, post.text);

	async function command(text) {
		const separator = ' ';
		const cmd = text.substr(1, text.indexOf(separator) - 1);
		const arg = text.substr(text.indexOf(separator) + 1);

		switch (cmd) {
			case 'write':
				// Create file
				await createFile(user, new Buffer(arg), Date.now() + '.txt', null, null);
				reply();
				break;
			default:
				reply(400, 'unknown command');
				break;
		}
	}
};
