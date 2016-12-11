import * as express from 'express';
import summaly from 'summaly';

module.exports = async (req: express.Request, res: express.Response) => {
	// TODO: Wrap a non-https resources with a proxy
	res.send(await summaly(req.query.url));
};
