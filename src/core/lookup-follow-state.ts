import {UserFollowing} from '../db/db';
import {IUserFollowing} from '../db/interfaces';

export default function(meId: string, otherpartyId: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		UserFollowing.findOne({
			followee: otherpartyId,
			follower: meId
		}, (followingFindErr: any, userFollowing: IUserFollowing) => {
			if (followingFindErr !== null) {
				reject(followingFindErr);
			} else {
				resolve(userFollowing !== null);
			}
		});
	});
}
