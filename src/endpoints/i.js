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
 * @param {Boolean} isWeb
 * @return {void}
 */
module.exports = async (params, reply, user, _, isWeb) =>
{
	// serialize
	reply(await serialize(user, {
		includePrivates: true,
		includeSecrets: isWeb,
		includeProfileImageIds: isWeb
	}));
};
