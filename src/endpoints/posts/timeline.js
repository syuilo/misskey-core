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
 * @param {Object} reply
 * @param {Object} user
 * @param {Object} app
 * @return {void}
 */
module.exports = async (params, reply, user, app) =>
{
	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// 1 ~ 100 まで
		if (!(1 <= limit && limit <= 100)) {
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
		.find({
			follower: user._id,
			deleted_at: { $exists: false }
		}, { followee: true })
		.toArray();

	// 自分と自分がフォローしているユーザーのIDのリストを生成
	const followingIds = following.length !== 0
		? [...following.map(follow => follow.followee), user._id]
		: [user._id];

	// クエリ構築
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

	// クエリ発行
	const timeline = await Post
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (timeline.length === 0) {
		return reply([]);
	}

	// serialize
	reply(await Promise.all(timeline.map(async post =>
		await serialize(post, user)
	)));
};
