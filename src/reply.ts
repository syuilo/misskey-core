import * as express from 'express';

export default (res: express.Response, x?: any, y?: any) => {
	if (x === undefined) {
		res.sendStatus(204);
	} else if (typeof x === 'number') {
		if (x === 500) {
			res.status(500).send({
				error: 'INTERNAL_ERROR'
			});

			if (IS_DEBUG) {
				console.log('REP: ERROR: INTERNAL');
			}
		} else {
			res.status(x).send({
				error: y
			});

			if (IS_DEBUG) {
				console.log(`REP: ERROR: ${x} ${y}`);
			}
		}
	} else {
		res.send(x);

		if (IS_DEBUG) {
			console.log(`REP: OK: 200 ${JSON.stringify(x)}`);
		}
	}
}
