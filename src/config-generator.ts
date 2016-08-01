import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as inquirer from 'inquirer';
import {IConfig} from './iconfig';
import {configPath, configDirPath} from './meta';

export default async () => {
	const as = await inquirer.prompt([
		{
			type: 'input',
			name: 'maintainer',
			message: 'Maintainer name(and email address):'
		},
		{
			type: 'input',
			name: 'port',
			message: 'Listen port:'
		},
		{
			type: 'input',
			name: 'internal_port',
			message: 'Internal listen port:'
		},
		{
			type: 'confirm',
			name: 'https',
			message: 'Use TLS?',
			default: false
		},
		{
			type: 'input',
			name: 'https_key',
			message: 'Path of tls key:',
			when: ctx => ctx.https
		},
		{
			type: 'input',
			name: 'https_cert',
			message: 'Path of tls cert:',
			when: ctx => ctx.https
		},
		{
			type: 'input',
			name: 'https_ca',
			message: 'Path of tls ca:',
			when: ctx => ctx.https
		},
		{
			type: 'input',
			name: 'web_secret',
			message: 'Web secret key:'
		},
		{
			type: 'input',
			name: 'drive_url',
			message: 'Drive(misskey-file server)\'s url:'
		},
		{
			type: 'input',
			name: 'mongo_host',
			message: 'MongoDB\'s host:',
			default: 'localhost'
		},
		{
			type: 'input',
			name: 'mongo_port',
			message: 'MongoDB\'s port:',
			default: '27017'
		},
		{
			type: 'input',
			name: 'mongo_db',
			message: 'MongoDB\'s db:',
			default: 'misskey'
		},
		{
			type: 'input',
			name: 'mongo_user',
			message: 'MongoDB\'s user:'
		},
		{
			type: 'password',
			name: 'mongo_pass',
			message: 'MongoDB\'s password:'
		},
		{
			type: 'input',
			name: 'redis_host',
			message: 'Redis\'s host:',
			default: 'localhost'
		},
		{
			type: 'input',
			name: 'redis_port',
			message: 'Redis\'s port:',
			default: '6379'
		},
		{
			type: 'password',
			name: 'redis_pass',
			message: 'Redis\'s password:'
		},
		{
			type: 'input',
			name: 'es_host',
			message: 'Elasticsearch\'s host:',
			default: 'localhost'
		},
		{
			type: 'input',
			name: 'es_port',
			message: 'Elasticsearch\'s port:',
			default: '9200'
		},
		{
			type: 'password',
			name: 'es_pass',
			message: 'Elasticsearch\'s password:'
		}
	]);

	const conf: IConfig = {
		maintainer: as.maintainer,
		port: parseInt(as.port, 10),
		internalPort: parseInt(as.internal_port, 10),
		https: {
			enable: as.https,
			key: as.https_key || null,
			cert: as.https_cert || null,
			ca: as.https_ca || null
		},
		webSecret: as.web_secret,
		drive: {
			url: as.drive_url
		},
		mongodb: {
			host: as.mongo_host,
			port: parseInt(as.mongo_port, 10),
			db: as.mongo_db,
			user: as.mongo_user,
			pass: as.mongo_pass
		},
		redis: {
			host: as.redis_host,
			port: parseInt(as.redis_port, 10),
			pass: as.redis_pass
		},
		elasticsearch: {
			host: as.es_host,
			port: parseInt(as.es_port, 10),
			pass: as.es_pass
		}
	};

	console.log('Thanks, writing...');

	try {
		fs.mkdirSync(configDirPath);
		fs.writeFileSync(configPath, yaml.dump(conf));
		console.log('Well done.');
	} catch (e) {
		console.error(e);
	}
};
