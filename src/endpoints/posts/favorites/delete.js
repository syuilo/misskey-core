'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Favorite from '../../models/favorite';
import Post from '../../models/post';

/**
 * Unfavorite a post
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

	if (exist === null) {
		return reply(400, 'already not favorited');
	}

	// Delete favorite
	const res = await Favorite.deleteOne({
		_id: exist._id
	});

	// Send response
	reply();
};
