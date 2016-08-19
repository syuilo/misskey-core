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
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	const follower = user;

	// Init 'name' parameter
	let name = params.name;
	if (name !== undefined && name !== null) {
		name = name.trim();
		if (name.length === 0) {
			name = null;
		} else if (name.length > 100) {
			return reply(400, 'too long name');
		} else if (name.indexOf('\\') !== -1 || name.indexOf('/') !== -1 || name.indexOf('..') !== -1) {
			return reply(400, 'invalid name');
		}
	} else {
		name = null;
	}

	if (name == null) {
		name = '無題のフォルダー';
	}

	// Init 'folder' parameter
	let parentId = params.folder;
	if (parentId === undefined || parentId === null) {
		parentId = null;
	} else {
		parentId = new mongo.ObjectID(parentId);
	}

	// 親フォルダ指定時
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
	const res = await DriveFolder.insert({
		created_at: Date.now(),
		name: name,
		folder: parent !== null ? parent._id : null,
		user: user._id
	});

	const folder = res.ops[0];

	// Serialize
	const folderObj = await serialize(folder);

	// Response
	reply(folderObj);

	// Publish to stream
	event.driveFolderCreated(user._id, folderObj);
};
