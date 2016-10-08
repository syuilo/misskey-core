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

	const datas = await Post
		.aggregate([
			{ $match: { user: user._id } },
			{ $project: {
				repost: '$repost',
				reply_to: '$reply_to',
				created_at: { $add: ['$created_at', 9 * 60 * 60 * 1000] } // 日本時間に戻す
			}},
			{ $project: {
				date: {
					year: { $year: '$created_at' },
					month: { $month: '$created_at' },
					day: { $dayOfMonth: '$created_at' }
				},
				type: {
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

	datas.forEach(data => {
		data.date = data._id;
		delete data._id;

		data.posts = (data.data.filter(x => x.type == 'post')[0] || { count: 0 }).count;
		data.reposts = (data.data.filter(x => x.type == 'repost')[0] || { count: 0 }).count;
		data.replies = (data.data.filter(x => x.type == 'reply')[0] || { count: 0 }).count;

		delete data.data;
	});

	const graph = [];

	for (let i = 0; i < 30; i++) {
		let day = new Date(new Date().setDate(new Date().getDate() - i));

		const data = datas.filter(d =>
			d.date.year == day.getFullYear() && d.date.month == day.getMonth() + 1 && d.date.day == day.getDate()
		)[0];

		if (data) {
			graph.push(data)
		} else {
			graph.push({
				date: {
					year: day.getFullYear(),
					month: day.getMonth() + 1, // JavaScriptでは月を0~11で表すので+1します
					day: day.getDate()
				},
				posts: 0,
				reposts: 0,
				replies: 0
			})
		};
	}

	reply(graph);
};
