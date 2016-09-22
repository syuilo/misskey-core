'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Following from '../../models/following';
import serialize from '../../serializers/user';

/**
 * Get following users of a user
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} me
 * @return {void}
 */
module.exports = async (params, reply, me) =>
{
	// Init 'user' parameter
	const userId = params.user;
	if (userId === undefined || userId === null) {
		return reply(400, 'user is required');
	}

	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// 1 ~ 100 まで
		if (!(1 <= limit && limit <= 100)) {
			return reply(400, 'invalid limit range');
		}
	} else {
		limit = 10;
	}

	// Init 'offset' parameter
	let offset = params.offset;
	if (offset !== undefined && offset !== null) {
		offset = parseInt(offset, 10);
	} else {
		offset = 0;
	}

	// Init 'sort' parameter
	let sort = params.sort || 'desc';

	// Lookup user
	const user = await User.findOne({_id: new mongo.ObjectID(userId)});

	if (user === null) {
		return reply(404, 'user not found');
	}

	// Get following
	const following = await Following
		.find({
			follower: user._id
		}, {}, {
			limit: limit,
			skip: offset,
			sort: {
				_id: sort == 'asc' ? 1 : -1
			}
		})

	if (following.length === 0) {
		return reply([]);
	}

	// serialize
	reply(await Promise.all(following.map(async f =>
		await serialize(f.followee, me))));
};
