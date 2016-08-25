'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Favorite from '../../models/favorite';
import Post from '../../models/post';

/**
 * Favorite a post
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	// Init 'post' parameter
	let postId = params.post;
	if (postId === undefined || postId === null) {
		return reply(400, 'post is required');
	}

	// Get favoritee
	const post = await Post.findOne({
		_id: new mongo.ObjectID(postId)
	});

	if (post === null) {
		return reply(404, 'post not found');
	}

	// Check arleady favorited
	const exist = await Favorite.findOne({
		post: post._id,
		user: user._id
	});

	if (exist !== null) {
		return reply(400, 'already favorited');
	}

	// Create favorite
	const res = await Favorite.insert({
		created_at: Date.now(),
		post: post._id,
		user: user._id
	});

	const favorite = res.ops[0];

	// Send response
	reply();
};
