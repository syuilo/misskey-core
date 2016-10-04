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
 * @param {Object} reply
 * @param {Object} user
 * @param {Object} app
 * @param {Boolean} isWeb
 * @return {void}
 */
module.exports = async (params, reply, _1, _2, isWeb) =>
{
	// Init 'username' parameter
	const username = params.username;
	if (username === undefined || username === null || username === '') {
		return reply(400, 'username is required');
	}

	// Init 'password' parameter
	const password = params.password;
	if (password === undefined || password === null || password === '') {
		return reply(400, 'password is required');
	}

	const user = await User.findOne({
		username_lower: username.toLowerCase()
	});

	if (user === null) {
		return reply(404, 'user not found');
	}

	bcrypt.compare(password, user.password, async (compareErr, same) => {
		if (compareErr) {
			return reply(500);
		} else if (!same) {
			return reply(400, 'incorrect password');
		}

		reply({
			web: user._web
		});

		Signin.insert({
			created_at: new Date(),
			user: user._id,
			ip: params.ip,
			ua: params.ua
		});

		//event.
	});
};
