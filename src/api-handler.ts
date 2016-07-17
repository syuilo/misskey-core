import * as express from 'express';
import * as redis from 'redis';
import * as Limiter from 'ratelimiter';
import authenticate from './authenticate';
import config from './config';

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isDebug = !isProduction;

const limiterDB = redis.createClient(
	config.redis.port,
	config.redis.host,
	{
		auth_pass: config.redis.password
	}
);

export default (endpoint: any, req: express.Request, res: express.Response) =>
{
	if (isDebug) {
		console.log(`REQ: ${endpoint.name}`);
	}

	const limitKey = endpoint.hasOwnProperty('limitKey')
		? endpoint.limitKey
		: endpoint.name;

	function reply(x: any, y: any): void {
		if (x === undefined) {
			res.sendStatus(204);
		} else if (typeof x === 'number') {
			res.status(x).send({
				error: y
			});

			if (isDebug) {
				console.log(`REP: ERROR: ${x} ${y}`);
			}
		} else {
			res.send(x);

			if (isDebug) {
				console.log(`REP: OK: 200 ${JSON.stringify(x)}`);
			}
		}
	}

	// 短い期間の方のリミット
	function detectBriefInterval(ctx: any): void {
		const minIntervalLimiter = new Limiter({
			id: `${ctx.user._id}:${limitKey}:for-detect-brief-interval`,
			duration: endpoint.minInterval,
			max: 1,
			db: limiterDB
		});

		minIntervalLimiter.get((limitErr, limit) => {
			if (limitErr !== null) {
				reply(500, 'something-happened');
			} else if (limit.remaining === 0) {
				reply(429, 'brief-interval-detected');
			} else {
				if (endpoint.hasOwnProperty('limitDuration') && endpoint.hasOwnProperty('limitMax')) {
					rateLimit(ctx);
				} else {
					call(ctx);
				}
			}
		});
	}

	// 長い期間の方のリミット
	function rateLimit(ctx: any): void {
		const limiter = new Limiter({
			id: `${ctx.user._id}:${limitKey}`,
			duration: endpoint.limitDuration,
			max: endpoint.limitMax,
			db: limiterDB
		});

		limiter.get((limitErr, limit) => {
			if (limitErr !== null) {
				reply(500, 'something-happened');
			} else if (limit.remaining === 0) {
				reply(429, 'rate-limit-exceeded');
			} else {
				call(ctx);
			}
		});
	}

	function call(ctx: any): void {
		try {
			require(`${__dirname}/endpoints/${endpoint.name}`)(
				req.body, reply, ctx.app, ctx.user, ctx.isOfficial);
		} catch (e) {
			console.error(e);
			reply(500, 'something-happened');
		}
	}

	authenticate(req).then(ctx => {
		if (endpoint.login) {
			if (endpoint.hasOwnProperty('minInterval')) {
				detectBriefInterval(ctx);
			} else if (endpoint.hasOwnProperty('limitDuration') && endpoint.hasOwnProperty('limitMax')) {
				rateLimit(ctx);
			} else {
				call(ctx);
			}
		} else {
			call(ctx);
		}
	}, err => {
		console.error(err);
		reply(403, 'authentication-failed');
	});
};
