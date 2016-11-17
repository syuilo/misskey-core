'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import DriveFile from '../../models/drive-file';
import serialize from '../../serializers/drive-file';

/**
 * Get drive files
 *
 * @param {Object} params
 * @param {Object} user
 * @param {Object} app
 * @return {Promise<object>}
 */
module.exports = (params, user, app) =>
	new Promise(async (res, rej) =>
{
	// Get 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// From 1 to 100
		if (!(1 <= limit && limit <= 100)) {
			return rej('invalid limit range');
		}
	} else {
		limit = 10;
	}

	const since = params.since || null;
	const max = params.max || null;

	// Check if both of since and max is specified
	if (since !== null && max !== null) {
		return rej('cannot set since and max');
	}

	// Get 'folder' parameter
	let folder = params.folder;
	if (folder === undefined || folder === null || folder === 'null') {
		folder = null;
	} else {
		folder = new mongo.ObjectID(folder);
	}

	// Construct query
	const sort = {
		_id: -1
	};
	const query = {
		user: user._id,
		folder: folder
	};
	if (since !== null) {
		sort._id = 1;
		query._id = {
			$gt: new mongo.ObjectID(since)
		};
	} else if (max !== null) {
		query._id = {
			$lt: new mongo.ObjectID(max)
		};
	}

	// Issue query
	const files = await DriveFile
		.find(query, {
			data: false
		}, {
			limit: limit,
			sort: sort
		})
		.toArray();

	if (files.length === 0) {
		return res([]);
	}

	// Serialize
	res(await Promise.all(files.map(async file =>
		await serialize(file))));
});
