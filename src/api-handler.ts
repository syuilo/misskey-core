import * as express from 'express';

import { IEndpoint } from './endpoints';
import authenticate from './authenticate';
import _reply from './reply';
import limitter from './limitter';

export default async (endpoint: IEndpoint, req: express.Request, res: express.Response) =>
{
	const reply = _reply.bind(null, res);
	let ctx: any;

	// 認証
	try {
		ctx = await authenticate(req);
	} catch (e) {
		return reply(403, 'AUTHENTICATION_FAILED');
	}

	if (endpoint.webOnly && !ctx.isWeb) {
		return reply(403, 'ACCESS_DENIED');
	}

	if (endpoint.shouldBeSignin && ctx.user == null) {
		return reply(401, 'PLZ_SIGNIN');
	}

	if (endpoint.shouldBeSignin) {
		try {
			// レートリミット
			await limitter(endpoint, ctx);
		} catch (e) {
			reply(429);
		}
	}

	let exec = require(`${__dirname}/endpoints/${endpoint.name}`);

	if (endpoint.withFile) {
		exec = exec.bind(null, req.file);
	}

	// API呼び出し
	try {
		const res = await exec(req.body, ctx.user, ctx.app, ctx.isWeb);
		reply(res);
	} catch (e) {
		reply(400, e);
	}
};
