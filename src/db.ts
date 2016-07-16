//////////////////////////////////////////////////
// DB
//////////////////////////////////////////////////

import * as mongoose from 'mongoose';
import config from './config';

// Use native promises
// SEE: http://mongoosejs.com/docs/promises.html
(<any>mongoose).Promise = global.Promise;

// init mongo connection
const db = mongoose.createConnection(
	config.mongo.uri, config.mongo.options);

db.once('open', () => {
	console.log('Connected to MongoDB');
});

db.on('error', (err: any) => {
	console.error(`MongoDB connection error: ${err}`);
});

export default db;
