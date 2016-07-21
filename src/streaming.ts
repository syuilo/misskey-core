import * as socketio from 'socket.io';
import * as redis from 'socket.io-redis';
import User from './models/user';
import config from './config';

export default function (server: any): void {

	/**
	 * Init streaming server
	 */
	const io = socketio(server);

	/**
	 * Connect to Redis
	 */
	io.adapter(redis({
		key: 'misskey',
		host: config.redis.host,
		port: config.redis.port
	}));

	/**
	 * Authentication
	 */
	io.on('connection', socket => {
		socket.auth = false;

		socket.on('authentication', async (data: any) => {
			const webtoken = data._i;

			const user = await User
				.findOne({_web: webtoken});

			if (user === null) {
				socket.emit('unauthorized', {message: 'Authentication failed'}, () => {
					socket.disconnect();
				});
				return;
			}

			socket.client.user = user;
			socket.auth = true;
			socket.join(user._id);
			socket.emit('authenticated', true);
		});
	});
}
