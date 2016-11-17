import * as express from 'express';
import summaly from 'summaly';

export default async function (req: express.Request, res: express.Response): Promise<void> {
	// TODO: Wrap a non-https resources with a proxy
	res.send(await summaly(req.query.url));
};
