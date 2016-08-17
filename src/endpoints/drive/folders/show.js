'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import DriveFolder from '../../../models/drive-folder';
import serialize from '../../../serializers/drive-folder';

/**
 * Show a folder
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
		.findOne({ _id: new mongo.ObjectID(folderId) });

	if (folder === null) {
		return reply(404, 'folder-not-found');
	} else if (folder.user.toString() !== user._id.toString()) {
		return reply(404, 'folder-not-found');
	}

	// serialize
	reply(await serialize(folder, {
		includeParent: true
	}));
};
