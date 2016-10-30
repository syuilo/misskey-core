import * as mongodb from 'mongodb';

export default (<mongodb.Db>(<any>global).db).collection('auth_sess_keys');
