/**
 * Core Server
 */

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

import * as ms from 'ms';

// express modules
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as favicon from 'serve-favicon';
import * as compression from 'compression';
//import * as accesses from 'accesses';
const vhost = require('vhost');
const subdomain = require('subdomain');

import web from './utils/serve-web-html';
import manifest from './utils/manifest';
import appleTouchIcon from './utils/apple-touch-icon';

import config from './config';

/**
 * Init app
 */
const app = express();
app.disable('x-powered-by');

//app.use(accesses.express());

/**
 * Register subdomains
 */
app.use(vhost(`api.${config.host}`, require('./api/server')));
app.use(vhost(config.secondary_host, require('./service/himasaku/server')));
app.use(vhost(`file.${config.secondary_host}`, require('./file/server')));
app.use(vhost(`proxy.${config.secondary_host}`, require('./service/forward-proxy/server')));

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
 * Static resources
 */
app.use(favicon(`${__dirname}/../resources/favicon.ico`));
app.use(manifest);
app.use(appleTouchIcon);
app.use('/_/resources', express.static(`${__dirname}/web/resources`, {
	maxAge: ms('7 days')
}));

app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Subdomain
 */
app.use(subdomain({
	base: config.host,
	prefix: '@'
}));

/**
 * Routing
 */
app.get('/api:url',  require('./service/url-preview'));
app.post('/api:rss', require('./service/rss-proxy'));
app.get('/@/auth/*', web('auth')); // authorize form
app.get('/@/dev/*',  web('dev')); // developer center
app.get('*',         web('client')); // client

/**
 * Create server
 */
const server = config.https.enable ?
	https.createServer({
		key:  fs.readFileSync(config.https.key),
		cert: fs.readFileSync(config.https.cert),
		ca:   fs.readFileSync(config.https.ca)
	}, app) :
	http.createServer(app);

/**
 * Server listen
 */
server.listen(config.port, () => {
	process.send('ready');
});

/**
 * Steaming
 */
require('./api/streaming')(server);
