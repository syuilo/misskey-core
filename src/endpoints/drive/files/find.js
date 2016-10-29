'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import DriveFile from '../../../models/drive-file';
import serialize from '../../../serializers/drive-file';

/**
 * Find a file(s)
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
	const files = await DriveFile
		.find({
			name: name,
			user: user._id,
			folder: folder
		}, {
			data: false
		})
		.toArray();

	if (files.length === 0) {
		return res([]);
	}

	// serialize
	res(await Promise.all(files.map(async file =>
		await serialize(file))));
});
