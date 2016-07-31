import * as fs from 'fs';
import * as yaml from 'js-yaml';
import {configPath} from './meta';

export default () => yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
