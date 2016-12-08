'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Message from '../../../models/messaging-message';
import Group from '../../../models/messaging-group';
import History from '../../../models/messaging-history';
import User from '../../../models/user';
import DriveFile from '../../../models/drive-file';
import serialize from '../../../serializers/messaging-message';
import publishUserStream from '../../../event';
import { publishMessagingStream } from '../../../event';
import config from '../../../config';

/**
 * 最大文字数
 */
const maxTextLength = 500;

/**
 * Create a message
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	// Get 'user_id' parameter
	let recipient = params.user_id;
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

	// ユーザーの指定がないかつグループの指定もなかったらエラー
	if (recipient === null && group === null) {
		return rej('user or group is required');
	}

	// ユーザーとグループ両方指定してたらエラー
	if (recipient !== null && group !== null) {
		return rej('need translate');
	}

	// Get 'text' parameter
	let text = params.text;
	if (text !== undefined && text !== null) {
		text = text.trim();
		if (text.length === 0) {
			text = null;
		} else if (text.length > maxTextLength) {
			return rej('too long text');
		}
	} else {
		text = null;
	}

	// Get 'file_id' parameter
	let file = params.file_id;
	if (file !== undefined && file !== null) {
		file = await DriveFile.findOne({
			_id: new mongo.ObjectID(file),
			user_id: user._id
		}, {
			data: false
		});

		if (file === null) {
			return rej('file not found');
		}
	} else {
		file = null;
	}

	// テキストが無いかつ添付ファイルも無かったらエラー
	if (text === null && file === null) {
		return rej('text or file is required');
	}

	// メッセージを作成
	const inserted = await Message.insert({
		created_at: new Date(),
		file_id: file ? file._id : undefined,
		recipient_id: recipient ? recipient._id : undefined,
		group_id: group ? group._id : undefined,
		text: text ? text : undefined,
		user_id: user._id,
		is_read: recipient ? false : undefined,
		read: group ? false : undefined
	});

	const message = inserted.ops[0];

	// Serialize
	const messageObj = await serialize(message);

	// Reponse
	res(messageObj);

	// 自分のストリーム
	publishMessagingStream(message.user, message.recipient, 'message', messageObj);
	publishUserStream(message.user, 'messaging_message', messageObj);

	if (message.recipient) {
		// 相手のストリーム
		publishMessagingStream(message.recipient, message.user, 'message', messageObj);
		publishUserStream(message.recipient, 'messaging_message', messageObj);
	} else if (message.group) {
		// グループのストリーム
		publishMessagingStream(message.recipient, message.user, 'message', messageObj);

		const group = await Group.findOne({
			_id: message.group
		});

		// メンバーのストリーム
		group.members.forEach(member => {
			publishUserStream(member, 'messaging_message', messageObj);
		});
	}

	// 5秒経っても(今回作成した)メッセージが既読にならなかったら「未読のメッセージがありますよ」イベントを発行する
	setTimeout(async () => {
		if (message.recipient) {
			const freshMessage = await Message.findOne({ _id: message._id }, { is_read: true });
			if (!freshMessage.is_read) {
				publishUserStream(message.recipient, 'unread_messaging_message', messageObj);
			}
		} else if (message.group) {
			// TODO
		}
	}, 5000);

	// Register to search database
	if (message.text && config.elasticsearch.enable) {
		const es = require('../../../db/elasticsearch');

		es.index({
			index: 'misskey',
			type: 'messaging_message',
			id: message._id.toString(),
			body: {
				text: message.text
			}
		});
	}

	// 履歴を作成しておく(対人)
	if (recipient) {
		// 自分
		History.updateOne({
			user_id: user._id,
			partner: recipient._id
		}, {
			updated_at: new Date(),
			user_id: user._id,
			partner: recipient._id,
			message: message._id
		}, {
			upsert: true
		});

		// 相手
		History.updateOne({
			user_id: recipient._id,
			partner: user._id
		}, {
			updated_at: new Date(),
			user_id: recipient._id,
			partner: user._id,
			message: message._id
		}, {
			upsert: true
		});
	}

	// 履歴を作成しておく(グループ)
	if (group) {
		group.members.forEach(member => {
			History.updateOne({
				user_id: member,
				group_id: group._id
			}, {
				updated_at: new Date(),
				user_id: member._id,
				group_id: group._id,
				message: message._id
			}, {
				upsert: true
			});
		});
	}
});
