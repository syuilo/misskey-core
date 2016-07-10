import Post from '../../models/post';
import savePostMentions from '../../core/save-post-mentions';
import extractHashtags from '../../core/extract-hashtags';
import registerHashtags from '../../core/register-hashtags';
import getDriveFile from '../../core/get-drive-file';
import event from '../../event';

const maxTextLength = 300;
const maxFileLength = 4;

export default async (params, res, app, user) =>
{
	let text = params.text;

	// Init 'text' parameter
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

	let files = params.files;

	// Init 'files' parameter
	if (files !== undefined && files !== null) {
		files = files.split(',');

		if (files.length === 0) {
			files = null;
		} else if (files.length > maxFileLength) {
			return res(400, 'too-many-files');
		}

		if (files !== null) {
			// 重複チェック
			let isRejected = false;
			files.forEach(file => {
				let count = 0;
				files.forEach(file2 => {
					if (file === file2) {
						count++;
						if (count === 2) {
							isRejected = true;
						}
					}
				});
			});

			if (isRejected) {
				return res(400, 'duplicate-files');
			}
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

	// 投稿数インクリメント
	user.posts_count++;
	// 最終Postを更新
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

	event.publishPost(user.id, createdPost);
};
