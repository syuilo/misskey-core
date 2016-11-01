'use strict';

/**
 * Module dependencies
 */
import rndstr from 'rndstr';
import AuthSess from '../../models/auth-session';
import Userkey from '../../models/userkey';

/**
 * Accept
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	// Get 'token' parameter
	const token = params.token;
	if (token == null) {
		return rej('token is required');
	}

	// Fetch token
	const session = await AuthSess
		.findOne({ token: token });

	if (session === null) {
		return rej('session not found');
	}

	// Generate userkey
	const key = rndstr('a-zA-Z0-9', 32);

	// Insert userkey doc
	await Userkey.insert({
		created_at: new Date(),
		app: session.app,
		user: user._id,
		key: key
	});

	// Update session
	await AuthSess.updateOne({
		_id: session._id
	}, {
		$set: {
			user: user._id
		}
	});

	// Response
	res();
});
