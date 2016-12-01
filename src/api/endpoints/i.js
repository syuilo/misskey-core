'use strict';

/**
 * Module dependencies
 */
import serialize from '../serializers/user';

/**
 * Show myself
 *
 * @param {Object} params
 * @param {Object} user
 * @param {Object} app
 * @param {Boolean} isWeb
 * @return {Promise<object>}
 */
module.exports = (params, user, _, isWeb) =>
	new Promise(async (res, rej) =>
{
	// Serialize
	res(await serialize(user, user, {
		detail: true,
		includeSecrets: isWeb
	}));
});
