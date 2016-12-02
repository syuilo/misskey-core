'use strict';

import parse from 'misskey-text';
import db from '../db/mongodb';

// Init babel
require('babel-core/register');
require('babel-polyfill');

db(require('../config').default).then(async (db) => {
	const Post = db.collection('posts');
	const User = db.collection('users');

	const posts = await Post
		.find({})
		.toArray();

	posts.forEach(async post => {

		let mentions = [];

		if (post.reply_to_id) {
			const replyTo = await Post.findOne({
				_id: post.reply_to_id
			});

			mentions.push(replyTo.user_id);
		}

		if (post.repost_id) {
			const repost = await Post.findOne({
				_id: post.repost_id
			});

			// If it is quote repost
			if (post.text) {
				// Add mention
				mentions.push(repost.user_id);
			}
		}

		if (post.text) {
			const tokens = parse(post.text);

			const atMentions = tokens
				.filter(t => t.type == 'mention')
				.map(m => m.username)
				.filter((v, i, s) => s.indexOf(v) == i);

			await Promise.all(atMentions.map(async (mention) => {
				const mentionee = await User
					.findOne({
						username_lower: mention.toLowerCase()
					}, { _id: true });

				if (mentionee == null) return;

				mentions.push(mentionee._id);

				return;
			}));
		}

		if (mentions.length == 0) return;

		mentions = mentions
			.filter((v, i, s) =>
				s.map(x => x.toString())
				.indexOf(v.toString()) == i);

		Post.updateOne({ _id: post._id }, {
			$set: {
				mentions: mentions
			}
		});
	});
});
