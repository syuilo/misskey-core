import * as mongodb from 'mongodb';

const collection = ((global as any).db as mongodb.Db).collection('userkeys');

collection.createIndex('key');

export default collection;
