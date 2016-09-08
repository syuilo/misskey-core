'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Like from '../../../models/like';
import Post from '../../../models/post';
import notify from '../../../common/notify';
import event from '../../../event';
import serializeUser from '../../../serializers/user';
import serializePost from '../../../serializers/post';

/**
 * Like a post
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

	// Myself
	if (post.user.toString() === user._id.toString()) {
		return reply(400, '-need-tranlstae-');
	}

	// Check arleady liked
	const exist = await Like.findOne({
		post: post._id,
		user: user._id
	});

	if (exist !== null) {
		return reply(400, 'already liked');
	}

	// Create like
	const res = await Like.insert({
		created_at: Date.now(),
		post: post._id,
		user: user._id
	});

	const like = res.ops[0];

	// Send response
	reply();

	// Increment likes count
	Post.updateOne({ _id: post._id }, {
		$inc: {
			likes_count: 1
		}
	});

	// Notify
	notify(post.user, 'like', {
		user: user._id,
		post: post._id
	});

	// Publish like event
	event(post.user, 'like', {
		user: await serializeUser(user, post.user),
		post: await serializePost(post, post.user)
	});
};
