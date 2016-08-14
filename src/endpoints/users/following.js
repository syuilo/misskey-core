'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Following from '../../models/following';
import serialize from '../../serializers/following';

/**
 * Get following users of a user
 *
 * @param {Object} params
 * @param {Object} reply
 * @return {void}
 */
module.exports = async (params, reply) =>
{
	// Init 'user_id' parameter
	const userId = params.user_id;
	if (userId === undefined || userId === null) {
		return reply(400, 'user_id is required');
	}

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

	const since = params.since || null;
	const max = params.max || null;

	// 両方指定してたらエラー
	if (since !== null && max !== null) {
		return reply(400, 'cannot set since and max');
	}

	// Lookup user
	const user = await User.findOne({_id: new mongo.ObjectID(userId)});

	if (user === null) {
		return reply(404, 'user not found');
	}

	// クエリ構築
	const sort = {
		created_at: -1
	};
	const query = {
		follower: user._id
	};
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

	// クエリ発行
	const following = await Following
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (following.length === 0) {
		return reply([]);
	}

	// serialize
	reply(await Promise.all(following.map(async f => await serialize(f))));
};
