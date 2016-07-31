import {IConfig} from './iconfig';
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
