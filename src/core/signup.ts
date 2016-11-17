import * as express from 'express';
import * as request from 'request';
import * as bcrypt from 'bcrypt';
import rndstr from 'rndstr';
import User from '../models/user';
import serialize from '../serializers/user';
import es from '../db/elasticsearch';

import config from '../config';

export default (req: express.Request, res: express.Response) => {
	request({
		url: 'https://www.google.com/recaptcha/api/siteverify',
		method: 'POST',
		form: {
			secret: config.recaptcha.secretKey,
			response: req.body['g-recaptcha-response']
		}
	}, (err, response, body) => {
		if (err) {
			console.error(err);
			res.sendStatus(500);
			return;
		}

		const parsed = JSON.parse(body);

		if (parsed.success) {
			signup();
		} else {
			res.status(400).send('recaptcha-failed');
		}
	});

	async function signup(): Promise<any> {
		const username = req.body['username'];
		const password = req.body['password'];
		const name = '名無し';

		// Validate username
		if (!/^[a-zA-Z0-9\-]{3,20}$/.test(username)) {
			return res.sendStatus(400);
		}

		// Generate hash of password
		const salt = bcrypt.genSaltSync(14);
		const hash = bcrypt.hashSync(password, salt);

		// Generate secret
		const secret = rndstr('a-zA-Z0-9', 32);

		// Create account
		const inserted = await User.insert({
			_web: secret,
			avatar: null,
			banner: null,
			birthday: null,
			created_at: new Date(),
			bio: null,
			email: null,
			followers_count: 0,
			following_count: 0,
			links: null,
			location: null,
			name: name,
			password: hash,
			posts_count: 0,
			likes_count: 0,
			liked_count: 0,
			drive_capacity: 1073741824, // 1GB
			username: username,
			username_lower: username.toLowerCase()
		});

		const account = inserted.ops[0];

		// Response
		res.send(await serialize(account));

		// Create search index
		es.index({
			index: 'misskey',
			type: 'user',
			id: account._id.toString(),
			body: {
				username: username
			}
		});
	}
};
