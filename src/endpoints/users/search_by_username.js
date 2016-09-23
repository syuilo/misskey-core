'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import User from '../../models/user';
import serialize from '../../serializers/user';

/**
 * Search a user by username
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} me
 * @return {void}
 */
module.exports = async (params, reply, me) =>
{
	// Init 'query' parameter
	let query = params.query;
	if (query === undefined || query === null || query.trim() === '') {
		return reply(400, 'query is required');
	}

	query = query.trim();

	if (!/^[a-zA-Z0-9-]+$/.test(query)) {
		return reply(400, 'invalid query');
	}

	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// 1 ~ 100 まで
		if (limit < 1) {
			return reply(400, 'invalid limit range');
		} else if (limit > 100) {
			return reply(400, 'invalid limit range');
		}
	} else {
		limit = 10;
	}

	// Init 'offset' parameter
	let offset = params.offset;
	if (offset !== undefined && offset !== null) {
		offset = parseInt(offset, 10);
	} else {
		offset = 0;
	}

	const users = await User
		.find({
			username_lower: new RegExp(query.toLowerCase())
		})
		.toArray();

	// serialize
	reply(await Promise.all(users.map(async user =>
		await serialize(user, me))));
};
