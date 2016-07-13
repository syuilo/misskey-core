'use strict';

/**
 * Module dependencies
 */
import bcrypt from 'bcrypt';
import User from '../models/user';
import serialize from '../serializers/user';

/**
 * Signin
 *
 * @param {Object} params
 * @param {Object} res
 * @param {Object} app
 * @return {void}
 */
module.exports = async (params, res, app) =>
{
	// Init 'username' parameter
	const username = params.username;
	if (username === undefined || username === null || username === '') {
		return res(400, 'username-is-required');
	}

	// Init 'password' parameter
	const password = params.password;
	if (password === undefined || password === null || password === '') {
		return res(400, 'password-is-required');
	}

	const user = await User.findOne({username}).lean().exec();

	if (user === null) {
		return res(404, 'user-not-found');
	}

	bcrypt.compare(password, user.password, async (compareErr, same) => {
		if (compareErr) {
			return res(500, 'something-happened');
		} else if (!same) {
			return res(400, 'incorrect-password');
		}

		res(await serialize(user));
	});
};
