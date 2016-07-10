import {Post, Post} from '../../db/db';
import {IApplication, IUser, IPost, IPost, IDriveFile} from '../../db/interfaces';
import savePostMentions from '../../core/save-post-mentions';
import extractHashtags from '../../core/extract-hashtags';
import registerHashtags from '../../core/register-hashtags';
import getDriveFile from '../../core/get-drive-file';
import event from '../../event';

const maxTextLength = 300;
const maxFileLength = 4;

/**
 * 投稿を作成します
 * @param app API利用App
 * @param user API利用ユーザー
 * @param text 本文
 * @param files 添付するファイルのID
 * @return 作成された投稿オブジェクト
 */
export default (app: IApplication, user: IUser, text?: string, files?: string[]) =>
	new Promise<any>((resolve, reject) =>
{
	// Init 'text' parameter
	if (text !== undefined && text !== null) {
		text = text.trim();
		if (text.length === 0) {
			text = null;
		} else if (text.length > maxTextLength) {
			return reject('too-long-text');
		}
	} else {
		text = null;
	}

	// Init 'files' parameter
	if (files !== undefined && files !== null) {
		if (files.length === 0) {
			files = null;
		} else if (files.length > maxFileLength) {
			return reject('too-many-files');
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
				return reject('duplicate-files');
			}
		}
	} else {
		files = null;
	}

	// テキストが無いかつ添付ファイルも無かったらエラー
	if (text === null && files === null) {
		return reject('text-or-files-is-required');
	}

	// 添付ファイルがあれば添付ファイルのバリデーションを行う
	if (files !== null) {
		Promise
			.all(files.map(file => getDriveFile(user.id, file)))
			.then(create, reject);
	} else {
		create(null);
	}

	function create(files: IDriveFile[]): void {
		// ハッシュタグ抽出
		const hashtags: string[] = extractHashtags(text);

		// 作成
		Post.create({
			user: user.id,
			files: files !== null ? files.map(file => file.id) : null,
			text: text,
			prev: user.latest_post,
			next: null
		})
		.lean()
		.exec((createErr: any, createdPost: IPost) => {
			if (createErr) {
				return reject(createErr);
			}

			resolve(createdPost);

			// 投稿数インクリメント
			user.posts_count++;
			// 最終Postを更新
			user.latest_post = createdPost._id;
			user.save();

			// ハッシュタグをデータベースに登録
			registerHashtags(user, hashtags);

			// メンションを抽出してデータベースに登録
			savePostMentions(user, createdPost, createdPost.text);

			// 作成した投稿を前の投稿の次の投稿に設定する
			if (user.latest_post !== null) {
				Post.findByIdAndUpdate(user.latest_post, { $set: { next: createdPost._id } });
			}

			event.publishPost(user.id, createdPost);
		});
	}
});
