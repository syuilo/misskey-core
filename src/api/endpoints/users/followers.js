'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../models/user';
import Following from '../../models/following';
import serialize from '../../serializers/user';

/**
 * Get followers of a user
 *
 * @param {Object} params
 * @param {Object} me
 * @return {Promise<object>}
 */
module.exports = (params, me) =>
	new Promise(async (res, rej) =>
{
	// Get 'user' parameter
	const userId = params.user;
	if (userId === undefined || userId === null) {
		return rej('user is required');
	}

	// Get 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// From 1 to 100
		if (!(1 <= limit && limit <= 100)) {
			return rej('invalid limit range');
		}
	} else {
		limit = 10;
	}

	// Get 'offset' parameter
	let offset = params.offset;
	if (offset !== undefined && offset !== null) {
		offset = parseInt(offset, 10);
	} else {
		offset = 0;
	}

	// Get 'sort' parameter
	let sort = params.sort || 'desc';

	// Lookup user
	const user = await User.findOne({
		_id: new mongo.ObjectID(userId)
	});

	if (user === null) {
		return rej('user not found');
	}

	// Get followers
	const following = await Following
		.find({
			followee: user._id,
			deleted_at: { $exists: false }
		}, {}, {
			limit: limit,
			skip: offset,
			sort: {
				_id: sort == 'asc' ? 1 : -1
			}
		})
		.toArray();

	if (following.length === 0) {
		return res([]);
	}

	// Serialize
	res(await Promise.all(following.map(async f =>
		await serialize(f.follower, me))));
});
