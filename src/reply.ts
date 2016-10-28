import * as express from 'express';

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isDebug = !isProduction;

export default (res: express.Response, x?: any, y?: any) => {
	if (x === undefined) {
		res.sendStatus(204);
	} else if (typeof x === 'number') {
		if (x === 500) {
			res.status(500).send({
				error: 'INTERNAL_ERROR'
			});

			if (isDebug) {
				console.log('REP: ERROR: INTERNAL');
			}
		} else {
			res.status(x).send({
				error: y
			});

			if (isDebug) {
				console.log(`REP: ERROR: ${x} ${y}`);
			}
		}
	} else {
		res.send(x);

		if (isDebug) {
			console.log(`REP: OK: 200 ${JSON.stringify(x)}`);
		}
	}
}
