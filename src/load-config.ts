import * as fs from 'fs';
import * as yaml from 'js-yaml';

const configDirPath = `${__dirname}/../.config`;
const configPath = `${configDirPath}/config.yml`;

export default () => yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
