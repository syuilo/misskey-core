import * as mongodb from 'mongodb';
import { IConfig } from '../iconfig';

export default async function(config: IConfig): Promise<mongodb.Db> {
	const uri = config.mongodb.user && config.mongodb.pass
		? `mongodb://${config.mongodb.user}:${config.mongodb.pass}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`
		: `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;
	return await mongodb.MongoClient.connect(uri);
};
