import * as mongodb from 'mongodb';

export default ((global as any).db as mongodb.Db).collection('messaging_groups');
