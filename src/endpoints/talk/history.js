'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import History from '../../models/talk-history';
import serialize from '../../serializers/talk-message';

/**
 * Show talk history
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// 1 ~ 100 まで
		if (limit < 1) {
			return reply(400, 'invalid limit range');
		} else if (limit > 100) {
			return reply(400, 'invalid limit range');
		}
	} else {
		limit = 10;
	}

	// Get history
	const history = await History
		.find({
			user: user._id
		}, {}, {
			limit: limit,
			sort: {
				updated_at: -1
			}
		})
		.toArray();

	if (history.length === 0) {
		return reply([]);
	}

	// serialize
	reply(await Promise.all(history.map(async i =>
		await serialize(i.message))));
};
