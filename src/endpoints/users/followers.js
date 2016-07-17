'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Following from '../../models/following';
import serialize from '../../serializers/following';

/**
 * Get followers of a user
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

	const sinceId = params.since_id || null;
	const maxId = params.max_id || null;

	// 両方指定してたらエラー
	if (sinceId !== null && maxId !== null) {
		return reply(400, 'cannot set since_id and max_id');
	}

	// Lookup user
	const user = await User.findOne({_id: new mongo.ObjectId(userId)});

	if (user === null) {
		return reply(404, 'user not found');
	}

	// クエリ構築
	const sort = {
		created_at: -1
	};
	const query = {
		followee: user._id
	};
	if (sinceId !== null) {
		sort.created_at = 1;
		query._id = {
			$gt: new mongo.ObjectID(sinceId)
		};
	} else if (maxId !== null) {
		query._id = {
			$lt: new mongo.ObjectID(maxId)
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
