'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../models/post';
import serialize from '../../serializers/post';

/**
 * Show a post
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
		return reply(400, 'id is required');
	}

	// Get post
	const post = await Post.findOne({
		_id: new mongo.ObjectID(postId)
	});

	if (post === null) {
		return reply(404, 'post not found');
	}

	// serialize
	reply(await serialize(post, user, {
		serializeReplyTo: true,
		includeIsLiked: true
	}));
};
