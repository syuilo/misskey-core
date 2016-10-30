const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

export interface IEndpoint {
	name: string;
	shouldBeSignin: boolean;
	limitKey?: string;
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

	{ name: 'my/apps',            shouldBeSignin: true },

	{ name: 'app/create',            shouldBeSignin: true, limitDuration: day, limitMax: 2 },
	{ name: 'app/name_id/available', shouldBeSignin: false },

	{ name: 'auth/gen_session_token', shouldBeSignin: false },

	{ name: 'aggregation/users/post',      shouldBeSignin: false },
	{ name: 'aggregation/users/like',      shouldBeSignin: false },
	{ name: 'aggregation/users/followers', shouldBeSignin: false },
	{ name: 'aggregation/users/following', shouldBeSignin: false },
	{ name: 'aggregation/posts/like',      shouldBeSignin: false },
	{ name: 'aggregation/posts/likes',     shouldBeSignin: false },
	{ name: 'aggregation/posts/repost',    shouldBeSignin: false },
	{ name: 'aggregation/posts/reply',     shouldBeSignin: false },

	{ name: 'i',             shouldBeSignin: true },
	{ name: 'i/update',      shouldBeSignin: true, limitDuration: day, limitMax: 50 },
	{ name: 'i/appdata/get', shouldBeSignin: true },
	{ name: 'i/appdata/set', shouldBeSignin: true },

	{ name: 'i/notifications',                shouldBeSignin: true },
	{ name: 'notifications/delete',           shouldBeSignin: true },
	{ name: 'notifications/delete_all',       shouldBeSignin: true },
	{ name: 'notifications/mark_as_read',     shouldBeSignin: true },
	{ name: 'notifications/mark_as_read_all', shouldBeSignin: true },

	{ name: 'drive',                shouldBeSignin: true },
	{ name: 'drive/stream',         shouldBeSignin: true },
	{ name: 'drive/files',          shouldBeSignin: true },
	{ name: 'drive/files/create',   shouldBeSignin: true, limitDuration: hour, limitMax: 100, withFile: true },
	{ name: 'drive/files/show',     shouldBeSignin: true },
	{ name: 'drive/files/find',     shouldBeSignin: true },
	{ name: 'drive/files/delete',   shouldBeSignin: true },
	{ name: 'drive/files/update',   shouldBeSignin: true },
	{ name: 'drive/folders',        shouldBeSignin: true },
	{ name: 'drive/folders/create', shouldBeSignin: true, limitDuration: hour, limitMax: 50 },
	{ name: 'drive/folders/show',   shouldBeSignin: true },
	{ name: 'drive/folders/find',   shouldBeSignin: true },
	{ name: 'drive/folders/update', shouldBeSignin: true },

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

	{ name: 'posts/show',             shouldBeSignin: false },
	{ name: 'posts/replies',          shouldBeSignin: false },
	{ name: 'posts/context',          shouldBeSignin: false },
	{ name: 'posts/create',           shouldBeSignin: true, limitDuration: hour, limitMax: 120, minInterval: 3 * second },
	{ name: 'posts/reposts',          shouldBeSignin: false },
	{ name: 'posts/search',           shouldBeSignin: false },
	{ name: 'posts/timeline',         shouldBeSignin: true, limitDuration: 10 * minute, limitMax: 100 },
	{ name: 'posts/likes',            shouldBeSignin: true },
	{ name: 'posts/likes/create',     shouldBeSignin: true, limitDuration: hour, limitMax: 100 },
	{ name: 'posts/likes/delete',     shouldBeSignin: true, limitDuration: hour, limitMax: 100 },
	{ name: 'posts/favorites/create', shouldBeSignin: true, limitDuration: hour, limitMax: 100 },
	{ name: 'posts/favorites/delete', shouldBeSignin: true, limitDuration: hour, limitMax: 100 }

];
