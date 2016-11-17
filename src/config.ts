import * as fs from 'fs';
import * as yaml from 'js-yaml';

export const configDirPath = `${__dirname}/../.config`;
export const configPath = `${configDirPath}/config.yml`;

let config: IConfig;

try {
	config = yaml.safeLoad(fs.readFileSync(configPath, 'utf8')) as IConfig;
} catch (e) {
	// nope
}

export default Object.assign(config || {}, {
	host: config ? config.url.substr(config.url.indexOf('://') + 3) : undefined,
	scheme: config ? config.url.substr(0, config.url.indexOf('://')) : undefined,
	secondary_host: config ? config.secondary_url.substr(config.secondary_url.indexOf('://') + 3) : undefined,
	secondary_scheme: config ? config.secondary_url.substr(0, config.secondary_url.indexOf('://')) : undefined
}) as IConfig & {
	host: string;
	scheme: string;
	secondary_host: string;
	secondary_scheme: string;
};

export interface IConfig {
	maintainer: string;
	url: string;
	secondary_url: string;
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
