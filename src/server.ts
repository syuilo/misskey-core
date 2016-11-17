/**
 * Core Server
 */

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

// express modules
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as favicon from 'serve-favicon';
import * as compression from 'compression';
const vhost = require('vhost');
const subdomain = require('subdomain');

import manifest from './utils/manifest';
import appleTouchIcon from './utils/apple-touch-icon';

// utility module
import * as ms from 'ms';

// internal modules
import router from './router';
import api from './api-server';
import streaming from './streaming';

import config from './config';

/**
 * Init app
 */
const app = express();
app.disable('x-powered-by');

/**
 * Initialize requests
 */
app.use((req, res, next) => {
	res.header('X-Frame-Options', 'DENY');
	next();
});

app.use(vhost(`api.${config.host}`, api));

app.locals.compileDebug = false;
app.locals.cache = true;

/**
 * Compressions
 */
app.use(compression());

/**
 * Statics
 */
app.use(favicon(`${__dirname}/resources/favicon.ico`));
app.use(manifest);
app.use(appleTouchIcon);
app.use('/_/resources', express.static(`${__dirname}/web/resources`, {
	maxAge: ms('7 days')
}));

/**
 * Server status
 */
//app.use(require('express-status-monitor')({
//	title: 'Misskey Web Status',
//	path: '/__/about/status'
//}));

/**
 * Basic parsers
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Subdomain
 */
app.use(subdomain({
	base: config.host,
	prefix: '__'
}));

/**
 * Routing
 */
app.use(router);

/**
 * Create server
 */
const server = config.https.enable ?
	https.createServer({
		key: fs.readFileSync(config.https.key),
		cert: fs.readFileSync(config.https.cert),
		ca: fs.readFileSync(config.https.ca)
	}, app) :
	http.createServer(app);

/**
 * Server listen
 */
server.listen(config.port, () => {
	process.send('listening');
});

/**
 * Steaming
 */
streaming(server);
