import * as http from 'http';
import * as websocket from 'websocket';
import * as redis from 'redis';
import User from './models/user';
import config from '../config';

module.exports = (server: http.Server) => {
	/**
	 * Init websocket server
	 */
	const ws = new websocket.server({
		httpServer: server
	});

	ws.on('request', async (request) => {
		const connection = request.accept();

		const user = await authenticate(connection);

		// Connect to Redis
		const subscriber = redis.createClient(
			config.redis.port, config.redis.host);

		connection.on('close', () => {
			subscriber.unsubscribe();
			subscriber.quit();
		});

		const channel =
			request.resourceURL.pathname === '/' ? homeStream :
			request.resourceURL.pathname === '/messaging' ? messagingStream :
			null;

		if (channel !== null) {
			channel(request, connection, subscriber, user);
		} else {
			connection.close();
		}
	});
};

function authenticate(connection: websocket.connection): Promise<any> {
	return new Promise((resolve, reject) => {
		// Listen first message
		connection.on('message', async (data) => {
			const msg = JSON.parse(data.utf8Data);

			// Get user data
			const user = await User
				.findOne({ token: msg.i });

			if (user === null) {
				connection.close();
				return;
			}

			connection.send('authenticated');

			resolve(user);
		});
	});
}

function homeStream(request: websocket.request, connection: websocket.connection, subscriber: redis.RedisClient, user: any): void {
	// Subscribe Home stream channel
	subscriber.subscribe(`misskey:user-stream:${user._id}`);
	subscriber.on('message', (_, data) => {
		connection.send(data);
	});
}

function messagingStream(request: websocket.request, connection: websocket.connection, subscriber: redis.RedisClient, user: any): void {
	const otherparty = request.resourceURL.query.otherparty;

	// Subscribe messaging stream
	subscriber.subscribe(`misskey:messaging-stream:${user._id}-${otherparty}`);
	subscriber.on('message', (_, data) => {
		connection.send(data);
	});
}
