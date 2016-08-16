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
 * @param {Object} user
 * @param {Object} app
 * @return {void}
 */
module.exports = async (params, reply, user, _, isWeb) =>
{
	// serialize
	reply(await serialize(user, {
		includeSecrets: isWeb,
		includeProfileImageIds: isWeb
	}));
};
