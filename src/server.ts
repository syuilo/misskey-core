//////////////////////////////////////////////////
// API SERVER
//////////////////////////////////////////////////

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as favicon from 'serve-favicon';
import * as cors from 'cors';
import * as multer from 'multer';

import config from './config';
import endpoints from './endpoints';
import streaming from './streaming';

/**
 * Init app
 */
const app = express();

app.disable('x-powered-by');

app.locals.compileDebug = false;
app.locals.cache = false;

app.set('etag', false);
app.set('view engine', 'pug');
app.set('views', __dirname + '/web/');

app.use(bodyParser.urlencoded({ extended: true }));

/**
 * CORS
 */
app.use(cors());

/**
 * Statics
 */
app.use(favicon(`${__dirname}/resources/favicon.ico`));
app.use('/resources', express.static(__dirname + '/resources'));

/**
 * Routing
 */
app.get('/', (req, res) => {
	res.render('index');
});

app.get('/authorize/:token', require('./web/auth').default);
app.post('/authorize', require('./endpoints/auth/authorize').default);

app.get('/:endpoint([a-z_\/]+)', (req, res) => {
	res.render(`docs/${req.params.endpoint}`);
});

const upload = multer({ dest: 'uploads/' });
endpoints.forEach(endpoint => {
	if (endpoint.withFile) {
		app.post('/' + endpoint.name, upload.single('file'), handler);
	} else {
		app.post('/' + endpoint.name, handler);
	}

	function handler(req: express.Request, res: express.Response): void {
		require('./api-handler').default(endpoint, req, res);
	}
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
streaming(server);
