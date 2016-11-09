'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../../models/post';
import serialize from '../../serializers/post';
import es from '../../db/elasticsearch';

const size = 10;

/**
 * Search a post
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	// Init 'query' parameter
	let query = params.query;
	if (query === undefined || query === null || query.trim() === '') {
		return rej('query is required');
	}

	// Init 'page' parameter
	let page = params.page;
	if (page === undefined) {
		page = 0;
	}

	const from = page * size;

	es.search({
		index: 'misskey',
		type: 'post',
		body: {
			size: size,
			from: from,
			query: {
				simple_query_string: {
					fields: ['text'],
					query: query,
					default_operator: 'and'
				}
			}
		}
	}, async (error, response) => {
		if (error) {
			console.error(error);
			return res(500);
		}

		if (response.hits.total === 0) {
			return res([]);
		}

		const hits = response.hits.hits.map(hit => new mongo.ObjectID(hit._id));

		const posts = await Post
			.find({
				_id: {
					$in: hits
				}
			})
			.toArray();

		// Serialize
		res(await Promise.all(posts.map(async post =>
			await serialize(post))));
	});
});
