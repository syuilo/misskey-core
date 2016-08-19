'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import DriveFolder from '../../../models/drive-folder';
import DriveFile from '../../../models/drive-file';
import serialize from '../../../serializers/drive-file';
import event from '../../../event';

/**
 * Update a file
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	const fileId = params.file;

	if (fileId === undefined || fileId === null) {
		return reply(400, 'file is required');
	}

	const file = await DriveFile
		.findOne({
			_id: new mongo.ObjectID(fileId),
			user: user._id
		}, {
			data: false
		});

	if (file === null) {
		return reply(404, 'file-not-found');
	}

	// Init 'folder' parameter
	let folderId = params.folder;
	if (folderId !== undefined && folderId !== 'null') {
		folderId = new mongo.ObjectID(folderId);
	}

	let folder = null;
	if (folderId !== undefined && folderId !== null) {
		if (folderId === 'null') {
			file.folder = null;
		} else {
			folder = await DriveFolder
				.findOne({ _id: folderId });

			if (folder === null) {
				return reject('folder-not-found');
			} else if (folder.user.toString() !== user._id.toString()) {
				return reject('folder-not-found');
			}

			file.folder = folder._id;
		}
	}

	DriveFile.updateOne({ _id: file._id }, {
		$set: file
	});

	// serialize
	const fileObj = await serialize(file);

	// Response
	reply(fileObj);

	// Publish to stream
	event.driveFileUpdated(user._id, fileObj);
};
