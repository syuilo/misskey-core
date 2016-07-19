'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../models/user';
import config from '../config';
const deepcopy = require('deepcopy');

/**
 * Serialize a user
 *
 * @param {Object} user
 * @param {Object} me?
 * @param {Object} options?
 * @return {Promise<Object>}
 */
export default (
	user: any,
	me?: any,
	options?: {
		includeSecrets: boolean,
		includeProfileImageIds: boolean
	}
) => new Promise<any>(async (resolve, reject) =>
{
	let _user = deepcopy(user);

	const opts = options || {
		includeSecrets: false,
		includeProfileImageIds: false
	};

	// Populate the user if user is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(_user)) {
		_user = await User.findOne({_id: _user});
	}

	_user.id = _user._id;
	delete _user._id;

	// Remove private properties
	delete _user.password;
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
