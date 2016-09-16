'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
const deepcopy = require('deepcopy');
import User from '../models/user';
import Following from '../models/following';
import config from '../config';

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

	// me
	if (me && !mongo.ObjectID.prototype.isPrototypeOf(me)) {
		if (typeof me === 'string') {
			me = new mongo.ObjectID(me);
		} else {
			me = me._id;
		}
	}

	// Rename _id to id
	_user.id = _user._id;
	delete _user._id;

	delete _user._web;
	delete _user.username_lower;

	// Remove private properties
	delete _user.password;

	// 自分だけが見れる
	if (!opts.includePrivates) {
		delete _user.drive_capacity;
	}

	// 公式でしか見れない
	if (!opts.includeSecrets) {
		delete _user._webdata;
		delete _user.email;
	}

	_user.avatar_url = _user.avatar !== null
		? `${config.drive.url}/${_user.avatar}`
		: `${config.drive.url}/default-avatar.jpg`;

	_user.banner_url = _user.banner !== null
		? `${config.drive.url}/${_user.banner}`
		: null;

	if (!opts.includeProfileImageIds) {
		delete _user.avatar;
		delete _user.banner;
	}

	if (me && me.toString() !== _user.id.toString()) {
		// フォローしているか
		const follow = await Following.findOne({
			follower: me,
			followee: _user.id
		});
		_user.is_following = follow !== null;

		// フォローされているか
		const follow2 = await Following.findOne({
			follower: _user.id,
			followee: me
		});
		_user.is_followed = follow2 !== null;
	}

	resolve(_user);
});
