import * as mongodb from 'mongodb';

const collection = (<mongodb.Db>(<any>global).db).collection('users');

collection.ensureIndex('username');
collection.ensureIndex('_web');

export default collection;
