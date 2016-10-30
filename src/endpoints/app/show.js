'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import App from '../../models/app';
import serialize from '../../serializers/app';

/**
 * Show an app
 *
 * @param {Object} params
 * @return {Promise<object>}
 */
module.exports = (params) =>
	new Promise(async (res, rej) =>
{
	// Get 'id' parameter
	let appId = params.id;
	if (appId == null || appId == '') {
		appId = null;
	}

	// Get 'name_id' parameter
	let nameId = params.name_id;
	if (nameId == null || nameId == '') {
		nameId = null;
	}

	if (appId === null && nameId === null) {
		return rej('id or name_id is required');
	}

	// Lookup app
	const app = appId !== null
		? await App.findOne({ _id: new mongo.ObjectID(appId) })
		: await App.findOne({ name_id_lower: nameId.toLowerCase() });

	if (app === null) {
		return rej('app not found');
	}

	// Send response
	res(await serialize(app));
});
