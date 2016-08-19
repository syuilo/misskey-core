'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import DriveFile from '../../../models/drive-file';
import serialize from '../../../serializers/drive-file';

/**
 * Show a file
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
		return reply(400, 'fileId is required');
	}

	const file = await DriveFile
		.findOne({
			_id: new mongo.ObjectID(fileId),
			user: user._id
		});

	if (file === null) {
		return reply(404, 'file-not-found');
	}

	// serialize
	reply(await serialize(file));
};
