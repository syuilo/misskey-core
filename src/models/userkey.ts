import * as mongodb from 'mongodb';

const collection = (<mongodb.Db>(<any>global).db).collection('userkeys');

collection.createIndex('key');

export default collection;
