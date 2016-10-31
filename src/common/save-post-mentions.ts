import {PostMention} from '../db/db';
import {IUser, IPost, IPostMention} from '../db/interfaces';
import extractMentions from './extract-mentions';
import createNotification from './create-notification';

export default function(author: IUser, post: IPost, text: string): void {
	extractMentions(text).then(users => {
		users.forEach(user => {
			PostMention.create({
				user: user._id,
				post: post.id
			}, (createErr: any, createdMention: IPostMention) => {
				createNotification(null, user._id, 'mention', {
					postId: post.id
				});
			});
		});
	});
}
