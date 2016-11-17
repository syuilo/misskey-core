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
import config from './config';

/**
 * Init app
 */
const app = express();
app.disable('x-powered-by');

app.use(vhost(`api.${config.host}`, require('./api/server')));
app.use(vhost(`proxy.${config.secondary_host}`, require('./service/forward-proxy/server')));

app.locals.compileDebug = false;
app.locals.cache = true;

/**
 * Initialize requests
 */
app.use((req, res, next) => {
	res.header('X-Frame-Options', 'DENY');
	next();
});

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
//	title: 'Misskey Server Status',
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

app.get('/api:url', require('./service/url-preview').default);
app.post('/api:rss-proxy', require('./service/rss-proxy').default);

// authorize form
app.get('/__/auth/*', (req, res) => {
	res.sendFile(`${__dirname}/web/auth/view.html`, {
		maxAge: ms('7 days')
	});
});

// developer center
app.get('/__/dev/*', (req, res) => {
	res.sendFile(`${__dirname}/web/dev/view.html`, {
		maxAge: ms('7 days')
	});
});

// client
app.get('*', (req, res) => {
	res.sendFile(`${__dirname}/web/client/view.html`, {
		maxAge: ms('7 days')
	});
});

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
require('./api/streaming')(server);
