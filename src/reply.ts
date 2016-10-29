import * as express from 'express';

export default (res: express.Response, x?: any, y?: any) => {
	if (x === undefined) {
		res.sendStatus(204);
	} else if (typeof x === 'number') {
		if (x === 500) {
			res.status(500).send(serialize({
				error: 'INTERNAL_ERROR'
			}));
		} else {
			res.status(x).send(serialize({
				error: y
			}));
		}
	} else {
		res.send(serialize(x));
	}
}

function serialize(value: any): any {
	return JSON.stringify(value);
}
