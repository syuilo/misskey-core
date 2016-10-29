'use strict';

/**
 * Module dependencies
 */
import User from '../../models/user';
import Following from '../../models/following';
import serialize from '../../serializers/user';

/**
 * Get recommended users
 *
 * @param {Object} params
 * @param {Object} me
 * @return {Promise<object>}
 */
module.exports = (params, me) =>
	new Promise(async (res, rej) =>
{
	// Init 'limit' parameter
	let limit = params.limit;
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		// 1 ~ 100 まで
		if (!(1 <= limit && limit <= 100)) {
			return rej('invalid limit range');
		}
	} else {
		limit = 10;
	}

	// Init 'offset' parameter
	let offset = params.offset;
	if (offset !== undefined && offset !== null) {
		offset = parseInt(offset, 10);
	} else {
		offset = 0;
	}

	// 自分がフォローしているユーザーの関係を取得
	// SELECT followee
	const following = await Following
		.find({
			follower: me._id,
			deleted_at: { $exists: false }
		}, { followee: true })
		.toArray();

	// 自分と自分がフォローしているユーザーのIDのリストを生成
	const followingIds = following.length !== 0
		? [...following.map(follow => follow.followee), me._id]
		: [me._id];

	const users = await User
		.find({
			_id: {
				$nin: followingIds
			}
		}, {}, {
			limit: limit,
			skip: offset,
			sort: {
				followers_count: -1
			}
		})
		.toArray();

	if (users.length === 0) {
		return res([]);
	}

	// serialize
	res(await Promise.all(users.map(async user =>
		await serialize(user, me))));
});
