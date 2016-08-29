'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Message from '../models/talk-message';
import serializeUser from './user';
import serializeGroup from './talk-group';
import serializeDriveFile from './drive-file';
const deepcopy = require('deepcopy');

/**
 * Serialize a message
 *
 * @param {Object} message
 * @param {Object} me?
 * @param {Object} options?
 * @return {Promise<Object>}
 */
export default (
	message: any,
	me: any,
	options?: {
		populateRecipientAndGroup: boolean
	}
) => new Promise<Object>(async (resolve, reject) =>
{
	const opts = options || {
		populateRecipientAndGroup: true
	};

	let _message: any;

	// Populate the message if 'message' is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(message)) {
		_message = await Message.findOne({
			_id: message
		});
	} else if (typeof message === 'string') {
		_message = await Message.findOne({
			_id: new mongo.ObjectID(message)
		});
	} else {
		_message = deepcopy(message);
	}

	_message.id = _message._id;
	delete _message._id;

	// Populate user
	_message.user = await serializeUser(_message.user, me);

	if (_message.file) {
		// Populate file
		_message.file = await serializeDriveFile(_message.file);
	}

	if (_message.recipient && opts.populateRecipientAndGroup) {
		// Populate recipient
		_message.recipient = await serializeUser(_message.recipient, me);
	}

	if (_message.group && opts.populateRecipientAndGroup) {
		// Populate group
		_message.group = await serializeGroup(_message.group, me);
	}

	resolve(_message);
});
