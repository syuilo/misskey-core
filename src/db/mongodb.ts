//////////////////////////////////////////////////
// CORE DB
//////////////////////////////////////////////////

import * as mongodb from 'mongodb';
import {IConfig} from '../iconfig';

export default (config: IConfig) => new Promise<mongodb.Db>((resolve, reject) => {
	const client = mongodb.MongoClient;
	const url = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;

	client.connect(url, {
		user: config.mongodb.user,
		pass: config.mongodb.pass
	}, (err, db) => {
		if (err) {
			reject(err);
			return;
		}

		resolve(db);
	});
});
