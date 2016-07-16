import {PostMention} from '../db/db';
import {IUser, IPost, IPostMention} from '../db/interfaces';
import extractMentions from './extract-mentions';
import createNotification from './create-notification';

export default function(author: IUser, post: IPost, text: string): void {
	extractMentions(text).then(users => {
		users.forEach(user => {
			PostMention.create({
				user: user.id,
				post: post.id
			}, (createErr: any, createdMention: IPostMention) => {
				// 通知を作成
				createNotification(null, user.id, 'mention', {
					postId: post.id
				});
			});
		});
	});
}
