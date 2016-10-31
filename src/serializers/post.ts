'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Post from '../models/post';
import Like from '../models/like';
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
	me?: any,
	options?: {
		serializeReplyTo: boolean,
		serializeRepost: boolean,
		includeIsLiked: boolean
	}
) => new Promise<Object>(async (resolve, reject) => {
	const opts = options || {
		serializeReplyTo: true,
		serializeRepost: true,
		includeIsLiked: true
	};

	let _post: any;

	// Populate the post if 'post' is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(post)) {
		_post = await Post.findOne({
			_id: post
		});
	} else if (typeof post === 'string') {
		_post = await Post.findOne({
			_id: new mongo.ObjectID(post)
		});
	} else {
		_post = deepcopy(post);
	}

	const id = _post._id;

	// Rename _id to id
	_post.id = _post._id;
	delete _post._id;

	// Populate user
	_post.user = await serializeUser(_post.user, me);

	if (_post.images) {
		// Populate images
		_post.images = await Promise.all(_post.images.map(async (file) =>
			await serializeDriveFile(file)
		));
	}

	if (_post.reply_to && opts.serializeReplyTo) {
		// Populate reply to post
		_post.reply_to = await self(_post.reply_to, me, {
			serializeReplyTo: false,
			serializeRepost: false,
			includeIsLiked: false
		});
	}

	if (_post.repost && opts.serializeRepost) {
		// Populate repost
		_post.repost = await self(_post.repost, me, {
			serializeReplyTo: _post.text == null,
			serializeRepost: _post.text == null,
			includeIsLiked: _post.text == null
		});
	}

	// Check is liked
	if (me && opts.includeIsLiked) {
		const liked = await Like
			.count({
				user: me._id,
				post: id
			}, {
				limit: 1
			});

		_post.is_liked = liked === 1;
	}

	resolve(_post);
});

export default self;
