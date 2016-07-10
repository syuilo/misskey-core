import User from '../models/user';

export default function(text: string): Promise<any[]> {
	if (text === null) {
		return Promise.resolve(null);
	}

	const mentions = text.match(/@[a-zA-Z0-9\-]+/g);

	if (mentions === null) {
		return Promise.resolve(null);
	}

	return Promise.all(mentions.map(mention => new Promise<any>((resolve, reject) => {
		const sn = mention.replace('@', '');
		User.findOne({username: sn}, (err, user) => {
			if (err !== null) {
				reject(err);
			} else {
				resolve(user);
			}
		});
	})));
}
