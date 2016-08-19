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
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	const folderId = params.folder;

	if (folderId === undefined || folderId === null) {
		return reply(400, 'folder is required');
	}

	const folder = await DriveFolder
		.findOne({
			_id: new mongo.ObjectID(folderId),
			user: user._id
		});

	if (folder === null) {
		return reply(404, 'folder-not-found');
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
			parent = await DriveFolder
				.findOne({
					_id: parentId,
					user: user._id
				});

			if (parent === null) {
				return reply(404, 'parent-folder-not-found');
			}

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
				console.log(await checkCircle(parent.folder));
				if (await checkCircle(parent.folder)) {
					return reply(400, 'detected-circular-definition');
				}
			}

			folder.folder = parent._id;
		}
	}

	DriveFolder.updateOne({ _id: folder._id }, {
		$set: folder
	});

	// serialize
	const folderObj = await serialize(folder);

	// Response
	reply(folderObj);

	// Publish to stream
	event.driveFolderUpdated(user._id, folderObj);
};
