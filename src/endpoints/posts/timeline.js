import Post from '../../models/post';
import serialize from '../../serializers/post';

export default (params, res, app, user) =>
{
	let limit = params.limit;

	// Init 'text' parameter
	if (limit !== undefined && limit !== null) {
		limit = parseInt(limit, 10);

		if (limit < 1) {
			return res(400, 'invalid-limit-range');
		} else if (limit > 100) {
			return res(400, 'invalid-limit-range');
		}
	} else {
		limit = 10;
	}

	let sinceId = params['since-id'] || null;
	let maxId = params['max-id'] || null;

	// 自分がフォローしているユーザーの関係を取得
	UserFollowing
	.find({follower: user.id})
	.lean()
	.exec((followingFindErr, following) => {
		if (followingFindErr) {
			return res(500, followingFindErr);
		}

		// 自分と自分がフォローしているユーザーのIDのリストを生成
		const followingIds = following.length !== 0
			? [...following.map(follow => follow.followee), user.id]
			: [user.id];

		// タイムライン取得用のクエリを生成
		const sort = {created_at: -1};
		const query = {
			user: { $in: followingIds }
		};
		if (sinceId !== null) {
			sort.created_at = 1;
			query.cursor = {$gt: sinceId};
		} else if (maxId !== null) {
			query.cursor = {$lt: maxId};
		}

		// クエリを発行してタイムラインを取得
		Post
		.find(query)
		.sort(sort)
		.limit(limit)
		.lean()
		.exec((err, timeline) => {
			if (err) {
				return res(500, err);
			} else if (timeline.length === 0) {
				return res([]);
			}

			// send
			res(timeline.map(async (post) => {
				return await serialize(post);
			}));
		});
	});
};
