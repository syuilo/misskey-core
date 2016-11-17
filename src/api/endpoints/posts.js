'use strict';

/**
 * Module dependencies
 */
import Post from '../models/post';
import serialize from '../serializers/post';

/**
 * Lists all posts
 *
 * @param {Object} params
 * @return {Promise<object>}
 */
module.exports = (params) =>
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

	// Construct query
	const sort = {
		created_at: -1
	};
	const query = {};
	if (since !== null) {
		sort.created_at = 1;
		query._id = {
			$gt: new mongo.ObjectID(since)
		};
	} else if (max !== null) {
		query._id = {
			$lt: new mongo.ObjectID(max)
		};
	}

	// Issue query
	const posts = await Post
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (posts.length === 0) {
		return res([]);
	}

	// Serialize
	res(await Promise.all(posts.map(async post => await serialize(post))));
});
