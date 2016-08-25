'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../models/user';
import Following from '../../models/following';
import serialize from '../../serializers/following';
import event from '../../event';

/**
 * Unfollow a user
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	const follower = user;

	// Init 'user_id' parameter
	const userId = params.user_id;
	if (userId === undefined || userId === null) {
		return reply(400, 'user_id is required');
	}

	// 自分自身
	if (userId === user._id.toString()) {
		return reply(400, 'followee is yourself');
	}

	// Get followee
	const followee = await User.findOne({
		_id: new mongo.ObjectID(userId)
	});

	if (followee === null) {
		return reply(404, 'user not found');
	}

	// Check not following
	const exist = await Following.findOne({
		follower: follower._id,
		followee: followee._id
	});

	if (exist === null) {
		return reply(400, 'already not following');
	}

	// Delete following
	const res = await Following.deleteOne({
		_id: exist._id
	});

	follower.following_count--;
	following.follower = follower;

	followee.followers_count--;
	following.followee = followee;

	// Send response
	reply();

	// ユーザー情報更新
	User.updateOne({_id: follower._id}, {
		$set: follower
	});
	User.updateOne({_id: followee._id}, {
		$set: followee
	});
};
