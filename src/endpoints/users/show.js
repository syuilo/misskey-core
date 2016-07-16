'use strict';

/**
 * Module dependencies
 */
import User from '../../models/user';
import serialize from '../../serializers/user';

/**
 * Show a user
 *
 * @param {Object} params
 * @param {Object} res
 * @param {Object} app
 * @return {void}
 */
module.exports = async (params, res, app) =>
{
	// Init 'id' parameter
	let id = params.id;
	if (id === undefined || id === null || id === '') {
		id = null;
	}

	// Init 'username' parameter
	let username = params.username;
	if (username === undefined || username === null || username === '') {
		username = null;
	}

	if (username === null && id === null) {
		return res(400, 'id-or-username-is-required');
	}

	const user = id !== null
		? await User.findById(id).lean().exec()
		: await User.findOne({username}).lean().exec();

	if (user === null) {
		return res(404, 'user-not-found');
	}

	// serialize
	res(await serialize(user));
};
