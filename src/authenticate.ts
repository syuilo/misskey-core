import * as mongo from 'mongodb';
import * as express from 'express';
import User from './models/user';
import config from './config';

export default (req: express.Request) =>
	new Promise<{ app: any, user: any, isWeb: boolean }>(async (resolve, reject): Promise<void> =>
{
	if (req.body['_i']) {
		const user = await User
			.findOne({_web: req.body['_i']});

		if (user === null) {
			reject('user not found');
			return;
		}

		resolve({
			app: null,
			user: user,
			isWeb: true
		});
		return;
	}

	if (!req.body['_web']) {
		resolve({ app: null, user: null, isWeb: false });
	} else if (req.body['_web'] !== config.apiPass) {
		reject('incorrect key');
	} else if (!req.body['_user']) {
		resolve({ app: null, user: null, isWeb: true });
	} else {
		const id = req.body['_user'];

		const user = await User
			.findOne({_id: new mongo.ObjectID(id)});

		resolve({
			app: null,
			user: user,
			isWeb: true
		});
	}
});
