'use strict';

/**
 * Module dependencies
 */
import serialize from '../../serializers/user';

/**
 * Update an account
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, app, user) =>
{
	// Init 'name' parameter
	const name = params.name;
	if (name !== undefined && name !== null) {
		if (name.length > 30) {
			reply(400, 'too long name');
		}
	}

	// Init 'avatar' parameter
	const avatar = params.avatar;
	if (avatar !== undefined && avatar !== null) {
		// TODO: validation
	}

	User.updateOne({_id: user._id}, {
		$set: {
			name: name || user.name,
			avatar: avatar || user.avatar,
		}
	});

	// serialize
	reply(await serialize(user));
};
