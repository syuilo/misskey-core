import * as mongodb from 'mongodb';

const collection = (<mongodb.Db>(<any>global).db).collection('apps');

collection.createIndex('name_id');
collection.createIndex('secret');

export default collection;
