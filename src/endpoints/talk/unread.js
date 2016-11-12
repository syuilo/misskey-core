'use strict';

/**
 * Module dependencies
 */
import Message from '../../models/talk-message';

/**
 * Get count of unread messages
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	const count = await Message
		.count({
			recipient: user._id,
			is_read: false
		});

	res({
		count: count
	});
});
