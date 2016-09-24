'use strict';

import db from '../db/mongodb';
import config from '../load-config';

// Init babel
require('babel-core/register');
require('babel-polyfill');

db(config()).then(db => {
	const User = db.collection('users');
	const Post = db.collection('posts');
	const Like = db.collection('likes');

	User
	.find({}, { _id: true })
	.toArray()
	.then(users => {
		users.forEach(user => {
			Post.find({ user: user._id }, { _id: true }).toArray().then(posts => {
				Like.count({
					user: user._id
				}).then(count => {
					User.updateOne({ _id: user._id }, {
						$set: { likes_count: count }
					});
				});

				Like.count({
					post: { $in: posts.map(p => p._id) }
				}).then(count => {
					User.updateOne({ _id: user._id }, {
						$set: { liked_count: count }
					});
				});
			});
		});
	});
});
