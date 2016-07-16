//////////////////////////////////////////////////
// CONFIGURATION MANAGER
//////////////////////////////////////////////////

import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Detect home path
const home = process.env[
	process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

// Name of directory that includes config file
const dirName = '.misskey-core';

// Name of config file
const fileName = 'config.yml';

// Resolve paths
const dirPath = `${home}/${dirName}`;
const path = `${dirPath}/${fileName}`;

let conf: IConfig;

try {
	// Load and parse the config
	conf = <IConfig>yaml.safeLoad(fs.readFileSync(path, 'utf8'));
	console.log('Loaded config');
} catch (e) {
	console.error('Failed to load config: ' + e);
	process.exit(1);
}

export default conf;

export interface IConfig {
	maintainer: string;
	mongo: {
		uri: string;
		options: {
			user: string;
			pass: string;
		}
	};
	redis: {
		host: string;
		port: number;
		password: string;
	};
	drive: {
		url: string;
	};
	apiPass: string;
	port: {
		internal: number;
		http: number;
		https: number;
	};
	bindPorts: {
		internal: number;
		http: number;
		https: number;
	};
	bindIp: string;
	https: {
		enable: boolean;
		keyPath: string;
		certPath: string;
	};
	url: string;
}
