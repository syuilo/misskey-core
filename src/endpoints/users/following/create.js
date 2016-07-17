'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../../models/user';
import Following from '../../../models/following';
import serialize from '../../../serializers/following';
import event from '../../../event';

/**
 * Follow a user
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, app, user) =>
{
	const follower = user;

	// Init 'user_id' parameter
	let userId = params.user_id;
	if (userId === undefined || userId === null) {
		return reply(400, 'user_id is required');
	}

	// Get followee
	const followee = await User.findOne({
		_id: new mongo.ObjectID(userId)
	});

	if (followee === null) {
		return reply(404, 'user not found');
	}

	// Check arleady following
	const exist = await Following.findOne({
		follower: follower._id,
		followee: followee._id
	});

	if (exist !== null) {
		return reply(400, 'already following');
	}

	// Create following
	const res = await Following.insert({
		created_at: Date.now(),
		follower: follower._id,
		followee: followee._id
	});

	const following = res.ops[0];

	follower.following_count++;
	following.follower = follower;

	followee.followers_count++;
	following.followee = followee;

	// Send response
	reply(await serialize(following));

	// ユーザー情報更新
	User.updateOne({_id: follower._id}, {
		$set: follower
	});
	User.updateOne({_id: followee._id}, {
		$set: followee
	});

	// Publish to stream
	event.publishFollow(followee._id, following);
};
