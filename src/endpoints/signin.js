'use strict';

/**
 * Module dependencies
 */
import * as bcrypt from 'bcrypt';
import User from '../models/user';
import Signin from '../models/signin';
import serialize from '../serializers/user';
import event from '../event';

/**
 * Signin
 *
 * @param {Object} params
 * @param {Object} user
 * @param {Object} app
 * @param {Boolean} isWeb
 * @return {Promise<object>}
 */
module.exports = async (params, reply, _1, _2, isWeb) =>
	new Promise(async (res, rej) =>
{
	// Get 'username' parameter
	const username = params.username;
	if (username === undefined || username === null || username === '') {
		return rej('username is required');
	}

	// Get 'password' parameter
	const password = params.password;
	if (password === undefined || password === null || password === '') {
		return rej('password is required');
	}

	const user = await User.findOne({
		username_lower: username.toLowerCase()
	});

	if (user === null) {
		return rej('user not found');
	}

	bcrypt.compare(password, user.password, async (compareErr, same) => {
		if (compareErr) {
			return res(500);
		} else if (!same) {
			return rej('incorrect password');
		}

		res({
			web: user._web
		});

		Signin.insert({
			created_at: new Date(),
			user: user._id,
			ip: params.ip,
			ua: params.ua
		});

		// Event
	});
});
