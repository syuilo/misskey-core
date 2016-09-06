'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Notification from '../../../models/notification';
import serialize from '../../../serializers/notification';
import event from '../../../event';

/**
 * Mark as read a notification
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	const notificationId = params.notification;

	if (notificationId === undefined || notificationId === null) {
		return reply(400, 'notification is required');
	}

	// Get notifcation
	const notification = await Notification
		.findOne({
			_id: new mongo.ObjectID(notificationId),
			i: user._id
		});

	if (notification === null) {
		return reply(404, 'notification-not-found');
	}

	// Update
	notification.is_read = true;
	Notification.updateOne({ _id: notification._id }, {
		$set: {
			is_read: true
		}
	});

	// Response
	reply();

	// serialize
	const notificationObj = await serialize(notification);

	// Publish read_notification event
	event(user._id, 'read_notification', notificationObj);
};
