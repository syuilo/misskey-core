'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
const deepcopy = require('deepcopy');
import User from '../models/user';
import config from '../config';

/**
 * Serialize a user
 *
 * @param {Object} user
 * @param {Object} options?
 * @return {Promise<Object>}
 */
export default (
	user: any,
	options?: {
		includePrivates: boolean,
		includeSecrets: boolean,
		includeProfileImageIds: boolean
	}
) => new Promise<any>(async (resolve, reject) =>
{
	const opts = options || {
		includePrivates: false,
		includeSecrets: false,
		includeProfileImageIds: false
	};

	let _user: any;

	// Populate the user if 'user' is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(user)) {
		_user = await User.findOne({
			_id: user
		});
	} else if (typeof user === 'string') {
		_user = await User.findOne({
			_id: new mongo.ObjectID(user)
		});
	} else {
		_user = deepcopy(user);
	}

	_user.id = _user._id;
	delete _user._id;

	// Remove private properties
	delete _user.password;
	if (!opts.includePrivates) {
		delete _user.drive_capacity;
	}
	if (!opts.includeSecrets) {
		delete _user._web;
		delete _user.email;
	}

	_user.avatar_url = _user.avatar !== null
		? `${config.drive.url}/${_user.avatar}`
		: `${config.drive.url}/default-avatar.jpg`;

	_user.banner_url = _user.banner !== null
		? `${config.drive.url}/${_user.banner}`
		: `${config.drive.url}/default-banner.jpg`;

	if (!opts.includeProfileImageIds) {
		delete _user.avatar;
		delete _user.banner;
	}

	resolve(_user);
});
