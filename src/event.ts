import * as mongo from 'mongodb';
import * as redis from 'redis';
import Post from './models/post';
import Following from './models/following';
import TalkGroup from './models/talk-group';
import serializeUser from './serializers/user';
import serializePost from './serializers/post';
import serializeNotification from './serializers/notification';
import config from './config';

class MisskeyEvent {
	private redisClient: redis.RedisClient;

	constructor() {
		// Connect to Redis
		this.redisClient = redis.createClient(
			config.redis.port, config.redis.host);
	}

	private publish(channel: string, type: string, message: Object): void {
		this.redisClient.publish(`misskey:${channel}`, JSON.stringify({
			type: type,
			body: message
		}));
	}

	private userstream(userId: string | mongo.ObjectID, type: string, message: Object): void {
		this.publish(`user-stream:${userId}`, type, message);
	}

	public async publishPost(userId: string, post: any): Promise<void> {
		// 自分のストリーム
		this.userstream(userId, 'post', post);

		// 自分のフォロワーのストリーム
		const followers = await Following
			.find({ followee: userId }, {
				follower: true,
				_id: false
			})
			.toArray();

		followers.forEach(following => {
			this.userstream(following.follower, 'post', post);
		});
	}

	public async publishTalkMessage(messageRaw: any, messageObj: any): Promise<void> {
		// 自分のストリーム
		this.userstream(messageRaw.user, 'talk_message', messageObj);

		if (messageRaw.recipient) {
			// 相手のストリーム
			this.userstream(messageRaw.recipient, 'talk_message', messageObj);
		} else if (messageRaw.group) {
			const group = await TalkGroup.findOne({
				_id: messageRaw.group
			});

			// メンバーのストリーム
			group.members.forEach(member => {
				this.userstream(member, 'talk_message', messageObj);
			});
		}
	}

	public async like(userId: mongo.ObjectID, postId: mongo.ObjectID): Promise<void> {
		const post = await Post.findOne({ _id: postId });
		this.userstream(post.user, 'like', {
			user: await serializeUser(userId),
			post: await serializePost(post, post.user)
		});
	}

	public async follow(follower: mongo.ObjectID, followee: mongo.ObjectID): Promise<void> {
		this.userstream(followee, 'follow', {
			user: await serializeUser(follower)
		});
	}

	public async notify(notification: any): Promise<void> {
		this.userstream(notification.i, 'notification', await serializeNotification(notification));
	}

	public async driveFileCreated(userId: string, file: any): Promise<void> {
		this.userstream(userId, 'drive_file_created', file);
	}

	public async driveFileUpdated(userId: string, file: any): Promise<void> {
		this.userstream(userId, 'drive_file_updated', file);
	}

	public async driveFolderCreated(userId: string, folder: any): Promise<void> {
		this.userstream(userId, 'drive_folder_created', folder);
	}

	public async driveFolderUpdated(userId: string, folder: any): Promise<void> {
		this.userstream(userId, 'drive_folder_updated', folder);
	}
}

export default new MisskeyEvent();
