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
