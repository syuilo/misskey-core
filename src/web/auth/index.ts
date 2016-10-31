import * as express from 'express';

import App from '../../models/app';
import AuthSessToken from '../../models/auth-sess-token';
import User from '../../models/user';

export default async function(req: express.Request, res: express.Response): Promise<any> {
	// Fetch token
	const token = await AuthSessToken
		.findOne({ token: req.params.token });

	if (token === null) {
		return res.status(400).send('Invalid token');
	}

	// Fetch App
	const app = await App
		.findOne({ _id: token.app });

	// Get token from cookie
	const i = (req.headers['cookie'].match(/i=(\w+)/) || [null, null])[1];

	if (i) {
		const me = await User
			.findOne({ _web: i });

		res.render('auth', {
			me,
			app
		});
	} else {
		res.render('auth/signin');
	}
}
