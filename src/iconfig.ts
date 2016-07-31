export interface IConfig {
	maintainer: string;
	webSecret: string;
	port: number;
	bindIp: string;
	https: {
		enable: boolean;
		key: string;
		cert: string;
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
}
