'use strict';

/**
 * Module dependencies
 */
const Post = require('../../models/post');
const serialize = require('../../serializers/post');

/**
 * Get timeline
 *
 * @param {Object} params
 * @param {Object} res
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, res, app, user) =>
{
	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		if (limit < 1) {
			return res(400, 'invalid-limit-range');
		} else if (limit > 100) {
			return res(400, 'invalid-limit-range');
		}
	} else {
		limit = 10;
	}

	const sinceId = params['since-id'] || null;
	const maxId = params['max-id'] || null;

	// 自分がフォローしているユーザーの関係を取得
	const following = await UserFollowing
		.find({follower: user.id})
		.lean()
		.exec();

	// 自分と自分がフォローしているユーザーのIDのリストを生成
	const followingIds = following.length !== 0
		? [...following.map(follow => follow.followee), user.id]
		: [user.id];

	// タイムライン取得用のクエリを生成
	const sort = { created_at: -1 };
	const query = {
		user: { $in: followingIds }
	};
	if (sinceId !== null) {
		sort.created_at = 1;
		query.cursor = { $gt: sinceId };
	} else if (maxId !== null) {
		query.cursor = { $lt: maxId };
	}

	// クエリを発行してタイムラインを取得
	const timeline = await Post
		.find(query)
		.sort(sort)
		.limit(limit)
		.lean()
		.exec();

	if (timeline.length === 0) {
		return res([]);
	}

	// serialize
	res(timeline.map(async (post) => {
		return await serialize(post);
	}));
};
