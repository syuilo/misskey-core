import * as mongo from 'mongodb';
import * as redis from 'redis';
import config from './config';

type ID = string | mongo.ObjectID;

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

	public publishUserStream(userId: ID, type: string, message: Object): void {
		this.publish(`user-stream:${userId}`, type, message);
	}

	public publishTalkingStream(userId: ID, otherpartyId: ID, type: string, message: Object): void {
		this.publish(`messaging-stream:${userId}-${otherpartyId}`, type, message);
	}
}

const ev = new MisskeyEvent();

export default ev.publishUserStream.bind(ev);

export const publishTalkingStream = ev.publishTalkingStream.bind(ev);
