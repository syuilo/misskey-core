import * as express from 'express';

// import App from '../../models/app';
import AuthSessToken from '../../models/auth-sess-token';
import User from '../../models/user';
// import serializeApp from '../../serializers/app';
import serializeUser from '../../serializers/user';

export default async function(req: express.Request, res: express.Response): Promise<any> {
	// Fetch token
	const token = await AuthSessToken
		.findOne({ token: req.params.token });

	if (token === null) {
		return res.status(400).send('Invalid token');
	}

	// Fetch App
	// const app = await App.findOne({ _id: token.app });

	// Get token from cookie
	const i = (req.headers['cookie'].match(/i=(\w+)/) || [null, null])[1];

	if (i === null) {
		return res.sendStatus(400);
	}

	const me = await User
		.findOne({ _web: i });

	if (me === null) {
		return res.sendStatus(400);
	}

	if (req.params.action === 'authorize') {
		res.render('authorized', {
			me: await serializeUser(me)
		});
	}
}
