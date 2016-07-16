'use strict';

/**
 * Module dependencies
 */
import * as bcrypt from 'bcrypt';
import User from '../models/user';
import serialize from '../serializers/user';

/**
 * Signin
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} app
 * @return {void}
 */
module.exports = async (params: any, reply: any, app: any) =>
{
	// Init 'username' parameter
	const username = params.username;
	if (username === undefined || username === null || username === '') {
		return reply(400, 'username-is-required');
	}

	// Init 'password' parameter
	const password = params.password;
	if (password === undefined || password === null || password === '') {
		return reply(400, 'password-is-required');
	}

	const user = await User.findOne({username}).lean().exec();

	if (user === null) {
		return reply(404, 'user-not-found');
	}

	bcrypt.compare(password, user.password, async (compareErr, same) => {
		if (compareErr) {
			return reply(500, 'something-happened');
		} else if (!same) {
			return reply(400, 'incorrect-password');
		}

		reply(await serialize(user));
	});
};
