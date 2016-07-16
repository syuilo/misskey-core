import * as mongodb from 'mongodb';

export default (<mongodb.Db>(<any>global).db).collection('drive_folders');
