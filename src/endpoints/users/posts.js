'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../models/post';
import User from '../../models/user';
import serialize from '../../serializers/post';

/**
 * Get posts of a user
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} me
 * @return {void}
 */
module.exports = async (params, reply, me) =>
{
	// Init 'user' parameter
	const userId = params.user;
	if (userId === undefined || userId === null) {
		return reply(400, 'user is required');
	}

	// Init 'with_images' parameter
	let withImages = params.with_images;
	if (withImages !== undefined && withImages !== null && withImages === 'true') {
		withImages = true;
	} else {
		withImages = false;
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
	const user = await User.findOne({
		_id: new mongo.ObjectID(userId)
	});

	if (user === null) {
		return reply(404, 'user not found');
	}

	// クエリ構築
	const sort = {
		_id: -1
	};
	const query = {
		user: user._id
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

	if (withImages) {
		query.images = {
			$exists: true,
			$ne: null
		};
	}

	// クエリ発行
	const posts = await Post
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (posts.length === 0) {
		return reply([]);
	}

	// serialize
	reply(await Promise.all(posts.map(async (post) =>
		await serialize(post, me, {
			serializeReplyTo: true,
			includeIsLiked: true
		})
	)));
};
