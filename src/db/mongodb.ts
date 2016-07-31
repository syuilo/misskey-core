//////////////////////////////////////////////////
// CORE DB
//////////////////////////////////////////////////

import * as mongodb from 'mongodb';

export default (config: any) => new Promise<mongodb.Db>((resolve, reject) => {
	const client = mongodb.MongoClient;

	client.connect(config.mongo.uri, config.mongo.options, (err, db) => {
		if (err) {
			reject(err);
			return;
		}

		resolve(db);
	});
});
