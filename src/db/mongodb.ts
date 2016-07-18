//////////////////////////////////////////////////
// CORE DB
//////////////////////////////////////////////////

import * as mongodb from 'mongodb';
import config from '../config';

const client = mongodb.MongoClient;

client.connect(config.mongo.uri, config.mongo.options, (err, db) => {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Connected to MongoDB');

	(<any>global).db = db;
});
