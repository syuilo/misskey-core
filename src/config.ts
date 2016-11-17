import { IConfig } from './iconfig';
import load from './load-config';

// Load and parse the config
const conf = load() as IConfig & {
	host: string;
};

conf.host = conf.url.substr(conf.url.indexOf('://') + 3);

export default conf;
