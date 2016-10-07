'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../models/user';
import Following from '../../models/following';
import event from '../../event';
import serializeUser from '../../serializers/user';

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

	// Init 'user' parameter
	let userId = params.user;
	if (userId === undefined || userId === null) {
		return reply(400, 'user is required');
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
		followee: followee._id,
		deleted_at: { $exists: false }
	});

	if (exist === null) {
		return reply(400, 'already not following');
	}

	// Delete following
	const res = await Following.updateOne({
		_id: exist._id
	}, {
		$set: {
			deleted_at: new Date()
		}
	});

	// Send response
	reply();

	// Decrement following count
	User.updateOne({ _id: follower._id }, {
		$inc: {
			following_count: -1
		}
	});

	// Decrement followers count
	User.updateOne({ _id: followee._id }, {
		$inc: {
			followers_count: -1
		}
	});

	// Publish follow event
	event(follower._id, 'unfollow', await serializeUser(followee, follower));
};
