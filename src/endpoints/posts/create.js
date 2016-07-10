'use strict';

/**
 * Module dependencies
 */
const Post = require('../../models/post');
const savePostMentions = require('../../core/save-post-mentions');
const extractHashtags = require('../../core/extract-hashtags');
const registerHashtags = require('../../core/register-hashtags');
const getDriveFile = require('../../core/get-drive-file');
const event = require('../../event');

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
 * @param {Object} res
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
export default async (params, res, app, user) =>
{
	// Init 'text' parameter
	let text = params.text;
	if (text !== undefined && text !== null) {
		text = text.trim();
		if (text.length === 0) {
			text = null;
		} else if (text.length > maxTextLength) {
			return res(400, 'too-long-text');
		}
	} else {
		text = null;
	}

	// Init 'files' parameter
	let files = params.files;
	if (files !== undefined && files !== null) {
		files = files.split(',');

		if (files.length === 0) {
			files = null;
		} else if (files.length > maxFileLength) {
			return res(400, 'too-many-files');
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
		return res(400, 'text-or-files-is-required');
	}

	// 添付ファイルがあれば添付ファイル取得
	if (files !== null) {
		files = await Promise.all(files.map(file => getDriveFile(user.id, file)));
	}

	// 作成
	const createdPost = await Post.create({
		user: user.id,
		files: files ? files.map(file => file.id) : null,
		text: text,
		prev: user.latest_post,
		next: null
	});

	res(createdPost);

	// ユーザー情報更新
	user.posts_count++;
	user.latest_post = createdPost._id;
	user.save();

	// ハッシュタグ抽出
	const hashtags = extractHashtags(text);

	// ハッシュタグをデータベースに登録
	registerHashtags(user, hashtags);

	// メンションを抽出してデータベースに登録
	savePostMentions(user, createdPost, createdPost.text);

	// 作成した投稿を前の投稿の次の投稿に設定する
	if (user.latest_post !== null) {
		Post.findByIdAndUpdate(user.latest_post, {
			$set: { next: createdPost._id }
		});
	}

	// Publish to stream
	event.publishPost(user.id, createdPost);
};
