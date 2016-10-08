const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

interface IEndpoint {
	name: string;
	login: boolean;
	limitDuration?: number;
	limitMax?: number;
	minInterval?: number;
	withFile?: boolean;
	webOnly?: boolean;
}

export default <IEndpoint[]>[
	{ name: 'meta',   login: false },
	{ name: 'signin', login: false, webOnly: true },
	{ name: 'signup', login: false, webOnly: true },

	{ name: 'username/available', login: false },

	{ name: 'aggregation/users/posts', login: false },
	{ name: 'aggregation/users/likes', login: false },
	{ name: 'aggregation/users/followers', login: false },
	{ name: 'aggregation/users/following', login: false },
	{ name: 'aggregation/posts/likes', login: false },

	{ name: 'i',             login: true },
	{ name: 'i/update',      login: true, limitDuration: day, limitMax: 50 },
	{ name: 'i/appdata/get', login: true },
	{ name: 'i/appdata/set', login: true },
	{ name: 'i/favorites',   login: true },

	{ name: 'i/notifications',                  login: true },
	{ name: 'notifications/delete',           login: true },
	{ name: 'notifications/delete_all',       login: true },
	{ name: 'notifications/mark_as_read',     login: true },
	{ name: 'notifications/mark_as_read_all', login: true },

	{ name: 'drive',        login: true },
	{ name: 'drive/stream',        login: true },
	{ name: 'drive/files',        login: true },
	{ name: 'drive/files/create',      login: true, limitDuration: hour, limitMax: 100, withFile: true },
	{ name: 'drive/files/show',        login: true },
	{ name: 'drive/files/find',        login: true },
	{ name: 'drive/files/delete',      login: true },
	{ name: 'drive/files/update',  login: true },
	{ name: 'drive/folders',           login: true },
	{ name: 'drive/folders/create',    login: true, limitDuration: hour, limitMax: 50 },
	{ name: 'drive/folders/show',      login: true },
	{ name: 'drive/folders/find',        login: true },
	{ name: 'drive/folders/update',      login: true },
	{ name: 'drive/tags',               login: true },
	{ name: 'drive/tags/create',      login: true, limitDuration: hour, limitMax: 30 },
	{ name: 'drive/tags/update',       login: true },
	{ name: 'drive/tags/delete',       login: true },

	{ name: 'users',                    login: false },
	{ name: 'users/show',               login: false },
	{ name: 'users/search',             login: false },
	{ name: 'users/search_by_username', login: false },
	{ name: 'users/posts',              login: false },
	{ name: 'users/following',          login: false },
	{ name: 'users/followers',          login: false },
	{ name: 'users/recommendation',     login: true },

	{ name: 'following/create', login: true, limitDuration: hour, limitMax: 100 },
	{ name: 'following/delete', login: true, limitDuration: hour, limitMax: 100 },

	{ name: 'posts/show',    login: false },
	{ name: 'posts/replies', login: false },
	{ name: 'posts/context', login: false },
	{ name: 'posts/create',  login: true, limitDuration: hour, limitMax: 120, minInterval: 3 * second, limitKey: 'post' },
	{ name: 'posts/reposts', login: false },
	{ name: 'posts/search', login: false },
	{ name: 'posts/timeline',             login: true, limitDuration: 10 * minute, limitMax: 100 },
	{ name: 'posts/likes', login: true },
	{ name: 'posts/likes/create', login: true, limitDuration: hour, limitMax: 100 },
	{ name: 'posts/likes/delete', login: true, limitDuration: hour, limitMax: 100 },
	{ name: 'posts/favorites/create', login: true, limitDuration: hour, limitMax: 100 },
	{ name: 'posts/favorites/delete', login: true, limitDuration: hour, limitMax: 100 },

	{ name: 'talk/history', login: true, limitDuration: hour, limitMax: 1000 },
	{ name: 'talk/messages', login: true, limitDuration: hour, limitMax: 1000 },
	{ name: 'talk/messages/unread/count', login: true },
	{ name: 'talk/messages/create', login: true, limitDuration: hour, limitMax: 120, minInterval: second },
	{ name: 'talk/messages/show', login: true, limitDuration: hour, limitMax: 1000 },
	{ name: 'talk/messages/read', login: true },
	{ name: 'talk/messages/delete', login: true, limitDuration: hour, limitMax: 100 },
	{ name: 'talk/group/create', login: true, limitDuration: day, limitMax: 30 },
	{ name: 'talk/group/show', login: true },
	{ name: 'talk/group/members/invite', login: true, limitDuration: day, limitMax: 30 },
	{ name: 'talk/group/invitations/show', login: true },
	{ name: 'talk/group/invitations/accept', login: true },
	{ name: 'talk/group/invitations/decline', login: true },

	{ name: 'hashtags/search', login: false },
	{ name: 'hashtags/trend/show', login: false },

	{ name: 'bbs/topics/create', login: true, limitDuration: day, limitMax: 30 },
	{ name: 'bbs/posts/create', login: true, limitDuration: hour, limitMax: 120 }
];
