'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../models/post';
import serialize from '../../serializers/post';

/**
 * Show a context of a post
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	const postId = params.id;
	if (postId === undefined || postId === null) {
		return reply(400, 'id is required', 'EMPTY_QUERY');
	}

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

	// Init 'offset' parameter
	let offset = params.offset;
	if (offset !== undefined && offset !== null) {
		offset = parseInt(offset, 10);
	} else {
		offset = 0;
	}

	// Lookup post
	const post = await Post.findOne({
		_id: new mongo.ObjectID(postId)
	});

	if (post === null) {
		return reply(404, 'post not found', 'POST_NOT_FOUND');
	}

	const context = [];
	let i = 0;

	async function get(id) {
		i++;
		const p = await Post.findOne({ _id: id });

		if (i > offset) {
			context.push(p);
		}

		if (context.length == limit) {
			return;
		}

		if (p.reply_to) {
			await get(p.reply_to);
		}
	}

	if (post.reply_to) {
		await get(post.reply_to);
	}

	// serialize
	reply(await Promise.all(context.map(async post =>
		await serialize(post, user))));
};
