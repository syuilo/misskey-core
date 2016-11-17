'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../models/post';
import Following from '../../models/following';
import serialize from '../../serializers/post';

/**
 * Get timeline of myself
 *
 * @param {Object} params
 * @param {Object} user
 * @param {Object} app
 * @return {Promise<object>}
 */
module.exports = (params, user, app) =>
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

	const since = params.since || null;
	const max = params.max || null;

	// Check if both of since and max is specified
	if (since !== null && max !== null) {
		return rej('cannot set since and max');
	}

	// Fetch relation to other users who the user follows
	// SELECT followee
	const following = await Following
		.find({
			follower: user._id,
			deleted_at: { $exists: false }
		}, { followee: true })
		.toArray();

	// ID list of the user itself and other users who the user follows
	const followingIds = following.length !== 0
		? [...following.map(follow => follow.followee), user._id]
		: [user._id];

	// Construct query
	const sort = {
		_id: -1
	};
	const query = {
		user: {
			$in: followingIds
		}
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
	const timeline = await Post
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (timeline.length === 0) {
		return res([]);
	}

	// Serialize
	res(await Promise.all(timeline.map(async post =>
		await serialize(post, user)
	)));
});
