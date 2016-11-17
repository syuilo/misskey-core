import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as inquirer from 'inquirer';
import {IConfig} from './iconfig';
import {configPath, configDirPath} from './meta';

export default async function(): Promise<void> {
	const as: any = await inquirer.prompt([
		{
			type: 'input',
			name: 'maintainer',
			message: 'Maintainer name(and email address):'
		},
		{
			type: 'input',
			name: 'url',
			message: 'WWW URL:'
		},
		{
			type: 'input',
			name: 'port',
			message: 'Listen port:'
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
			when: (ctx: any) => ctx.https
		},
		{
			type: 'input',
			name: 'https_cert',
			message: 'Path of tls cert:',
			when: (ctx: any) => ctx.https
		},
		{
			type: 'input',
			name: 'https_ca',
			message: 'Path of tls ca:',
			when: (ctx: any) => ctx.https
		},
		{
			type: 'input',
			name: 'drive_url',
			message: 'Drive(misskey-file server)\'s url:'
		},
		{
			type: 'input',
			name: 'proxy_url',
			message: 'Proxy URL:'
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
		},
		{
			type: 'input',
			name: 'recaptcha_site',
			message: 'reCAPTCHA\'s site key:'
		},
		{
			type: 'input',
			name: 'recaptcha_secret',
			message: 'reCAPTCHA\'s secret key:'
		}
	]);

	const conf: IConfig = {
		maintainer: as.maintainer,
		url: as.url,
		port: parseInt(as.port, 10),
		https: {
			enable: as.https,
			key: as.https_key || null,
			cert: as.https_cert || null,
			ca: as.https_ca || null
		},
		drive: {
			url: as.drive_url
		},
		proxy: {
			url: as.proxy_url
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
		},
		recaptcha: {
			siteKey: as.recaptcha_site,
			secretKey: as.recaptcha_secret
		}
	};

	console.log('Thanks. Writing the configuration to a file...');

	try {
		fs.mkdirSync(configDirPath);
		fs.writeFileSync(configPath, yaml.dump(conf));
		console.log('Well done.');
	} catch (e) {
		console.error(e);
	}
};
