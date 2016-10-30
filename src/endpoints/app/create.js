'use strict';

/**
 * Module dependencies
 */
import rndstr from 'rndstr';
import User from '../../models/user';
import serialize from '../serializers/app';

/**
 * Create an app
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = async (params, user) =>
	new Promise(async (res, rej) =>
{
	// Init 'name_id' parameter
	const nameId = params.name_id;
	if (nameId == null || nameId == '') {
		return rej('name_id is required');
	}

	// Validate name_id
	if (!/^[a-zA-Z0-9\-]{3,20}$/.test(nameId)) {
		return rej('invalid name_id');
	}

	// Get 'name' parameter
	const name = params.name;
	if (name == null) {
		return rej('name is required');
	}

	// Generate secret
	const secret = rndstr('a-zA-Z0-9', 32);

	// Create account
	const inserted = await App.insert({
		created_at: new Date(),
		user: user._id,
		name: name,
		name_id: nameId,
		secret: secret
	});

	const app = inserted.ops[0];

	// Response
	res(await serialize(app));
});
