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

const mixin: Mixin = {} as Mixin;

if (config) {
	config.url = normalizeUrl(config.url);
	config.secondary_url = normalizeUrl(config.secondary_url);

	mixin.host = config.url.substr(config.url.indexOf('://') + 3);
	mixin.scheme = config.url.substr(0, config.url.indexOf('://'));
	mixin.secondary_host = config.secondary_url.substr(config.secondary_url.indexOf('://') + 3);
	mixin.secondary_scheme = config.secondary_url.substr(0, config.secondary_url.indexOf('://'));
	mixin.drive_url = mixin.secondary_scheme + '://file.' + mixin.secondary_host;
}

export default Object.assign(config || {}, mixin) as IConfig & Mixin;

function normalizeUrl(url: string): string {
	return url[url.length - 1] === '/' ? url.substr(0, url.length - 1) : url;
}

interface Mixin {
	host: string;
	scheme: string;
	secondary_host: string;
	secondary_scheme: string;
	drive_url: string;
}

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
