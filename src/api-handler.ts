import * as express from 'express';
import authenticate from './authenticate';
import _reply from './reply';
import limitter from './limitter';

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isDebug = !isProduction;

export default (endpoint: any, req: express.Request, res: express.Response) =>
{
	if (isDebug) {
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

		if (endpoint.withFile) {
			require(`${__dirname}/endpoints/${endpoint.name}`)(
				req.body, req.file, reply, ctx.user, ctx.app, ctx.isWeb);
		} else {
			require(`${__dirname}/endpoints/${endpoint.name}`)(
				req.body, reply, ctx.user, ctx.app, ctx.isWeb);
		}
	}, err => {
		console.error(err);
		reply(403, 'AUTHENTICATION_FAILED');
	});
};
