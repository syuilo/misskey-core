/**
 * Routes
 */

import * as express from 'express';
import * as ms from 'ms';

import config from './config';

const subdomainPrefix = '__';

const signupDomain = `/${subdomainPrefix}/signup`;
const signinDomain = `/${subdomainPrefix}/signin`;
const signoutDomain = `/${subdomainPrefix}/signout`;
const authDomain = `/${subdomainPrefix}/auth`;
const devDomain = `/${subdomainPrefix}/dev`;

const router = express.Router();

router.post(`${signupDomain}/`, require('./core/signup').default);
router.post(`${signinDomain}/`, require('./core/signin').default);

router.get(`${signoutDomain}/`, (req, res) => {
	if (res.locals.signin) {
		res.clearCookie('i', {
			path: '/',
			domain: `.${config.host}`
		});
	}
	res.redirect(config.url);
});

/**
 * API handlers
 */
router.get('/_/api/url', require('./web-util/url').default);
router.post('/_/api/rss-proxy', require('./web-util/rss-proxy').default);

router.get(`${authDomain}/`, (req, res) => {
	res.redirect(config.url);
});

router.get(`${authDomain}/*`, (req, res) => {
	res.sendFile(`${__dirname}/web/auth/view.html`, {
		maxAge: ms('7 days')
	});
});

router.get(`${devDomain}/*`, (req, res) => {
	res.sendFile(`${__dirname}/web/dev/view.html`, {
		maxAge: ms('7 days')
	});
});

router.get('*', (req, res) => {
	res.sendFile(`${__dirname}/web/client.html`, {
		maxAge: ms('7 days')
	});
});

export default router;
