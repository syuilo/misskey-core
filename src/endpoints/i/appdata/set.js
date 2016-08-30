'use strict';

/**
 * Module dependencies
 */
import Appdata from '../../../models/appdata';

/**
 * Set app data
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
	const data = params.data;
	if (data == null) {
		return reply(400, 'data is required');
	}

	if (isWeb) {
		await User.updateOne({ _id: user._id }, {
			$set: { data }
		});
		reply(204);
	} else {
		await Appdata.updateOne({
			app: app._id,
			user: user._id
		}, {
			app: app._id,
			user: user._id,
			data: data
		}, {
			upsert: true
		});
		reply(204);
	}
};
