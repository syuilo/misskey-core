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
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// 1 ~ 100 まで
		if (!(1 <= limit && limit <= 100)) {
			return rej('invalid limit range');
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
		return res([]);
	}

	// serialize
	res(await Promise.all(history.map(async i =>
		await serialize(i.message))));
});
