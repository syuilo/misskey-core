'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../models/user';
import serialize from '../../serializers/user';

/**
 * Update myself
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	// Init 'name' parameter
	const name = params.name;
	if (name !== undefined && name !== null) {
		if (name.length > 50) {
			return reply(400, 'too long name');
		}

		user.name = name;
	}

	// Init 'location' parameter
	const location = params.location;
	if (location !== undefined && location !== null) {
		if (location.length > 50) {
			return reply(400, 'too long location');
		}

		user.location = location;
	}

	// Init 'bio' parameter
	const bio = params.bio;
	if (bio !== undefined && bio !== null) {
		if (bio.length > 500) {
			return reply(400, 'too long bio');
		}

		user.bio = bio;
	}

	// Init 'avatar' parameter
	const avatar = params.avatar;
	if (avatar !== undefined && avatar !== null) {
		user.avatar = new mongo.ObjectID(avatar);
	}

	await User.updateOne({ _id: user._id }, {
		$set: user
	});

	// serialize
	reply(await serialize(user));

	// TODO: 検索インデックス再作成
};
