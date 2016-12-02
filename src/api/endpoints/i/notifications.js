'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Notification from '../../models/notification';
import serialize from '../../serializers/notification';

/**
 * Get notifications
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	// Get 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// From 1 to 100
		if (!(1 <= limit && limit <= 100)) {
			return rej('invalid limit range');
		}
	} else {
		limit = 10;
	}

	const since = params.since_id || null;
	const max = params.max_id || null;

	// Check if both of since_id and max_id is specified
	if (since !== null && max !== null) {
		return rej('cannot set since_id and max_id');
	}

	const query = {
		notifiee_id: user._id
	};

	const sort = {
		_id: -1
	};

	if (since !== null) {
		sort._id = 1;
		query._id = {
			$gt: new mongo.ObjectID(since)
		};
	} else if (max !== null) {
		query._id = {
			$lt: new mongo.ObjectID(max)
		};
	}

	// Issue query
	const notifications = await Notification
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	// Serialize
	res(await Promise.all(notifications.map(async notification =>
		await serialize(notification))));
});
