import * as mongodb from 'mongodb';

const collection = (<mongodb.Db>(<any>global).db).collection('users');

collection.createIndex('username');
collection.createIndex('_web');

export default collection;
