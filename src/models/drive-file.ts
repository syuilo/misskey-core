import * as mongodb from 'mongodb';

export default ((global as any).db as mongodb.Db).collection('drive_files');
