'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import DriveFolder from '../../../models/drive-folder';
import serialize from '../../../serializers/drive-folder';

/**
 * Find a folder(s)
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	const name = params.name;

	if (name === undefined || name === null) {
		return rej('name is required');
	}

	// Init 'folder' parameter
	let folder = params.folder;
	if (folder === undefined || folder === null || folder === 'null') {
		folder = null;
	} else {
		folder = new mongo.ObjectID(folder);
	}

	// クエリ発行
	const folders = await DriveFolder
		.find({
			name: name,
			user: user._id,
			folder: folder
		})
		.toArray();

	if (folders.length === 0) {
		return res([]);
	}

	// serialize
	res(await Promise.all(folders.map(async folder =>
		await serialize(folder))));
});
