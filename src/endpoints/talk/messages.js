'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Message from '../../models/talk-message';
import Group from '../../models/talk-group';
import User from '../../models/user';
import serialize from '../../serializers/talk-message';

/**
 * Get messages
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	// Init 'user' parameter
	let recipient = params.user;
	if (recipient !== undefined && recipient !== null) {
		recipient = await User.findOne({
			_id: new mongo.ObjectID(recipient)
		});

		if (recipient === null) {
			return reply(400, 'user not found');
		}
	} else {
		recipient = null;
	}

	// Init 'group' parameter
	let group = params.group;
	if (group !== undefined && group !== null) {
		group = await Group.findOne({
			_id: new mongo.ObjectID(group)
		});

		if (group === null) {
			return reply(400, 'group not found');
		}

		// このグループのメンバーじゃなかったらreject
		if (group.members
				.map(member => member.toString())
				.indexOf(user._id.toString()) === -1) {
			return reply(403, 'access denied');
		}
	} else {
		group = null;
	}

	// ユーザーの指定がないかつグループの指定もなかったらエラー
	if (recipient === null && group === null) {
		return reply(400, 'user or group is required');
	}

	// ユーザーとグループ両方指定してたらエラー
	if (recipient !== null && group !== null) {
		return reply(400, 'need translate');
	}

	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// 1 ~ 100 まで
		if (limit < 1) {
			return reply(400, 'invalid limit range');
		} else if (limit > 100) {
			return reply(400, 'invalid limit range');
		}
	} else {
		limit = 10;
	}

	const since = params.since || null;
	const max = params.max || null;

	// 両方指定してたらエラー
	if (since !== null && max !== null) {
		return reply(400, 'cannot set since and max');
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

	// クエリ発行
	const messages = await Message
		.find(query, {}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (messages.length === 0) {
		return reply([]);
	}

	// serialize
	reply(await Promise.all(messages.map(async message => await serialize(message))));
};
