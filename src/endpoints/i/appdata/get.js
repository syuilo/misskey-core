'use strict';

/**
 * Module dependencies
 */
import Appdata from '../../../models/appdata';

/**
 * Get app data
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @param {Object} app
 * @param {Boolean} isWeb
 * @return {void}
 */
module.exports = async (params, reply, user, app, isWeb) =>
{
	if (isWeb) {
		reply(user._webdata);
	} else {
		const appdata = await Appdata.findOne({
			app: app._id,
			user: user._id
		});

		if (appdata !== null) {
			reply(appdata.data);
		} else {
			reply(204);
		}
	}
};
