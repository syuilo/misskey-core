'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../models/post';
import User from '../../models/user';
import serialize from '../../serializers/post';
//import savePostMentions from '../../core/save-post-mentions';
//import extractHashtags from '../../core/extract-hashtags';
//import registerHashtags from '../../core/register-hashtags';
import getDriveFile from '../../common/get-drive-file';
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
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, app, user) =>
{
	// Init 'text' parameter
	let text = params.text;
	if (text !== undefined && text !== null) {
		text = text.trim();
		if (text.length === 0) {
			text = null;
		} else if (text.length > maxTextLength) {
			return reply(400, 'too long text');
		}
	} else {
		text = null;
	}

	// Init 'reply_to' parameter
	let replyTo = params.reply_to;
	if (replyTo !== undefined && replyTo !== null) {
		const replyToPost = await Post.findOne({_id: new mongo.ObjectId(replyTo)});

		if (replyToPost === null) {
			return reply(404, 'reply to post is not found');
		} else if (replyToPost.hasOwnProperty('repost')) {
			return reply(400, 'cannot reply to repost');
		}
	} else {
		replyTo = null;
	}

	// Init 'files' parameter
	let files = params.files;
	if (files !== undefined && files !== null) {
		files = files.split(',');

		if (files.length === 0) {
			files = null;
		} else if (files.length > maxFileLength) {
			return reply(400, 'too many files');
		}

		if (files !== null) {
			// 重複チェック
			files = files.filter((x, i, self) => self.indexOf(x) === i);
		}
	} else {
		files = null;
	}

	// テキストが無いかつ添付ファイルも無かったらエラー
	if (text === null && files === null) {
		return reply(400, 'text or files is required');
	}

	// 添付ファイルがあれば添付ファイル取得
	if (files !== null) {
		files = await Promise.all(files.map(file => getDriveFile(user._id, file)));
	}

	// 投稿を作成
	const res = await Post.insert({
		created_at: Date.now(),
		files: files ? files.map(file => file.id) : null,
		next: null,
		prev: user.latest_post,
		reaction_counts: [],
		replies_count: 0,
		reply_to: replyTo,
		text: text,
		user: user._id
	});

	const post = res.ops[0];

	user.posts_count++;
	user.latest_post = post._id;
	post.user = user;

	const postObj = await serialize(post);

	reply(postObj);

	// Publish to stream
	event.publishPost(user._id, postObj);

	// ハッシュタグ抽出
	//const hashtags = extractHashtags(text);

	// ハッシュタグをデータベースに登録
	//registerHashtags(user, hashtags);

	// メンションを抽出してデータベースに登録
	//savePostMentions(user, post, post.text);

	// 作成した投稿を前の投稿の次の投稿に設定する
	if (user.latest_post !== null) {
		Post.updateOne({_id: user.latest_post}, {
			$set: { next: post._id }
		});
	}

	// ユーザー情報更新
	User.updateOne({_id: user._id}, {
		$set: user
	});

/*
	// Register to search database
	es.index({
		index: 'posts',
		type: 'post',
		id: post._id.toHexString(),
		body: {
			text: post.text
		}
	}, (error, response) => {
		if (error) {
			console.error(error);
		} else {
			console.log(response);
		}
	});*/
};
