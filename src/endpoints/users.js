'use strict';

/**
 * Module dependencies
 */
import User from '../models/user';
import serialize from '../serializers/user';

/**
 * Lists all users
 *
 * @param {Object} params
 * @param {Object} me
 * @return {Promise<object>}
 */
module.exports = (params, me) =>
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

	const since = params.since || null;
	const max = params.max || null;

	// 両方指定してたらエラー
	if (since !== null && max !== null) {
		return rej('cannot set since and max');
	}

	// クエリ構築
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

	// クエリ発行
	const users = await User
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (users.length === 0) {
		return res([]);
	}

	// serialize
	res(await Promise.all(users.map(async user =>
		await serialize(user, me))));
});
