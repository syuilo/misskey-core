'use strict';

/**
 * Module dependencies
 */
import * as uuid from 'uuid';
import App from '../../models/app';
import AuthSessToken from '../../models/auth-sess-token';

/**
 * Generate a session token
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

	// Generate token
	const token = uuid.v4();

	// Create session token document
	const inserted = await AuthSessToken.insert({
		created_at: new Date(),
		app: app.id,
		token: token
	});

	const doc = inserted.ops[0];

	// Response
	res({
		token: doc.token
	});
});
