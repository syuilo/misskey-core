import load from './load-config';

let conf: IConfig;

try {
	// Load and parse the config
	conf = <IConfig>load();
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
	elasticsearch: {
		host: string;
		port: number;
	};
	drive: {
		url: string;
	};
	apiPass: string;
	port: number;
	bindPort: number;
	bindIp: string;
	https: {
		enable: boolean;
		keyPath: string;
		certPath: string;
	};
	url: string;
}
