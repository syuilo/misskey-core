'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import DriveFolder from '../../../models/drive-folder';
import serialize from '../../../serializers/drive-folder';
import event from '../../../event';

/**
 * Create drive folder
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	const follower = user;

	// Get 'name' parameter
	let name = params.name;
	if (name !== undefined && name !== null) {
		name = name.trim();
		if (name.length === 0) {
			name = null;
		} else if (name.length > 100) {
			return rej('too long name');
		} else if (name.indexOf('\\') !== -1 || name.indexOf('/') !== -1 || name.indexOf('..') !== -1) {
			return rej('invalid name');
		}
	} else {
		name = null;
	}

	if (name == null) {
		name = '無題のフォルダー';
	}

	// Get 'folder' parameter
	let parentId = params.folder;
	if (parentId === undefined || parentId === null) {
		parentId = null;
	} else {
		parentId = new mongo.ObjectID(parentId);
	}

	// If the parent folder is specified
	let parent = null;
	if (parentId !== null) {
		parent = await DriveFolder
			.findOne({
				_id: parentId,
				user: user._id
			});

		if (parent === null) {
			return reject('folder-not-found');
		}
	}

	// Create folder
	const inserted = await DriveFolder.insert({
		created_at: new Date(),
		name: name,
		folder: parent !== null ? parent._id : null,
		user: user._id
	});

	const folder = inserted.ops[0];

	// Serialize
	const folderObj = await serialize(folder);

	// Response
	res(folderObj);

	// Publish drive_folder_created event
	event(user._id, 'drive_folder_created', folderObj);
});
