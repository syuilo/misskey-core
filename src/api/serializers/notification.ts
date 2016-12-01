'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Notification from '../models/notification';
import serializeUser from './user';
import serializePost from './post';
const deepcopy = require('deepcopy');

/**
 * Serialize a notification
 *
 * @param {Object} notification
 * @return {Promise<Object>}
 */
export default (notification: any) => new Promise<Object>(async (resolve, reject) => {
	let _notification: any;

	// Populate the notification if 'notification' is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(notification)) {
		_notification = await Notification.findOne({
			_id: notification
		});
	} else if (typeof notification === 'string') {
		_notification = await Notification.findOne({
			_id: new mongo.ObjectID(notification)
		});
	} else {
		_notification = deepcopy(notification);
	}

	// Rename _id to id
	_notification.id = _notification._id;
	delete _notification._id;

	const i = _notification.i;
	delete _notification.i;

	switch (_notification.type) {
		case 'follow':
			// Populate user
			_notification.user = await serializeUser(_notification.user_id, i);
			break;
		case 'mention':
			// Populate post
			_notification.post = await serializePost(_notification.post_id, i);
			break;
		case 'reply':
			// Populate post
			_notification.post = await serializePost(_notification.post_id, i);
			break;
		case 'like':
			// Populate user
			_notification.user = await serializeUser(_notification.user_id, i);
			// Populate post
			_notification.post = await serializePost(_notification.post_id, i);
			break;
		case 'repost':
			// Populate post
			_notification.post = await serializePost(_notification.post_id, i);
			break;
		default:
			console.error(`Unknown type: ${_notification.type}`);
			break;
	}

	resolve(_notification);
});
