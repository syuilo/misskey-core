'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import DriveFolder from '../../../models/drive-folder';
import serialize from '../../../serializers/drive-file';
import event from '../../../event';

/**
 * Update a folder
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	const folderId = params.folder;

	if (folderId === undefined || folderId === null) {
		return rej('folder is required');
	}

	// Get folder
	const folder = await DriveFolder
		.findOne({
			_id: new mongo.ObjectID(folderId),
			user: user._id
		});

	if (folder === null) {
		return rej('folder-not-found');
	}

	// Init 'parent' parameter
	let parentId = params.parent;
	if (parentId !== undefined && parentId !== 'null') {
		parentId = new mongo.ObjectID(parentId);
	}

	let parent = null;
	if (parentId !== undefined && parentId !== null) {
		if (parentId === 'null') {
			folder.folder = null;
		} else {
			// Get parent folder
			parent = await DriveFolder
				.findOne({
					_id: parentId,
					user: user._id
				});

			if (parent === null) {
				return rej('parent-folder-not-found');
			}

			// Check if the circular reference will be occured
			async function checkCircle(f) {
				f = await DriveFolder.findOne({ _id: f }, { _id: true, folder: true });
				if (f._id.toString() === folder._id.toString()) {
					return true;
				} else if (f.folder !== null) {
					return await checkCircle(f.folder);
				} else {
					return false;
				}
			}

			if (parent.folder !== null) {
				if (await checkCircle(parent.folder)) {
					return rej('detected-circular-definition');
				}
			}

			folder.folder = parent._id;
		}
	}

	// Update
	DriveFolder.updateOne({ _id: folder._id }, {
		$set: folder
	});

	// Serialize
	const folderObj = await serialize(folder);

	// Response
	res(folderObj);

	// Publish drive_folder_updated event
	event(user._id, 'drive_folder_updated', folderObj);
});
