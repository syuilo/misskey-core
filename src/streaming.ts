import * as websocket from 'websocket';
import * as redis from 'redis';
import User from './models/user';
import config from './config';

export default function (server: any): void {

	/**
	 * Init websocket server
	 */
	const ws = new websocket.server({
		httpServer: server
	});

	ws.on('request', request => {
		const connection = request.accept();

		// Connect to Redis
		const subscriber = redis.createClient(
			config.redis.port, config.redis.host);

		connection.on('message', async (data) => {
			const msg = JSON.parse(data.utf8Data);

			// Get user data
			const user = await User
				.findOne({ _web: msg.i });

			if (user === null) {
				connection.close();
				return;
			}

			connection.send('authenticated');

			// Subscribe Home stream channel
			subscriber.subscribe(`misskey:user-stream:${user._id}`);
			subscriber.on('message', (_: any, data: any) => {
				connection.send(data);
			});
		});

		connection.on('close', () => {
			console.log('CLOSED');
			subscriber.unsubscribe();
			subscriber.quit();
		});
	});
}
