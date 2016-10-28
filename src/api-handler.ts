import * as express from 'express';
import authenticate from './authenticate';
import limitter from './limitter';

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isDebug = !isProduction;

export default (endpoint: any, req: express.Request, res: express.Response) =>
{
	if (isDebug) {
		console.log(`REQ: ${endpoint.name}`);
	}

	function reply(x?: any, y?: any): void {
		if (x === undefined) {
			res.sendStatus(204);
		} else if (typeof x === 'number') {
			if (x === 500) {
				res.status(500).send({
					error: 'INTERNAL_ERROR'
				});

				if (isDebug) {
					console.log('REP: ERROR: INTERNAL');
				}
			} else {
				res.status(x).send({
					error: y
				});

				if (isDebug) {
					console.log(`REP: ERROR: ${x} ${y}`);
				}
			}
		} else {
			res.send(x);

			if (isDebug) {
				console.log(`REP: OK: 200 ${JSON.stringify(x)}`);
			}
		}
	}

	function call(ctx: any): void {
		try {
			if (endpoint.withFile) {
				require(`${__dirname}/endpoints/${endpoint.name}`)(
					req.body, req.file, reply, ctx.user, ctx.app, ctx.isWeb);
			} else {
				require(`${__dirname}/endpoints/${endpoint.name}`)(
					req.body, reply, ctx.user, ctx.app, ctx.isWeb);
			}
		} catch (e) {
			console.error(e);
			reply(500);
		}
	}

	authenticate(req).then(ctx => {
		if (endpoint.webOnly && !ctx.isWeb) {
			return reply(403, 'ACCESS_DENIED');
		}

		if (endpoint.login) {
			if (ctx.user === null) {
				return reply(401, 'PLZ_SIGNIN');
			}

			limitter(endpoint, ctx).then(() => call(ctx), err => reply(429));
		} else {
			call(ctx);
		}
	}, err => {
		console.error(err);
		reply(403, 'AUTHENTICATION_FAILED');
	});
};
