import Following from '../models/following';

export default (meId: string, otherpartyId: string) =>
	new Promise<boolean>((resolve, reject) =>
{
	Following
	.count({
		followee: otherpartyId,
		follower: meId
	})
	.limit(1)
	.exec((err, exist) => {
		if (err) {
			reject(err);
		} else {
			resolve(exist === 1);
		}
	});
});
