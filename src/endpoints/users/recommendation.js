'use strict';

/**
 * Module dependencies
 */
import User from '../../models/user';
import Following from '../../models/following';
import serialize from '../../serializers/user';

/**
 * Get recommended users
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

	const since = params.since || null;
	const max = params.max || null;

	// 両方指定してたらエラー
	if (since !== null && max !== null) {
		return reply(400, 'cannot set since and max');
	}

	// 自分がフォローしているユーザーの関係を取得
	// SELECT followee
	const following = await Following
		.find({ follower: user._id }, { followee: true })
		.toArray();

	// 自分と自分がフォローしているユーザーのIDのリストを生成
	const followingIds = following.length !== 0
		? [...following.map(follow => follow.followee), user._id]
		: [user._id];

	// クエリ構築
	const sort = {
		created_at: -1
	};
	const query = {
		_id: {
			$nin: followingIds
		}
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
	const users = await User
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (users.length === 0) {
		return reply([]);
	}

	// serialize
	reply(await Promise.all(users.map(async user => await serialize(user))));
};
