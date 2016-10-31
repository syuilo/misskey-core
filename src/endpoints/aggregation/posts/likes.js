'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../../models/post';
import Like from '../../../models/like';

/**
 * Aggregate likes of a post
 *
 * @param {Object} params
 * @return {Promise<object>}
 */
module.exports = (params) =>
	new Promise(async (res, rej) =>
{
	// Init 'post' parameter
	const postId = params.post;
	if (postId === undefined || postId === null) {
		return rej('post is required');
	}

	// Lookup post
	const post = await Post.findOne({
		_id: new mongo.ObjectID(postId)
	});

	if (post === null) {
		return rej('post not found');
	}

	const startTime = new Date(new Date().setMonth(new Date().getMonth() - 1));

	const likes = await Like
		.find({
			post: post._id,
			$or: [
				{ deleted_at: { $exists: false } },
				{ deleted_at: { $gt: startTime } }
			]
		}, {
			_id: false,
			post: false
		}, {
			sort: { created_at: -1 }
		})
		.toArray();

	const graph = [];

	for (let i = 0; i < 30; i++) {
		let day = new Date(new Date().setDate(new Date().getDate() - i));
		day = new Date(day.setMilliseconds(999));
		day = new Date(day.setSeconds(59));
		day = new Date(day.setMinutes(59));
		day = new Date(day.setHours(23));
		//day = day.getTime();

		const count = likes.filter(l =>
			l.created_at < day && (l.deleted_at == null || l.deleted_at > day)
		).length;

		graph.push({
			date: {
				year: day.getFullYear(),
				month: day.getMonth() + 1, // In JavaScript, month is zero-based.
				day: day.getDate()
			},
			count: count
		});
	}

	res(graph);
});
