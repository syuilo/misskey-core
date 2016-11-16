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
 * @return {Promise<object>}
 */
module.exports = async (params) =>
	new Promise(async (res, rej) =>
{
	// Get 'username' parameter
	const username = params.username;
	if (username === undefined || username === null || username === '') {
		return rej('username is required');
	}

	// Validate username
	if (!/^[a-zA-Z0-9\-]{3,20}$/.test(username)) {
		return rej('invalid username');
	}

	// Get 'password' parameter
	const password = params.password;
	if (password === undefined || password === null || password === '') {
		return rej('password is required');
	}

	const name = params.name || '名無し';

	// Generate hash of password
	const salt = bcrypt.genSaltSync(14);
	const hash = bcrypt.hashSync(password, salt);

	// Generate secret
	const secret = rndstr('a-zA-Z0-9', 32);

	// Create account
	const inserted = await User.insert({
		_web: secret,
		avatar: null,
		banner: null,
		birthday: null,
		created_at: new Date(),
		bio: null,
		email: null,
		followers_count: 0,
		following_count: 0,
		links: null,
		location: null,
		name: name,
		password: hash,
		posts_count: 0,
		likes_count: 0,
		liked_count: 0,
		drive_capacity: 1073741824, // 1GB
		username: username,
		username_lower: username.toLowerCase()
	});

	const account = inserted.ops[0];

	// Response
	res(await serialize(account));

	// Create search index
	es.index({
		index: 'misskey',
		type: 'user',
		id: account._id.toString(),
		body: {
			username: username
		}
	});
});
