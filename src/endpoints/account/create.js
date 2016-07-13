'use strict';

/**
 * Module dependencies
 */
import bcrypt from 'bcrypt';
import User from '../../models/user';

/**
 * Create an account
 *
 * @param {Object} params
 * @param {Object} res
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, res, app, user) =>
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

	const name = params.name || '名無し';

	// Generate hash of password
	const salt = bcrypt.genSaltSync(14);
	const hash = bcrypt.hashSync(password, salt);

	// Create account
	const account = await User.create({
		username: username,
		name: name,
		lang: 'ja',
		password: hash
	});

	res(account.toObject());
};