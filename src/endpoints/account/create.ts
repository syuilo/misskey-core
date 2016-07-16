'use strict';

/**
 * Module dependencies
 */
import * as bcrypt from 'bcrypt';
import User from '../../models/user';

/**
 * Create an account
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

	// Validate username
	if (!/^[a-z0-9\-]{3,20}$/.test(username)) {
		return reply(400, 'invalid-username');
	}

	// Init 'password' parameter
	const password = params.password;
	if (password === undefined || password === null || password === '') {
		return reply(400, 'password-is-required');
	}

	const name = params.name || '名無し';

	// Generate hash of password
	const salt = bcrypt.genSaltSync(14);
	const hash = bcrypt.hashSync(password, salt);

	// Create account
	const res = await User.insert({
		avatar: null,
		banner: null,
		birthday: null,
		comment: null,
		created_at: Date.now(),
		description: null,
		email: null,
		followers_count: 0,
		following_count: 0,
		is_suspended: false,
		is_verified: false,
		lang: 'ja',
		latest_post: null,
		links: null,
		location: null,
		name: name,
		password: hash,
		posts_count: 0,
		username: username
	});

	const account = res.ops[0];

	reply(account);
};
