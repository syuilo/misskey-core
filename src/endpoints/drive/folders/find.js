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
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	const name = params.name;

	if (name === undefined || name === null) {
		return reply(400, 'name is required');
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
		return reply([]);
	}

	// serialize
	reply(await Promise.all(folders.map(async folder => await serialize(folder))));
};
