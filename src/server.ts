//////////////////////////////////////////////////
// API SERVER
//////////////////////////////////////////////////

import * as cluster from 'cluster';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as favicon from 'serve-favicon';
import * as cors from 'cors';
import * as multer from 'multer';
import * as accesses from 'accesses';

import config from './config';
import endpoints from './endpoints';

const worker = cluster.worker;

console.log(`Init ${worker.id} server...`);

//////////////////////////////////////////////////
// INIT SERVER

const upload = multer({ dest: 'uploads/' });

const app = express();
app.disable('x-powered-by');
app.locals.compileDebug = false;
app.locals.cache = true;
app.set('view engine', 'pug');
app.set('views', __dirname + '/web/');

app.use(accesses.express());
app.use(favicon(`${__dirname}/resources/favicon.ico`));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static resources
app.use('/resources', express.static(__dirname + '/resources'));

// CORS
app.use(cors());

app.get('/', (req, res) => {
	res.render('index');
});

// Register REST API handlers
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

//////////////////////////////////////////////////
// LISTEN

let server: http.Server | https.Server;
let port: number;

if (config.https.enable) {
	port = config.bindPorts.https;
	server = https.createServer({
		key: fs.readFileSync(config.https.keyPath),
		cert: fs.readFileSync(config.https.certPath)
	}, app);

	// 非TLSはリダイレクト
	http.createServer((req, res) => {
		res.writeHead(301, {
			Location: config.url + req.url
		});
		res.end();
	}).listen(config.bindPorts.http);
} else {
	port = config.bindPorts.http;
	server = http.createServer(app);
}

server.listen(port, config.bindIp, () => {
	const listenhost = server.address().address;
	const listenport = server.address().port;

	console.log(
		`\u001b[1;32m${worker.id} is now listening at ${listenhost}:${listenport}\u001b[0m`);
});
