'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../models/user';
import Following from '../../models/following';
import serialize from '../../serializers/user';

/**
 * Get followers of a user
 *
 * @param {Object} params
 * @param {Object} me
 * @return {Promise<object>}
 */
module.exports = (params, me) =>
	new Promise(async (res, rej) =>
{
	// Get 'user' parameter
	const userId = params.user;
	if (userId === undefined || userId === null) {
		return rej('user is required');
	}

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

	const since = params.since || null;
	const max = params.max || null;

	// Check if both of since and max is specified
	if (since !== null && max !== null) {
		return rej('cannot set since and max');
	}

	// Lookup user
	const user = await User.findOne({
		_id: new mongo.ObjectID(userId)
	});

	if (user === null) {
		return rej('user not found');
	}

	// Construct query
	const sort = { _id: -1 };
	const query = {
		followee: user._id,
		deleted_at: { $exists: false }
	};

	if (since) {
		sort._id = 1;
		query._id = {
			$gt: new mongo.ObjectID(since)
		};
	} else if (max) {
		query._id = {
			$lt: new mongo.ObjectID(max)
		};
	}

	// Get followers
	const following = await Following
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (following.length === 0) {
		return res([]);
	}

	// Serialize
	const users = await Promise.all(following.map(async f =>
		await serialize(f.follower, me, { detail: true })));

	// Response
	res({
		users: users,
		next: following[following.length - 1]._id,
		prev: following[0]._id
	});
});
