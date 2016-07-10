import * as express from 'express';
import * as redis from 'redis';
import * as Limiter from 'ratelimiter';
import authenticate from './authenticate';
import config from './config';

const limiterDB = redis.createClient(
	config.redis.port,
	config.redis.host,
	{
		auth_pass: config.redis.password
	}
);

export default (endpoint, req, res) => {

	const limitKey = endpoint.hasOwnProperty('limitKey')
		? endpoint.limitKey
		: endpoint.name;

	function response(x, y) {
		if (typeof x === 'number') {
			res.status(x).send(y);
		} else {
			res.send(x);
		}
	}

	// 短い期間の方のリミット
	function detectBriefInterval(ctx) {
		const minIntervalLimiter = new Limiter({
			id: `${ctx.user.id}:${endpoint.name}:for-detect-brief-interval`,
			duration: endpoint.minInterval,
			max: 1,
			db: limiterDB
		});

		minIntervalLimiter.get((limitErr, limit) => {
			if (limitErr !== null) {
				res.status(500).send('something-happened');
			} else if (limit.remaining === 0) {
				res.status(429).send('brief-interval-detected');
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
	function rateLimit(ctx) {
		const limiter = new Limiter({
			id: `${ctx.user.id}:${limitKey}`,
			duration: endpoint.limitDuration,
			max: endpoint.limitMax,
			db: limiterDB
		});

		limiter.get((limitErr, limit) => {
			if (limitErr !== null) {
				res.status(500).send('something-happened');
			} else if (limit.remaining === 0) {
				res.status(429).send('rate-limit-exceeded');
			} else {
				call(ctx);
			}
		});
	}

	function call(ctx) {
		require(`${__dirname}/endpoints/${endpoint.name}`).default(
			req.body, response, ctx.app, ctx.user, ctx.isOfficial);
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
		res.status(403).send('authentication-failed');
	});
};
