'use strict';

import User from '../models/user';
import es from '../db/elasticsearch';

User
.find(query, {}, {
	limit: limit,
	sort: sort
})
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
