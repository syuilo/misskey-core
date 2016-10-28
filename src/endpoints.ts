const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

interface IEndpoint {
	name: string;
	shouldBeSignin: boolean;
	limitDuration?: number;
	limitMax?: number;
	minInterval?: number;
	withFile?: boolean;
	webOnly?: boolean;
}

export default <IEndpoint[]>[
	{ name: 'meta',   shouldBeSignin: false },
	{ name: 'signin', shouldBeSignin: false, webOnly: true },
	{ name: 'signup', shouldBeSignin: false, webOnly: true },

	{ name: 'username/available', shouldBeSignin: false },

	{ name: 'aggregation/users/post', shouldBeSignin: false },
	{ name: 'aggregation/users/like', shouldBeSignin: false },
	{ name: 'aggregation/users/followers', shouldBeSignin: false },
	{ name: 'aggregation/users/following', shouldBeSignin: false },
	{ name: 'aggregation/posts/like', shouldBeSignin: false },
	{ name: 'aggregation/posts/likes', shouldBeSignin: false },
	{ name: 'aggregation/posts/repost', shouldBeSignin: false },
	{ name: 'aggregation/posts/reply', shouldBeSignin: false },

	{ name: 'i',             shouldBeSignin: true },
	{ name: 'i/update',      shouldBeSignin: true, limitDuration: day, limitMax: 50 },
	{ name: 'i/appdata/get', shouldBeSignin: true },
	{ name: 'i/appdata/set', shouldBeSignin: true },
	{ name: 'i/favorites',   shouldBeSignin: true },

	{ name: 'i/notifications',                  shouldBeSignin: true },
	{ name: 'notifications/delete',           shouldBeSignin: true },
	{ name: 'notifications/delete_all',       shouldBeSignin: true },
	{ name: 'notifications/mark_as_read',     shouldBeSignin: true },
	{ name: 'notifications/mark_as_read_all', shouldBeSignin: true },

	{ name: 'drive',        shouldBeSignin: true },
	{ name: 'drive/stream',        shouldBeSignin: true },
	{ name: 'drive/files',        shouldBeSignin: true },
	{ name: 'drive/files/create',      shouldBeSignin: true, limitDuration: hour, limitMax: 100, withFile: true },
	{ name: 'drive/files/show',        shouldBeSignin: true },
	{ name: 'drive/files/find',        shouldBeSignin: true },
	{ name: 'drive/files/delete',      shouldBeSignin: true },
	{ name: 'drive/files/update',  shouldBeSignin: true },
	{ name: 'drive/folders',           shouldBeSignin: true },
	{ name: 'drive/folders/create',    shouldBeSignin: true, limitDuration: hour, limitMax: 50 },
	{ name: 'drive/folders/show',      shouldBeSignin: true },
	{ name: 'drive/folders/find',        shouldBeSignin: true },
	{ name: 'drive/folders/update',      shouldBeSignin: true },
	{ name: 'drive/tags',               shouldBeSignin: true },
	{ name: 'drive/tags/create',      shouldBeSignin: true, limitDuration: hour, limitMax: 30 },
	{ name: 'drive/tags/update',       shouldBeSignin: true },
	{ name: 'drive/tags/delete',       shouldBeSignin: true },

	{ name: 'users',                    shouldBeSignin: false },
	{ name: 'users/show',               shouldBeSignin: false },
	{ name: 'users/search',             shouldBeSignin: false },
	{ name: 'users/search_by_username', shouldBeSignin: false },
	{ name: 'users/posts',              shouldBeSignin: false },
	{ name: 'users/following',          shouldBeSignin: false },
	{ name: 'users/followers',          shouldBeSignin: false },
	{ name: 'users/recommendation',     shouldBeSignin: true },

	{ name: 'following/create', shouldBeSignin: true, limitDuration: hour, limitMax: 100 },
	{ name: 'following/delete', shouldBeSignin: true, limitDuration: hour, limitMax: 100 },

	{ name: 'posts/show',    shouldBeSignin: false },
	{ name: 'posts/replies', shouldBeSignin: false },
	{ name: 'posts/context', shouldBeSignin: false },
	{ name: 'posts/create',  shouldBeSignin: true, limitDuration: hour, limitMax: 120, minInterval: 3 * second, limitKey: 'post' },
	{ name: 'posts/reposts', shouldBeSignin: false },
	{ name: 'posts/search', shouldBeSignin: false },
	{ name: 'posts/timeline',             shouldBeSignin: true, limitDuration: 10 * minute, limitMax: 100 },
	{ name: 'posts/likes', shouldBeSignin: true },
	{ name: 'posts/likes/create', shouldBeSignin: true, limitDuration: hour, limitMax: 100 },
	{ name: 'posts/likes/delete', shouldBeSignin: true, limitDuration: hour, limitMax: 100 },
	{ name: 'posts/favorites/create', shouldBeSignin: true, limitDuration: hour, limitMax: 100 },
	{ name: 'posts/favorites/delete', shouldBeSignin: true, limitDuration: hour, limitMax: 100 },

	{ name: 'talk/history', shouldBeSignin: true, limitDuration: hour, limitMax: 1000 },
	{ name: 'talk/messages', shouldBeSignin: true, limitDuration: hour, limitMax: 1000 },
	{ name: 'talk/messages/unread/count', shouldBeSignin: true },
	{ name: 'talk/messages/create', shouldBeSignin: true, limitDuration: hour, limitMax: 120, minInterval: second },
	{ name: 'talk/messages/show', shouldBeSignin: true, limitDuration: hour, limitMax: 1000 },
	{ name: 'talk/messages/read', shouldBeSignin: true },
	{ name: 'talk/messages/delete', shouldBeSignin: true, limitDuration: hour, limitMax: 100 },
	{ name: 'talk/group/create', shouldBeSignin: true, limitDuration: day, limitMax: 30 },
	{ name: 'talk/group/show', shouldBeSignin: true },
	{ name: 'talk/group/members/invite', shouldBeSignin: true, limitDuration: day, limitMax: 30 },
	{ name: 'talk/group/invitations/show', shouldBeSignin: true },
	{ name: 'talk/group/invitations/accept', shouldBeSignin: true },
	{ name: 'talk/group/invitations/decline', shouldBeSignin: true },

	{ name: 'hashtags/search', shouldBeSignin: false },
	{ name: 'hashtags/trend/show', shouldBeSignin: false },

	{ name: 'bbs/topics/create', shouldBeSignin: true, limitDuration: day, limitMax: 30 },
	{ name: 'bbs/posts/create', shouldBeSignin: true, limitDuration: hour, limitMax: 120 }
];
