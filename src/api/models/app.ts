import * as mongodb from 'mongodb';

const collection = ((global as any).db as mongodb.Db).collection('apps');

collection.createIndex('name_id');
collection.createIndex('name_id_lower');
collection.createIndex('secret');

export default collection;
