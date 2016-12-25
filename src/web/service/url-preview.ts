import * as express from 'express';
import summaly from 'summaly';
import config from '../../config';

module.exports = async (req: express.Request, res: express.Response) => {
	const summary = await summaly(req.query.url);
	summary.icon = wrap(summary.icon);
	summary.thumbnail = wrap(summary.thumbnail);
	res.send(summary);
};

function wrap(url: string): string {
	return `${config.proxy_url}/${url}`;
}
