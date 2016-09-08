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
		return reply([]);
	}

	// serialize
	reply(await Promise.all(files.map(async file =>
		await serialize(file))));
};
