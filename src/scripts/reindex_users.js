'use strict';

import db from '../db/mongodb';
import es from '../db/elasticsearch';
import config from '../load-config';

// Init babel
require('babel-core/register');
require('babel-polyfill');

db(config()).then(db => {
	const User = db.collection('users');

	User
	.find({})
	.toArray()
	.then(users => {
		users.forEach(user => {
			es.index({
				index: 'misskey',
				type: 'user',
				id: user._id.toString(),
				body: {
					name: user.name,
					username: user.username
				}
			});
		});
	});
});
