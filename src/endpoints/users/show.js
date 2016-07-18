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
 * @param {Object} reply
 * @return {void}
 */
module.exports = async (params, reply) =>
{
	// Init 'user_id' parameter
	let userId = params.user_id;
	if (userId === undefined || userId === null || userId === '') {
		userId = null;
	}

	// Init 'username' parameter
	let username = params.username;
	if (username === undefined || username === null || username === '') {
		username = null;
	}

	if (userId === null && username === null) {
		return reply(400, 'user_id or username is required', 'EMPTY_QUERY');
	}

	// Lookup user
	const user = userId !== null
		? await User.findOne({_id: new mongo.ObjectId(userId)})
		: await User.findOne({username});

	if (user === null) {
		return reply(404, 'user not found');
	}

	// Send response
	reply(await serialize(user));
};
