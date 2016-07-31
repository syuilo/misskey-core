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
import {logInfo, logDone, logWarn, logFailed} from 'log-cool';
const Git = require('nodegit');
const portUsed = require('tcp-port-used');
import argv from './argv';
import yesno from './utils/yesno';
import config from './load-config';
import configGenerator from './config-generator';
import initdb from './db/mongodb';
import checkDependencies from './check-dependencies';

// Init babel
require('babel-core/register');
require('babel-polyfill');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isDebug = !isProduction;

// Master
if (cluster.isMaster) {
	master().then(status => {
		if (status === 1) {
			console.error('there was a problem starting');
			process.exit();
		} else {
			logDone('OK');
		}
	});
}
// Workers
else {
	// Init mongo
	initdb(config()).then(db => {
		(<any>global).db = db;
		worker();
	});
}

/**
 * Init master proccess
 */
async function master(): Promise<any> {
	console.log('Welcome to Misskey!');

	// Get repository info
	const repository = await Git.Repository.open(__dirname + '/../');
	console.log(`commit: ${(await repository.getHeadCommit()).sha()}`);

	if (isDebug) {
		logWarn('Productionモードではありません。本番環境で使用しないでください。');
	}

	logInfo(`environment: ${env}`);

	const totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
	const freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
	logInfo(`MACHINE: ${os.hostname()}`);
	logInfo(`MACHINE: CPU: ${os.cpus().length}core`);
	logInfo(`MACHINE: MEM: ${totalmem}GB (available: ${freemem}GB)`);

	// Load config
	let conf: any;
	try {
		conf = config();
	} catch (e) {
		if (e.code !== 'ENOENT') {
			logFailed('Failed to load configuration');
			return 1;
		}

		logWarn('Config not found');
		if (await yesno('Do you want setup now?', true)) {
			await configGenerator();
			conf = config();
		} else {
			logFailed('Failed to load configuration');
			return 1;
		}
	}

	logDone('Success to load configuration');
	logInfo(`maintainer: ${conf.maintainer}`);

	if (!argv.options.hasOwnProperty('skip-check-dependencies')) {
		checkDependencies();
	}

	// Check if a port is being used
	if (await portUsed.check(conf.port, '127.0.0.1')) {
		logFailed(`Port: ${conf.port} is already used!`);
		return 1;
	}

	// Try to connect to MongoDB
	try {
		await initdb(conf);
		logDone('Success to connect to MongoDB');
	} catch (e) {
		logFailed(`MongoDB: ${e}`);
		return 1;
	}

	// Count the machine's CPUs
	const cpuCount = os.cpus().length;

	// Create a worker for each CPU
	for (let i = 0; i < cpuCount; i++) {
		cluster.fork();
	}
}

/**
 * Init worker proccess
 */
function worker(): void {
	require('./server');
}

// Listen new workers
cluster.on('fork', worker => {
	console.log(`Process forked: ${worker.id}`);
});

// Listen online workers
cluster.on('online', worker => {
	console.log(`Process is now online: ${worker.id}`);
});

// Listen for dying workers
cluster.on('exit', worker => {
	// Replace the dead worker,
	// we're not sentimental
	console.log(`\u001b[1;31m[${worker.id}] died :(\u001b[0m`);
	cluster.fork();
});

// Dying away...
process.on('exit', () => {
	console.log('Bye.');
});
