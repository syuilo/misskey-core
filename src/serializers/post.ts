'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../models/post';
import serializeUser from './user';
import serializeDriveFile from './drive-file';
const deepcopy = require('deepcopy');

/**
 * Serialize a post
 *
 * @param {Object} post
 * @param {Object} me?
 * @param {Object} options?
 * @return {Promise<Object>}
 */
const self = (
	post: any,
	me: any,
	options?: {
		serializeReplyTo: boolean
	}
) => new Promise<Object>(async (resolve, reject) =>
{
	let _post = deepcopy(post);

	const opts = options || {
		serializeReplyTo: true
	};

	// Populate the post if post is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(_post)) {
		_post = await Post.findOne({_id: _post});
	}

	_post.id = _post._id;
	delete _post._id;

	// Populate user
	_post.user = await serializeUser(_post.user, me);

	if (_post.files) {
		// Populate files
		_post.files = await (<string[]>_post.files).map(async (file) => {
			return await serializeDriveFile(file);
		});
	}

	if (_post.reply_to && opts.serializeReplyTo) {
		// Populate reply to post
		_post.reply_to = await self(_post.reply_to, me, {
			serializeReplyTo: false
		});
	}

	if (_post.repost) {
		// Populate repost
		_post.repost = await self(_post.repost, me);
	}

	resolve(_post);
});

export default self;
