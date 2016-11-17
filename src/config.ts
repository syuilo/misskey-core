import * as fs from 'fs';
import * as yaml from 'js-yaml';

export const configDirPath = `${__dirname}/../.config`;
export const configPath = `${configDirPath}/config.yml`;

// Load and parse the config
const conf = yaml.safeLoad(fs.readFileSync(configPath, 'utf8')) as IConfig & {
	host: string;
};

conf.host = conf.url.substr(conf.url.indexOf('://') + 3);

export default conf;

export interface IConfig {
	maintainer: string;
	url: string;
	port: number;
	https: {
		enable: boolean;
		key: string;
		cert: string;
		ca: string;
	};
	drive: {
		url: string;
	};
	proxy: {
		url: string;
	};
	mongodb: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
	};
	redis: {
		host: string;
		port: number;
		pass: string;
	};
	elasticsearch: {
		host: string;
		port: number;
		pass: string;
	};
	recaptcha: {
		siteKey: string;
		secretKey: string;
	};
}
