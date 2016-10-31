import * as express from 'express';
import User from './models/user';
import config from './config';

export interface IAuthContext {
	/**
	 * App which requested
	 */
	app: any;

	/**
	 * Authenticated user
	 */
	user: any;

	/**
	 * Weather if the request is via the Misskey Web Client or not
	 */
	isWeb: boolean;
}

export default (req: express.Request) =>
	new Promise<IAuthContext>(async (resolve, reject) => {
	const webToken = req.body['_i'];
	if (webToken) {
		const user = await User
			.findOne({ _web: webToken });

		if (user === null) {
			return reject('user not found');
		}

		return resolve({
			app: null,
			user: user,
			isWeb: true
		});
	}

	const webKey = req.body['_web'];
	if (webKey && webKey === config.webSecret) {
		return resolve({ app: null, user: null, isWeb: true });
	}

	// const userKey = req.headers['user-key'];

	return resolve({ app: null, user: null, isWeb: false });
});
