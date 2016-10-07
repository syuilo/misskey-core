'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../../models/user';
import Following from '../../../models/following';

/**
 * Aggregate following of a user
 *
 * @param {Object} params
 * @param {Object} reply
 * @return {void}
 */
module.exports = async (params, reply) =>
{
	// Init 'user' parameter
	const userId = params.user;
	if (userId === undefined || userId === null) {
		return reply(400, 'user is required');
	}

	// Lookup user
	const user = await User.findOne({
		_id: new mongo.ObjectID(userId)
	});

	if (user === null) {
		return reply(404, 'user not found');
	}

	const startTime = new Date(new Date().setMonth(new Date().getMonth() - 1));

	const following = await Following
		.find({
			follower: user._id,
			$or: [
				{ deleted_at: { $exists: false } },
				{ deleted_at: { $gt: startTime } }
			]
		}, {
			_id: false,
			follower: false,
			followee: false
		}, {
			sort: { created_at: -1 }
		})
		.toArray();

	const graph = [];

	for (let i = 0; i < 30; i++) {
		let day = new Date(new Date().setDate(new Date().getDate() - i));
		day = new Date(day.setMilliseconds(999));
		day = new Date(day.setSeconds(59));
		day = new Date(day.setMinutes(59));
		day = new Date(day.setHours(23));

		const count = following.filter(f =>
			f.created_at < day && (f.deleted_at == null || f.deleted_at > day)
		).length;

		graph.push({
			date: {
				year: day.getFullYear(),
				month: day.getMonth() + 1, // JavaScriptでは月を0~11で表すので+1します
				day: day.getDate()
			},
			count: count
		});
	}

	reply(graph);
};
