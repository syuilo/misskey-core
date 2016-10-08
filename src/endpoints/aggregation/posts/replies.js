'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../../models/post';

/**
 * Aggregate replies of a post
 *
 * @param {Object} params
 * @param {Object} reply
 * @return {void}
 */
module.exports = async (params, reply) =>
{
	// Init 'post' parameter
	const postId = params.post;
	if (postId === undefined || postId === null) {
		return reply(400, 'post is required');
	}

	// Lookup post
	const post = await Post.findOne({
		_id: new mongo.ObjectID(postId)
	});

	if (post === null) {
		return reply(404, 'post not found');
	}

	const datas = await Post
		.aggregate([
			{ $match: { reply_to: post._id } },
			{ $project: {
				created_at: { $add: ['$created_at', 9 * 60 * 60 * 1000] } // 日本時間に戻す
			}},
			{ $project: {
				date: {
					year: { $year: '$created_at' },
					month: { $month: '$created_at' },
					day: { $dayOfMonth: '$created_at' }
				}
			}},
			{ $group: {
				_id: '$date',
				count: { $sum: 1 }
			}}
		])
		.toArray();

	datas.forEach(data => {
		data.date = data._id;
		delete data._id;
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
				count: 0
			})
		};
	}

	reply(graph);
};
