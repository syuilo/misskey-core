import * as mongo from 'mongodb';
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
	} else if (!req.headers['user']) {
		resolve({ app: null, user: null, isOfficial: true });
	} else {
		const id = req.headers['user'];

		const user = await User
			.findOne({_id: new mongo.ObjectID(id)});

		user.id = user._id;

		resolve({
			app: null,
			user: user,
			isOfficial: true
		});
	}
});
