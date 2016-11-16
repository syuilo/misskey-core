'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Message from '../../models/messaging-message';
import Group from '../../models/messaging-group';
import User from '../../models/user';
import serialize from '../../serializers/messaging-message';
import { publishTalkingStream } from '../../event';

/**
 * Get messages
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	// Get 'user' parameter
	let recipient = params.user;
	if (recipient !== undefined && recipient !== null) {
		recipient = await User.findOne({
			_id: new mongo.ObjectID(recipient)
		});

		if (recipient === null) {
			return rej('user not found');
		}
	} else {
		recipient = null;
	}

	// Get 'group' parameter
	let group = params.group;
	if (group !== undefined && group !== null) {
		group = await Group.findOne({
			_id: new mongo.ObjectID(group)
		});

		if (group === null) {
			return rej('group not found');
		}

		// このグループのメンバーじゃなかったらreject
		if (group.members
				.map(member => member.toString())
				.indexOf(user._id.toString()) === -1) {
			return rej('access denied');
		}
	} else {
		group = null;
	}

	// Get 'mark_as_read' parameter
	let markAsRead = params.mark_as_read;
	if (markAsRead == null) {
		markAsRead = true;
	} else {
		markAsRead = markAsRead === 'true';
	}

	// ユーザーの指定がないかつグループの指定もなかったらエラー
	if (recipient === null && group === null) {
		return rej('user or group is required');
	}

	// ユーザーとグループ両方指定してたらエラー
	if (recipient !== null && group !== null) {
		return rej('need translate');
	}

	// Init 'limit' parameter
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

	const since = params.since || null;
	const max = params.max || null;

	// Check if both of since and max is specified
	if (since !== null && max !== null) {
		return rej('cannot set since and max');
	}

	let query;

	const sort = {
		created_at: -1
	};

	if (recipient) {
		query = {
			$or: [{
				user: user._id,
				recipient: recipient._id
			}, {
				user: recipient._id,
				recipient: user._id
			}]
		};
	} else if (group) {
		query = {
			group: group._id
		};
	}

	if (since !== null) {
		sort.created_at = 1;
		query._id = {
			$gt: new mongo.ObjectID(since)
		};
	} else if (max !== null) {
		query._id = {
			$lt: new mongo.ObjectID(max)
		};
	}

	// Issue query
	const messages = await Message
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (messages.length === 0) {
		return res([]);
	}

	// Serialize
	res(await Promise.all(messages.map(async message =>
		await serialize(message))));

	// Mark as read all
	if (markAsRead) {
		if (recipient) {
			const ids = messages
				.filter(m => m.is_read == false)
				.filter(m => m.recipient.toString() == user._id.toString())
				.map(m => m._id);

			// Update documents
			Message.update({
				_id: { $in: ids }
			}, {
				$set: { is_read: true }
			}, {
				multi: true
			});

			// Publish event
			publishTalkingStream(message.recipient, user._id, 'read', ids.map(id => id.toString()));
		} else if (group) {
			// TODO
		}
	}
});
