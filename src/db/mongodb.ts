//////////////////////////////////////////////////
// CORE DB
//////////////////////////////////////////////////

import * as mongodb from 'mongodb';
import config from '../config';

export default () => new Promise<mongodb.Db>((resolve, reject) => {
	const client = mongodb.MongoClient;

	client.connect(config.mongo.uri, config.mongo.options, (err, db) => {
		if (err) {
			console.log(err);
			reject(err);
			return;
		}

		console.log('Connected to MongoDB');

		resolve(db);
	});
});
