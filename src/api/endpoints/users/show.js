'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../models/user';
import serialize from '../../serializers/user';

/**
 * Show a user
 *
 * @param {Object} params
 * @param {Object} me
 * @return {Promise<object>}
 */
module.exports = (params, me) =>
	new Promise(async (res, rej) =>
{
	// Get 'id' parameter
	let userId = params.id;
	if (userId === undefined || userId === null || userId === '') {
		userId = null;
	}

	// Get 'username' parameter
	let username = params.username;
	if (username === undefined || username === null || username === '') {
		username = null;
	}

	if (userId === null && username === null) {
		return rej('id or username is required', 'EMPTY_QUERY');
	}

	// Lookup user
	const user = userId !== null
		? await User.findOne({ _id: new mongo.ObjectID(userId) })
		: await User.findOne({ username_lower: username.toLowerCase() });

	if (user === null) {
		return rej('user not found');
	}

	// Send response
	res(await serialize(user, me, {
		detail: true
	}));
});
