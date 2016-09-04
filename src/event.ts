import * as mongo from 'mongodb';
import * as redis from 'redis';
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

	public userstream(userId: string | mongo.ObjectID, type: string, message: Object): void {
		this.publish(`user-stream:${userId}`, type, message);
	}
}

const ev = new MisskeyEvent();

export default ev.userstream.bind(ev);
