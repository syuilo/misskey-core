import * as redis from 'redis';
import Following from './models/following';
import config from './config';

class MisskeyEvent {
	private redisConnection: any;

	constructor() {
		// super();

		// Initialize Redis connection
		this.redisConnection = redis.createClient(
			config.redis.port,
			config.redis.host,
			{
				auth_pass: config.redis.password
			}
		);
	}

	public publishPost(userId: string, post: any): void {
		const message = JSON.stringify({
			type: 'post',
			value: post
		});

		// 自分のストリーム
		this.publish(`user-stream:${userId}`, message);

		// 自分のフォロワーのストリーム
		Following
		.find({followee: userId})
		.select({
			follower: 1,
			_id: 0
		})
		.lean()
		.exec((_: any, followings: IFollowing[]) => {
			followings.forEach(following => {
				this.publish(`user-stream:${following.follower}`, message);
			});
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
		this.redisConnection.publish(`misskey:${channel}`, message);
	}
}

export default new MisskeyEvent();
