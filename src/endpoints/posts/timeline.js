'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../models/post';
import serialize from '../../serializers/post';

/**
 * Get timeline
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, app, user) =>
{
	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// 1 ~ 100 まで
		if (limit < 1) {
			return reply(400, 'invalid-limit-range');
		} else if (limit > 100) {
			return reply(400, 'invalid-limit-range');
		}
	} else {
		limit = 10;
	}

	const sinceId = params['since-id'] || null;
	const maxId = params['max-id'] || null;

	// 両方指定してたらエラー
	if (sinceId !== null && maxId !== null) {
		return reply(400, 'cannot-set-since-id-and-max-id');
	}

	// 自分がフォローしているユーザーの関係を取得
	// SELECT followee
	const following = await UserFollowing
		.find({follower: user._id}, {followee: true});

	// 自分と自分がフォローしているユーザーのIDのリストを生成
	const followingIds = following.length !== 0
		? [...following.map(follow => follow.followee), user._id]
		: [user._id];

	// クエリ構築
	const sort = {
		created_at: -1
	};
	const query = {
		user: {
			$in: followingIds
		}
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

	// クエリを発行してタイムラインを取得
	const timeline = await Post
		.find(query, {
			limit: limit,
			sort: sort
		});

	if (timeline.length === 0) {
		return reply([]);
	}

	// serialize
	reply(timeline.map(async (post) => {
		return await serialize(post);
	}));
};
