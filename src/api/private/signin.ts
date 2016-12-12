import * as express from 'express';
import * as bcrypt from 'bcrypt';
import User from '../models/user';
import Signin from '../models/signin';
import serialize from '../serializers/signin';
import event from '../event';

import config from '../../config';

export default async (req: express.Request, res: express.Response): Promise<any> => {
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Origin', config.url);

	const username = req.body['username'];
	const password = req.body['password'];

	const user = await User.findOne({
		username_lower: username.toLowerCase()
	});

	if (user === null) {
		return res.status(404).send('user not found');
	}

	bcrypt.compare(password, user.password, async (compareErr, same): Promise<any> => {
		if (compareErr) {
			return res.sendStatus(500);
		} else if (!same) {
			return res.status(400).send('incorrect password');
		}

		const expires = 1000 * 60 * 60 * 24 * 365; // One Year
		res.cookie('i', user.token, {
			path: '/',
			domain: `.${config.host}`,
			secure: config.url.substr(0, 5) === 'https',
			httpOnly: false,
			expires: new Date(Date.now() + expires),
			maxAge: expires
		});

		res.sendStatus(204);

		// Append signin history
		const inserted = await Signin.insert({
			created_at: new Date(),
			user_id: user._id,
			ip: req.ip,
			headers: req.headers
		});

		const record = inserted.ops[0];

		// Publish signin event
		event(user._id, 'signin', await serialize(record));
	});
};
