import * as express from 'express';
import User from './models/user';
import config from './config';

export default (req: express.Request) =>
	new Promise<{ app: any, user: any, isWeb: boolean }>(async (resolve, reject) =>
{
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
	if (webKey && webKey == config.webSecret) {
		return resolve({ app: null, user: null, isWeb: true });
	}
});
