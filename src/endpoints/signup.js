'use strict';

/**
 * Module dependencies
 */
import * as bcrypt from 'bcrypt';
import rndstr from 'rndstr';
import User from '../models/user';
import serialize from '../serializers/user';
import es from '../db/elasticsearch';

/**
 * Create an account
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
		return reply(400, 'username is required');
	}

	// Validate username
	if (!/^[a-zA-Z0-9\-]{3,20}$/.test(username)) {
		return reply(400, 'invalid username');
	}

	// Init 'password' parameter
	const password = params.password;
	if (password === undefined || password === null || password === '') {
		return reply(400, 'password is required');
	}

	const name = params.name || '名無し';

	// Generate hash of password
	const salt = bcrypt.genSaltSync(14);
	const hash = bcrypt.hashSync(password, salt);

	// Generate secret
	const secret = rndstr('a-zA-Z0-9', 32);

	// Create account
	const res = await User.insert({
		_web: secret,
		avatar: null,
		banner: null,
		birthday: null,
		created_at: Date.now(),
		bio: null,
		email: null,
		followers_count: 0,
		following_count: 0,
		links: null,
		location: null,
		name: name,
		password: hash,
		posts_count: 0,
		drive_capacity: 1073741824, // 1GB
		username: username,
		username_lower: username.toLowerCase()
	});

	const account = res.ops[0];

	// Response
	reply(await serialize(account));

	// Create search index
	es.index({
		index: 'users',
		type: 'user',
		id: account._id.toString(),
		body: {
			username: username
		}
	});
};
