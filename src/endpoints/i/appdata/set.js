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
	const data = params.data;
	if (data == null) {
		return reply(400, 'data is required');
	}

	if (isWeb) {
		const set = {
			$set: {
				data: Object.assign(user.data || {}, JSON.parse(data))
			}
		};
		await User.updateOne({ _id: user._id }, set);
		reply(204);
	} else {
		const appdata = await Appdata.findOne({
			app: app._id,
			user: user._id
		});
		const set = {
			$set: {
				data: Object.assign((appdata || {}).data || {}, JSON.parse(data))
			}
		};
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
