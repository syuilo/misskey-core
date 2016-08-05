import {logInfo, logDone, logFailed} from 'log-cool';
import * as chalk from 'chalk';
const Git = require('nodegit');
import Indicator from './utils/cli/indicator';
const pkg = require('../package.json');

export default async function(): Promise<boolean> {
	const i = new Indicator('[ WAIT ] Checking for update');

	let remote: any;

	try {
		// Get remote repository
		remote = await Git.Clone(pkg.repository, __dirname + '/../tmp');
	} catch (e) {
		i.end();
		logFailed(`Check for update: ${e}`);
		return null;
	}

	const latest = await remote.getHeadCommit();

	// Get repository info
	const repository = await Git.Repository.open(__dirname + '/../');
	const commit = await repository.getHeadCommit();

	i.end();

	if (latest.sha() !== commit.sha()) {
		logInfo(chalk.yellow(chalk.bold('New version available!') + `(${latest.sha()})`));
		return true;
	} else {
		logDone('Check for update: Up to date');
		return false;
	}
};
