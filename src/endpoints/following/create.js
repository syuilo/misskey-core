'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../models/user';
import Following from '../../models/following';
import notify from '../../common/notify';
import event from '../../event';
import serializeUser from '../../serializers/user';

/**
 * Follow a user
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

	// Check arleady following
	const exist = await Following.findOne({
		follower: follower._id,
		followee: followee._id
	});

	if (exist !== null) {
		return reply(400, 'already following');
	}

	// Create following
	await Following.insert({
		created_at: Date.now(),
		follower: follower._id,
		followee: followee._id
	});

	// Send response
	reply();

	// Increment following count
	User.updateOne({ _id: follower._id }, {
		$inc: {
			following_count: 1
		}
	});

	// Increment followers count
	User.updateOne({ _id: followee._id }, {
		$inc: {
			followers_count: 1
		}
	});

	// Publish follow event
	event(follower._id, 'follow', await serializeUser(followee, follower));
	event(followee._id, 'followed', await serializeUser(follower, followee));

	// Notify
	notify(followee._id, 'follow', {
		user: follower._id
	});
};
