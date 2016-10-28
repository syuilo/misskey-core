import * as express from 'express';

import { IEndpoint } from './endpoints';
import authenticate from './authenticate';
import _reply from './reply';
import limitter from './limitter';

export default (endpoint: IEndpoint, req: express.Request, res: express.Response) =>
{
	if (IS_DEBUG) {
		console.log(`REQ: ${endpoint.name}`);
	}

	const reply = _reply.bind(null, res);

	authenticate(req).then(async (ctx) => {
		if (endpoint.webOnly && !ctx.isWeb) {
			return reply(403, 'ACCESS_DENIED');
		}

		if (endpoint.shouldBeSignin && ctx.user == null) {
			return reply(401, 'PLZ_SIGNIN');
		}

		if (endpoint.shouldBeSignin) {
			try {
				await limitter(endpoint, ctx);
			} catch (e) {
				reply(429);
			}
		}

		let exec = require(`${__dirname}/endpoints/${endpoint.name}`);

		if (endpoint.withFile) {
			exec = exec.bind(null, req.file);
		}

		exec(req.body, reply, ctx.user, ctx.app, ctx.isWeb);
	}, err => {
		console.error(err);
		reply(403, 'AUTHENTICATION_FAILED');
	});
};
