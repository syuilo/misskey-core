'use strict';

/**
 * Module dependencies
 */
import User from '../../models/user';

/**
 * Check available username
 *
 * @param {Object} params
 * @param {Object} res
 * @return {void}
 */
module.exports = async (params, res) =>
{
	// Init 'username' parameter
	const username = params.username;
	if (username === undefined || username === null || username === '') {
		return res(400, 'username-is-required');
	}

	if (!/^[a-zA-Z0-9\-]{3,20}$/.test(username)) {
		return res(400, 'invalid-username');
	}

	const exist = await User
		.count({
			username_lower: username.toLowerCase()
		}, {
			limit: 1
		});

	res({
		available: exist === 0
	});
};
