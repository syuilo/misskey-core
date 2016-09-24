'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Like from '../../../models/like';
import Post from '../../../models/post';
import User from '../../../models/user';
//import event from '../../../event';

/**
 * Unlike a post
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

	// Get likee
	const post = await Post.findOne({
		_id: new mongo.ObjectID(postId)
	});

	if (post === null) {
		return reply(404, 'post not found');
	}

	// Check arleady liked
	const exist = await Like.findOne({
		post: post._id,
		user: user._id
	});

	if (exist === null) {
		return reply(400, 'already not liked');
	}

	// Delete like
	const res = await Like.deleteOne({
		_id: exist._id
	});

	// Send response
	reply();

	// Decrement likes count
	Post.updateOne({ _id: post._id }, {
		$inc: {
			likes_count: -1
		}
	});

	// Decrement user likes count
	User.updateOne({ _id: user._id }, {
		$inc: {
			likes_count: -1
		}
	});

	// Decrement user liked count
	User.updateOne({ _id: post.user }, {
		$inc: {
			liked_count: -1
		}
	});
};
