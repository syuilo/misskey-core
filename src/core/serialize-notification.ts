import {User, Post, TalkUserMessage} from '../db/db';
import {IUser, IPost, ITalkUserMessage} from '../db/interfaces';
import serializePost from '../core/serialize-post';
import serializeTalkMessage from '../core/serialize-talk-message';

export default function(
	notification: any,
	me: IUser
): Promise<Object> {
	const type: string = notification.type;
	const content: any = notification.content;

	return new Promise<Object>((resolve, reject) => {
		switch (type) {
			case 'like':
			case 'repost':
				User.findById(content.userId, (userErr: any, user: IUser) => {
					Post.findById(content.postId, (postErr: any, post: IPost) => {
						notification.content.user = user.toObject();
						notification.content.post = post.toObject();
						resolve(notification);
					});
				});
				break;
			case 'mention':
				Post.findById(content.postId, (postErr: any, post: IPost) => {
					serializePost(post, me).then((post2: any) => {
						notification.content.post = post2;
						resolve(notification);
					}, reject);
				});
				break;
			case 'follow':
				User.findById(content.userId, (userErr: any, user: IUser) => {
					notification.content.user = user.toObject();
					resolve(notification);
				});
				break;
			case 'talk-user-message':
				TalkUserMessage.findById(content.messageId, (messageErr: any, message: ITalkUserMessage) => {
					serializeTalkMessage(message, me).then((message2: any) => {
						notification.content.message = message2;
						resolve(notification);
					}, reject);
				});
				break;
			default:
				reject('unknown-notification-type');
				break;
		}
	});
}
