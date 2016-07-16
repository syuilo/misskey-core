'use strict';

/**
 * Module dependencies
 */
import serialize from '../../serializers/user';

/**
 * Show an account
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params: any, reply: any, app: any, user: any) =>
{
	// serialize
	reply(await serialize(user));
};
