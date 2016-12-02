'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Mention from '../../models/mention';
import getFriends from '../../common/get-friends';
import serialize from '../../serializers/post';
import publishUserStream from '../../event';

/**
 * Get mentions of myself
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	// Get 'following' parameter
	const following = params.following === 'true';

	// Get 'mark_as_read' parameter
	let markAsRead = params.mark_as_read;
	if (markAsRead == null) {
		markAsRead = true;
	} else {
		markAsRead = markAsRead === 'true';
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

	const since = params.since_id || null;
	const max = params.max_id || null;

	// Check if both of since_id and max_id is specified
	if (since !== null && max !== null) {
		return rej('cannot set since_id and max_id');
	}

	// Construct query
	const sort = {
		_id: -1
	};
	const query = {
		user_id: user._id
	};

	if (following) {
		// ID list of the user itself and other users who the user follows
		const followingIds = await getFriends(user._id);

		// 非正規データでクエリ
		query._post_user_id = {
			$in: followingIds
		};
	}

	if (since !== null) {
		sort._id = 1;
		query.post_id = {
			$gt: new mongo.ObjectID(since)
		};
	} else if (max !== null) {
		query.post_id = {
			$lt: new mongo.ObjectID(max)
		};
	}

	// Issue query
	const mentions = await Mention
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	// Serialize
	res(await Promise.all(mentions.map(async mention =>
		await serialize(mention.post_id, user)
	)));

	// Mark as read all
	if (markAsRead) {
		const ids = mentions
			.filter(m => m.is_read == false)
			.map(m => m._id);

		// Update documents
		await Mention.update({
			_id: { $in: ids }
		}, {
			$set: { is_read: true }
		}, {
			multi: true
		});

		const count = await Mention
			.count({
				user_id: user._id,
				is_read: false
			});

		if (count == 0) {
			// 全ての(いままで未読だった)Mentionを(これで)読みましたよというイベントを発行
			publishUserStream(user._id, 'read_all_mentions');
		}
	}
});
