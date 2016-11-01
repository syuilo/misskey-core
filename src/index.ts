//////////////////////////////////////////////////
// MISSKEY-CORE ENTORY POINT
//////////////////////////////////////////////////

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 syuilo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

Error.stackTraceLimit = Infinity;

/**
 * Module dependencies
 */
import * as os from 'os';
import * as cluster from 'cluster';
import { logInfo, logDone, logWarn, logFailed } from 'log-cool';
import * as chalk from 'chalk';
import * as del from 'del';
const Git = require('nodegit');
const portUsed = require('tcp-port-used');
import argv from './argv';
import yesno from './utils/cli/yesno';
import ProgressBar from './utils/cli/progressbar';
import config from './load-config';
import configGenerator from './config-generator';
import initdb from './db/mongodb';
import checkDependencies from './check-dependencies';

// Init babel
require('babel-core/register');
require('babel-polyfill');

const env = process.env.NODE_ENV;
global.IS_PRODUCTION = env === 'production';
global.IS_DEBUG = !global.IS_PRODUCTION;

/**
 * Initialize state
 */
enum State {
	success,
	warn,
	failed
}

// Set process title
process.title = 'Misskey Core';

// Start app
main();

/**
 * Init proccess
 */
function main(): void {
	// Master
	if (cluster.isMaster) {
		master();
	} else { // Workers
		worker();
	}
}

/**
 * Init master proccess
 */
async function master(): Promise<void> {
	let state: State;

	try {
		// initialize app
		state = await init();
	} catch (e) {
		console.error(e);
		process.exit(1);
	}

	const res = (t: string, c: string) =>
		console.log(chalk.bold(`--> ${chalk[c](t)}\n`));

	switch (state) {
		case State.failed:
			res('Fatal error occurred :(', 'red');
			process.exit();
			return;
		case State.warn:
			res('Some problem(s) :|', 'yellow');
			break;
		case State.success:
			res('OK :)', 'green');
			break;
	}

	// Spawn workers
	spawn(() => {
		console.log(chalk.bold.green(`\nMisskey Core is now running.`));

		// Listen new workers
		cluster.on('fork', worker => {
			console.log(`Process forked: [${worker.id}]`);
		});

		// Listen online workers
		cluster.on('online', worker => {
			console.log(`Process is now online: [${worker.id}]`);
		});

		// Listen for dying workers
		cluster.on('exit', worker => {
			// Replace the dead worker,
			// we're not sentimental
			console.log(chalk.red(`[${worker.id}] died :(`));
			cluster.fork();
		});
	});
}

/**
 * Init worker proccess
 */
function worker(): void {
	// Init mongo
	initdb(config()).then(db => {
		(global as any).db = db;

		// start server
		require('./server');
	}, err => {
		console.error(err);
		process.exit(0);
	});
}

/**
 * Init app
 */
async function init(): Promise<State> {
	console.log('Welcome to Misskey!\n');

	console.log(chalk.bold('Misskey Core <aoi>'));

	let warn = false;

	// Get repository info
	const repository = await Git.Repository.open(__dirname + '/../');
	const commit = await repository.getHeadCommit();
	console.log(`commit: ${commit.sha()}`);
	console.log(`        ${commit.date()}`);

	console.log('\nInitializing...\n');

	if (IS_DEBUG) {
		logWarn('It is not in the Production mode. Do not use in the Production environment.');
	}

	logInfo(`environment: ${env}`);

	// Get machine info
	const totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
	const freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
	logInfo(`MACHINE: ${os.hostname()}`);
	logInfo(`MACHINE: CPU: ${os.cpus().length}core`);
	logInfo(`MACHINE: MEM: ${totalmem}GB (available: ${freemem}GB)`);

	// Clean
	await del(__dirname + '/../tmp/');

	// Load config
	let conf: any;
	try {
		conf = config();
	} catch (e) {
		if (e.code !== 'ENOENT') {
			logFailed('Failed to load configuration');
			return State.failed;
		}

		logWarn('Config not found');
		if (await yesno('Do you want setup now?', true)) {
			await configGenerator();
			conf = config();
		} else {
			logFailed('Failed to load configuration');
			return State.failed;
		}
	}

	logDone('Success to load configuration');
	logInfo(`maintainer: ${conf.maintainer}`);

	// Check dependencies
	if (!argv.options.hasOwnProperty('skip-check-dependencies')) {
		checkDependencies();
	}

	// Check if a port is being used
	if (await portUsed.check(conf.port)) {
		logFailed(`Port: ${conf.port} is already used!`);
		return State.failed;
	}

	// Try to connect to MongoDB
	try {
		await initdb(conf);
		logDone('Success to connect to MongoDB');
	} catch (e) {
		logFailed(`MongoDB: ${e}`);
		return State.failed;
	}

	return warn ? State.warn : State.success;
}

/**
 * Spawn workers
 */
function spawn(callback: any): void {
	// Count the machine's CPUs
	const cpuCount = os.cpus().length;

	const progress = new ProgressBar(cpuCount, 'Starting workers');

	// Create a worker for each CPU
	for (let i = 0; i < cpuCount; i++) {
		const worker = cluster.fork();
		worker.on('message', (message: any) => {
			if (message === 'listening') {
				progress.increment();
			}
		});
	}

	// On all workers started
	progress.on('complete', () => {
		callback();
	});
}

// Dying away...
process.on('exit', () => {
	console.log('Bye.');
});
