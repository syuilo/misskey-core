'use strict';

/**
 * Module dependencies
 */
import * as uuid from 'uuid';
import App from '../../../models/app';
import AuthSess from '../../../models/auth-session';
import Userkey from '../../../models/userkey';

/**
 * Generate a session
 *
 * @param {Object} params
 * @return {Promise<object>}
 */
module.exports = (params) =>
	new Promise(async (res, rej) =>
{
	// Get 'app_secret' parameter
	const appSecret = params.app_secret;
	if (appSecret == null) {
		return rej('app_secret is required');
	}

	// Lookup app
	const app = await App.findOne({
		secret: appSecret
	});

	if (app == null) {
		return rej('app not found');
	}

	// Get 'token' parameter
	const token = params.token;
	if (token == null) {
		return rej('token is required');
	}

	// Fetch token
	const session = await AuthSess
		.findOne({
			token: token,
			app: app._id
		});

	if (session === null) {
		return rej('session not found');
	}

	if (session.user == null) {
		return rej('this session is not allowed yet');
	}

	// Lookup userkey
	const userkey = await Userkey.findOne({
		app: app._id,
		user: session.user
	});

	// Delete session
	AuthSess.deleteOne({
		_id: session._id
	});

	// Response
	res({
		userkey: userkey.key
	});
});
