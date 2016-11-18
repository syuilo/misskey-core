'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
const deepcopy = require('deepcopy');
import App from '../models/app';
import User from '../models/user';
import config from '../../config';

/**
 * Serialize an app
 *
 * @param {Object} app
 * @param {Object} options?
 * @return {Promise<Object>}
 */
export default (
	app: any,
	options?: {
		includeSecret: boolean,
		includeProfileImageIds: boolean
	}
) => new Promise<any>(async (resolve, reject) => {
	const opts = options || {
		includeSecret: false,
		includeProfileImageIds: false
	};

	let _app: any;

	// Populate the app if 'app' is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(app)) {
		_app = await App.findOne({
			_id: app
		});
	} else if (typeof app === 'string') {
		_app = await User.findOne({
			_id: new mongo.ObjectID(app)
		});
	} else {
		_app = deepcopy(app);
	}

	// Rename _id to id
	_app.id = _app._id;
	delete _app._id;

	delete _app.name_id_lower;

	// Visible by only owner
	if (!opts.includeSecret) {
		delete _app.secret;
	}

	_app.icon_url = _app.icon != null
		? `${config.drive_url}/${_app.icon}`
		: `${config.drive_url}/app-default.jpg`;

	resolve(_app);
});
