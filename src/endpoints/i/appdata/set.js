'use strict';

/**
 * Module dependencies
 */
import Appdata from '../../../models/appdata';
import User from '../../../models/user';

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
	let key = params.key;
	if (key === undefined) {
		key = null;
	}

	const value = params.value;
	if (value == null) {
		return reply(400, 'value is required');
	}

	let set = {};
	if (key !== null) {
		set['data.' + key] = value;
	} else {
		set.data = JSON.parse(value);
	}

	if (isWeb) {
		await User.updateOne({ _id: user._id }, {
			$set: set
		});
		reply(204);
	} else {
		await Appdata.updateOne({
			app: app._id,
			user: user._id
		}, Object.assign({
			app: app._id,
			user: user._id
		}, set), {
			upsert: true
		});
		reply(204);
	}
};
