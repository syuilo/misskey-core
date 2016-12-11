/**
 * Web Server
 */

import * as ms from 'ms';

// express modules
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as favicon from 'serve-favicon';
import * as compression from 'compression';
const subdomain = require('subdomain');
import client from './serve-client';

import config from '../config';

/**
 * Init app
 */
const app = express();
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

/**
 * Initialize requests
 */
app.use((req, res, next) => {
	res.header('X-Frame-Options', 'DENY');
	next();
});

/**
 * Static resources
 */
app.use(favicon(`${__dirname}/../../resources/favicon.ico`));
app.use(require('./manifest'));
app.use(require('./apple-touch-icon'));
app.use('/_/resources', express.static(`${__dirname}/client/resources`, {
	maxAge: ms('7 days')
}));

/**
 * Common API
 */
app.get('/meta',     require('./meta'));
app.get('/api:url',  require('./service/url-preview'));
app.post('/api:rss', require('./service/rss-proxy'));

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
app.get('/@/auth/*', client('auth')); // authorize form
app.get('/@/dev/*',  client('dev')); // developer center
app.get('*',         client('client')); // client

module.exports = app;
