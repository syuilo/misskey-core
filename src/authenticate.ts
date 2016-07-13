import * as express from 'express';
import User from './models/user';
import config from './config';

export default (req: express.Request) =>
	new Promise<{ app: any, user: any, isOfficial: boolean }>(async (resolve, reject) =>
{
	if (req.headers['pass'] === undefined || req.headers['pass'] === null) {
		resolve({ app: null, user: null, isOfficial: false });
	} else if (req.headers['pass'] !== config.apiPass) {
		reject('incorrect-pass');
	} else if (req.headers['user'] === undefined || req.headers['user'] === null || req.headers['user'] === 'null') {
		resolve({ app: null, user: null, isOfficial: true });
	} else {
		const user = await User
			.findById(req.headers['user'])
			.lean()
			.exec();

		resolve({
			app: null,
			user: user,
			isOfficial: true
		});
	}
});
