import * as mongodb from 'mongodb';

const collection = ((global as any).db as mongodb.Db).collection('users');

collection.createIndex('username');
collection.createIndex('token');

export default collection;
