import {User} from '../../db/db';
import {IUser} from '../../db/interfaces';
import config from '../../config';

export default (
	user: any,
	me: IUser,
	options?: {
		includeProfileImageIds: boolean
	}
) => new Promise<any>(async (resolve, reject) =>
{
	const opts = options || {
		includeProfileImageIds: false
	};

	if (typeof user === 'string') {
		user = await User.findById(user).lean().exec();
	}

	user.id = user._id;
	delete user._id;
	delete user.__v;

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
