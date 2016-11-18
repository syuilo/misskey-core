import * as express from 'express';
import * as request from 'request';
const xml2json = require('xml2json');

export default function (req: express.Request, res: express.Response): void {
	const url: string = req.body.url;

	request(url, (err, response, xml) => {
		if (err) {
			console.error(err);
			return;
		}

		res.send(xml2json.toJson(xml));
	});
}
