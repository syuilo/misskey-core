'use strict';

/**
 * Module dependencies
 */
import serialize from '../serializers/user';

/**
 * Show myself
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, app, user) =>
{
	// serialize
	reply(await serialize(user));
};
