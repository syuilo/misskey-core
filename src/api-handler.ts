/* tslint:disable:variable-name */

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
	});

export default (endpoint: any, req: express.Request, res: express.Response) => {

	authenticate(req).then(ctx => {
		if (endpoint.login) {
			const limitKey = endpoint.hasOwnProperty('limitKey') ? endpoint.limitKey : endpoint.name;

			if (endpoint.hasOwnProperty('minInterval')) {
				detectBriefInterval();
			} else if (endpoint.hasOwnProperty('limitDuration') && endpoint.hasOwnProperty('limitMax')) {
				rateLimit();
			} else {
				call();
			}

			// 短い期間の方のリミット
			function detectBriefInterval(): void {
				const minIntervalLimiter = new Limiter({
					id: `${ctx.user.id}:${endpoint.name}:for-detect-brief-interval`,
					duration: endpoint.minInterval,
					max: 1,
					db: limiterDB
				});

				minIntervalLimiter.get((limitErr, limit) => {
					if (limitErr !== null) {
						res.status(500).send({
							error: 'something happened',
							id: 'limitter1'
						});
					} else if (limit.remaining === 0) {
						res.status(429).send({
							error: 'brief interval detected',
							id: 'brief-interval-detected'
						});
					} else {
						if (endpoint.hasOwnProperty('limitDuration') && endpoint.hasOwnProperty('limitMax')) {
							rateLimit();
						} else {
							call();
						}
					}
				});
			}

			// 長い期間の方のリミット
			function rateLimit(): void {
				const limiter = new Limiter({
					id: `${ctx.user.id}:${limitKey}`,
					duration: endpoint.limitDuration,
					max: endpoint.limitMax,
					db: limiterDB
				});

				limiter.get((limitErr, limit) => {
					if (limitErr !== null) {
						res.status(500).send({
							error: 'something happened',
							id: 'limitter2'
						});
					} else if (limit.remaining === 0) {
						res.status(429).send({
							error: 'rate limit exceeded',
							id: 'rate-limit-exceeded'
						});
					} else {
						call();
					}
				});
			}
		} else {
			call();
		}

		function call(): void {
			require(`${__dirname}/rest/${endpoint.name}`).default(
				req, res, ctx.app, ctx.user, ctx.isOfficial);
		}
	}, (err: any) => {
		res.status(403).send({
			error: 'authentication failed',
			id: 'authentication-failed'
		});
	});
};
