'use strict';

/**
 * Module dependencies
 */
import serialize from '../../serializers/user';

/**
 * Show an account
 *
 * @param {Object} params
 * @param {Object} res
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, res, app, user) =>
{
	// serialize
	res(await serialize(user));
};
