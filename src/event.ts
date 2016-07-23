const oi = require('socket.io-emitter');
import Following from './models/following';
import config from './config';

class MisskeyEvent {
	private io: any;

	constructor() {
		this.io = oi({
			key: 'misskey',
			host: config.redis.host,
			port: config.redis.port
		});
	}

	public async publishPost(userId: string, post: any): Promise<void> {
		// 自分のストリーム
		this.io.to(userId).emit('post', post);

		// 自分のフォロワーのストリーム
		const followers = await Following
			.find({followee: userId}, {
				follower: true,
				_id: false
			})
			.toArray();

		followers.forEach(following => {
			this.io.to(following.follower).emit('post', post);
		});
	}

	public publishNotification(notification: INotification): void {
		this.publish(`user-stream:${notification.user}`, JSON.stringify({
			type: 'notification',
			value: notification.toObject()
		}));
	}

	public publishReadTalkUserMessage(otherpartyId: string, meId: string, message: ITalkMessage): void {
		this.publish(`talk-user-stream:${otherpartyId}-${meId}`, JSON.stringify({
			type: 'read',
			value: message.id
		}));
	}

	public publishDeleteTalkUserMessage(meId: string, otherpartyId: string, message: ITalkMessage): void {
		this.publish(`talk-user-stream:${otherpartyId}-${meId}`, JSON.stringify({
			type: 'otherparty-message-delete',
			value: message.id
		}));
		this.publish(`talk-user-stream:${meId}-${otherpartyId}`, JSON.stringify({
			type: 'me-message-delete',
			value: message.id
		}));
	}

	public publishReadTalkGroupMessage(groupId: string, message: ITalkMessage): void {
		this.publish(`talk-group-stream:${groupId}`, JSON.stringify({
			type: 'read',
			value: message.id
		}));
	}

	public publishDeleteTalkGroupMessage(groupId: string, message: ITalkMessage): void {
		this.publish(`talk-group-stream:${groupId}`, JSON.stringify({
			type: 'delete-message',
			value: message.id
		}));
	}

	public publishUserTalkMessage(meId: string, recipientId: string, message: ITalkUserMessage): void {
		[
			[`user-stream:${recipientId}`, 'talk-user-message'],
			[`talk-user-stream:${recipientId}-${meId}`, 'message'],
			[`talk-user-stream:${meId}-${recipientId}`, 'message']
		].forEach(([channel, type]) => {
			this.publish(channel, JSON.stringify({
				type: type,
				value: {
					id: message.id,
					userId: meId,
					text: message.text
				}
			}));
		});
	}

	public publishGroupTalkMessage(message: ITalkMessage, group: ITalkGroup): void {
		(<string[]>group.members).map(member => [`user-stream:${member}`, 'talk-user-message']).concat([
			[`talk-group-stream:${group.id}`, 'message']
		]).forEach(([channel, type]) => {
			this.publish(channel, JSON.stringify({
				type: type,
				value: {
					id: message.id
				}
			}));
		});
	}

	private publish(channel: string, message: string): void {
		this.redisConnection.publish(`misskey#${channel}`, message);
	}
}

export default new MisskeyEvent();
