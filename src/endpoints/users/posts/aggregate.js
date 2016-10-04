'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../../models/user';
import Post from '../../../models/post';

/**
 * Aggregate posts of a user
 *
 * @param {Object} params
 * @param {Object} reply
 * @return {void}
 */
module.exports = async (params, reply) =>
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
	const user = await User.findOne({
		_id: new mongo.ObjectID(userId)
	});

	if (user === null) {
		return reply(404, 'user not found');
	}

	const posts = await Post
		.aggregate([
			{ $sort : { _id : sort == 'asc' ? -1 : 1 } },
			{ $match: { user: { $eq: user._id } } },
			{ $project:
				{ date: {
					day: { $subtract: [
						{ $dayOfYear: '$created_at' },
						{ $mod: [{ $dayOfYear: '$created_at' }, 1] }
					]}
				}}
			},
			{ $group: { _id: '$date', count: { '$sum': 1 } } },
			{ $limit: limit },
			{ $skip: offset }
		])
		.toArray();

	posts.forEach(x => {
		x.day = x._id.day;
	});

	reply(posts);
};
