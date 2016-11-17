import * as express from 'express';
import summaly from 'summaly';

export default async function (req: express.Request, res: express.Response): Promise<void> {
	res.send(await summaly(req.query.url));
};
