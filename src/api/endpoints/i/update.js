'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../models/user';
import serialize from '../../serializers/user';
import es from '../../db/elasticsearch';

/**
 * Update myself
 *
 * @param {Object} params
 * @param {Object} user
 * @param {Object} _
 * @param {boolean} isWeb
 * @return {Promise<object>}
 */
module.exports = async (params, user, _, isWeb) =>
	new Promise(async (res, rej) =>
{
	// Get 'name' parameter
	const name = params.name;
	if (name !== undefined && name !== null) {
		if (name.length > 50) {
			return rej('too long name');
		}

		user.name = name;
	}

	// Get 'location' parameter
	const location = params.location;
	if (location !== undefined && location !== null) {
		if (location.length > 50) {
			return rej('too long location');
		}

		user.location = location;
	}

	// Get 'bio' parameter
	const bio = params.bio;
	if (bio !== undefined && bio !== null) {
		if (bio.length > 500) {
			return rej('too long bio');
		}

		user.bio = bio;
	}

	// Get 'avatar' parameter
	const avatar = params.avatar;
	if (avatar !== undefined && avatar !== null) {
		user.avatar = new mongo.ObjectID(avatar);
	}

	// Get 'banner' parameter
	const banner = params.banner;
	if (banner !== undefined && banner !== null) {
		user.banner = new mongo.ObjectID(banner);
	}

	await User.updateOne({ _id: user._id }, {
		$set: user
	});

	// Serialize
	res(await serialize(user, user, {
		includePrivates: true,
		includeSecrets: isWeb,
		includeProfileImageIds: isWeb
	}));

	// Update search index
	es.index({
		index: 'misskey',
		type: 'user',
		id: user._id.toString(),
		body: {
			name: user.name,
			bio: user.bio
		}
	});
});
