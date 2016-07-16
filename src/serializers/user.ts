import * as mongo from 'mongodb';
import User from '../models/user';
import config from '../config';

export default (
	user: any,
	me?: any,
	options?: {
		includeProfileImageIds: boolean
	}
) => new Promise<any>(async (resolve, reject) =>
{
	const opts = options || {
		includeProfileImageIds: false
	};

	if (mongo.ObjectID.prototype.isPrototypeOf(user)) {
		user = await User.findOne({_id: user});
	}

	user.id = user._id;
	delete user._id;

	// Remove private properties
	delete user.email;
	delete user.password;

	user.avatar_url = user.avatar !== null
		? `${config.drive.url}/${user.avatar}`
		: `${config.drive.url}/default-avatar.jpg`;

	user.banner_url = user.banner !== null
		? `${config.drive.url}/${user.banner}`
		: `${config.drive.url}/default-banner.jpg`;

	if (!opts.includeProfileImageIds) {
		delete user.avatar;
		delete user.banner;
	}

	resolve(user);
});
