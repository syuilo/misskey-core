import {Post} from '../../db/db';
import {IApplication, IUser, IPost, IDriveFile} from '../../db/interfaces';

/**
 * 投稿を取得します
 * @param user ユーザー
 * @param id 投稿ID
 * @return 投稿オブジェクト
 */
export default (user: IUser, id: string) =>
	new Promise<any>((resolve, reject) =>
{
	Post.findById(id, (err, post) => {
		resolve(post.toObject());
	});
});
