'use strict';

/**
 * Module dependencies
 */
import Post from '../../models/post';
import serialize from '../../serializers/post';

/**
 * Show a post
 *
 * @param {Object} params
 * @param {Object} res
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, res, app, user) =>
{
	const id = params['id'];

	if (id === undefined || id === null) {
		return res(400, 'id-is-required');
	}

	// Get post
	const post = await Post
		.findById(id)
		.lean()
		.exec();

	if (post === null) {
		return res(404, 'post-not-found');
	}

	// serialize
	res(await serialize(post));
};
