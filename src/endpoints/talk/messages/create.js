'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Message from '../../../models/talk-message';
import Group from '../../../models/talk-group';
import History from '../../../models/talk-history';
import User from '../../../models/user';
import DriveFile from '../../../models/drive-file';
import serialize from '../../../serializers/talk-message';
import event from '../../../event';
import es from '../../../db/elasticsearch';

/**
 * 最大文字数
 */
const maxTextLength = 500;

/**
 * Create a message
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

	// Init 'text' parameter
	let text = params.text;
	if (text !== undefined && text !== null) {
		text = text.trim();
		if (text.length === 0) {
			text = null;
		} else if (text.length > maxTextLength) {
			return reply(400, 'too long text');
		}
	} else {
		text = null;
	}

	// Init 'file' parameter
	let file = params.file;
	if (file !== undefined && file !== null) {
		file = await DriveFile.findOne({
			_id: new mongo.ObjectID(file),
			user: user._id
		}, {
			data: false
		});

		if (file === null) {
			return reply(400, 'file not found');
		}
	} else {
		file = null;
	}

	// テキストが無いかつ添付ファイルも無かったらエラー
	if (text === null && file === null) {
		return reply(400, 'text or file is required');
	}

	// メッセージを作成
	const res = await Message.insert({
		created_at: Date.now(),
		file: file ? file._id : undefined,
		recipient: recipient ? recipient._id : undefined,
		group: group ? group._id : undefined,
		text: text ? text : undefined,
		user: user._id
	});

	const message = res.ops[0];

	// Serialize
	const messageObj = await serialize(message);

	// Reponse
	reply(messageObj);

	// Publish to stream
	event.publishTalkMessage(message, messageObj);

	// Register to search database
	if (message.text) {
		es.index({
			index: 'misskey',
			type: 'talk_message',
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
			user: user._id,
			partner: recipient._id
		}, {
			updated_at: Date.now(),
			user: user._id,
			partner: recipient._id,
			message: message._id
		}, {
			upsert: true
		});

		// 相手
		History.updateOne({
			user: recipient._id,
			partner: user._id
		}, {
			updated_at: Date.now(),
			user: recipient._id,
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
				user: member,
				group: group._id
			}, {
				updated_at: Date.now(),
				user: member._id,
				group: group._id,
				message: message._id
			}, {
				upsert: true
			});
		});
	}
};
