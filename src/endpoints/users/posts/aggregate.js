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

	// Lookup user
	const user = await User.findOne({
		_id: new mongo.ObjectID(userId)
	});

	if (user === null) {
		return reply(404, 'user not found');
	}

	const posts = await Post
		.aggregate([
			{ $match: { user: user._id } },
			{ $project:
				{ date: {
					day: { $dayOfMonth: '$created_at' },
					month: { $month: '$created_at' },
					year: { $year: '$created_at' }
				}, type: {
					$cond: {
						if: { $ne: ['$repost', null] },
						then: 'repost',
						else: {
							$cond: {
								if: { $ne: ['$reply_to', null] },
								then: 'reply',
								else: 'post'
							}
						}
					}
				}}
			},
			{ $group: { _id: {
				date: '$date',
				type: '$type'
			}, count: { '$sum': 1 } } },
			{ $group: {
				_id: '$_id.date', 
				data: { $addToSet: {
					type: "$_id.type",
					count: "$count"
				}}
			} }
		])
		.toArray();

	posts.forEach(data => {
		data.date = data._id;
		delete data._id;

		data.posts = (data.data.filter(x => x.type == 'post')[0] || { count: 0 }).count;
		data.reposts = (data.data.filter(x => x.type == 'repost')[0] || { count: 0 }).count;
		data.replies = (data.data.filter(x => x.type == 'reply')[0] || { count: 0 }).count;

		delete data.data;
	});

	reply(posts);
};
