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

export default () => {
	// Load and parse the config
	return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
};
