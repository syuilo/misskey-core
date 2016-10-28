'use strict';

/**
 * Module dependencies
 */
import * as fs from 'fs';
import * as mongo from 'mongodb';
import File from '../../../models/drive-file';
import User from '../../../models/user';
import serialize from '../../../serializers/drive-file';
import create from '../../../common/add-file-to-drive';

/**
 * Create a file
 *
 * @param {Object} file
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (file, params, reply, user) =>
{
	const buffer = fs.readFileSync(file.path);
	fs.unlink(file.path);

	// Init 'name' parameter
	let name = file.originalname;
	if (name !== undefined && name !== null) {
		name = name.trim();
		if (name.length === 0) {
			name = null;
		} else if (name === 'blob') {
			name = null;
		} else if (name.length > 128) {
			return reply(400, 'too long name');
		} else if (name.indexOf('\\') !== -1 || name.indexOf('/') !== -1 || name.indexOf('..') !== -1) {
			return reply(400, 'invalid name');
		}
	} else {
		name = null;
	}

	// Init 'folder' parameter
	let folder = params.folder;
	if (folder === undefined || folder === null || folder === 'null') {
		folder = null;
	} else {
		folder = new mongo.ObjectID(folder);
	}

	// Create file
	const driveFile = await create(user, buffer, name, null, folder);

	// Serialize
	const fileObj = await serialize(driveFile);

	// Response
	reply(fileObj);
};
