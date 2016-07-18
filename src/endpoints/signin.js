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
module.exports = async (params, reply, app) =>
{
	// Init 'username' parameter
	const username = params.username;
	if (username === undefined || username === null || username === '') {
		return reply(400, 'username is required', 'INVALID_QUERY');
	}

	// Init 'password' parameter
	const password = params.password;
	if (password === undefined || password === null || password === '') {
		return reply(400, 'password is required', 'INVALID_QUERY');
	}

	const user = await User.findOne({username});

	if (user === null) {
		return reply(404, 'user not found', 'USER_NOT_FOUND');
	}

	bcrypt.compare(password, user.password, async (compareErr, same) => {
		if (compareErr) {
			return reply(500);
		} else if (!same) {
			return reply(400, 'incorrect password', 'INCORRECT_PASSWORD');
		}

		reply(await serialize(user));
	});
};
