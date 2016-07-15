import * as express from 'express';
import User from './models/user';
import config from './config';

export default (req: express.Request) =>
	new Promise<{ app: any, user: any, isOfficial: boolean }>(async (resolve, reject) =>
{
	if (!req.headers['pass']) {
		resolve({ app: null, user: null, isOfficial: false });
	} else if (req.headers['pass'] !== config.apiPass) {
		reject('incorrect-pass');
	} else if (!req.headers['user'] || req.headers['user'] === 'null') {
		resolve({ app: null, user: null, isOfficial: true });
	} else {
		const user = await User
			.findById(req.headers['user'])
			.lean()
			.exec();

		user.id = user._id;

		resolve({
			app: null,
			user: user,
			isOfficial: true
		});
	}
});
