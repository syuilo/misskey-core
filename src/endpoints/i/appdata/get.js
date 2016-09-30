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
	// Init 'key' parameter
	let key = params.key;
	if (key === undefined) {
		key = null;
	}

	if (isWeb) {
		if (!user._webdata) {
			return reply();
		}
		if (key !== null) {
			const data = {};
			data[key] = user._webdata[key];
			reply(data);
		} else {
			reply(user._webdata);
		}
	} else {
		const select = {};
		if (key !== null) {
			select['data.' + key] = true;
		}
		const appdata = await Appdata.findOne({
			app: app._id,
			user: user._id
		}, select);

		if (appdata) {
			reply(appdata.data);
		} else {
			reply();
		}
	}
};
