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

	public async driveFileCreated(userId: string, file: any): Promise<void> {
		this.io.to(userId).emit('drive_file_created', file);
	}

	public async driveFileUpdated(userId: string, file: any): Promise<void> {
		this.io.to(userId).emit('drive_file_updated', file);
	}

	public async driveFolderCreated(userId: string, folder: any): Promise<void> {
		this.io.to(userId).emit('drive_folder_created', folder);
	}
}

export default new MisskeyEvent();
