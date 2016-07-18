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
}

export default <IEndpoint[]>[
	{ name: 'meta',   login: false },
	{ name: 'signin', login: false },
	{ name: 'signup', login: false },

	{ name: 'username/available', login: false },

	{ name: 'i',                      login: true },
	{ name: 'i/update',               login: true, limitDuration: day, limitMax: 50 },
	{ name: 'i/timeline',             login: true, limitDuration: 10 * minute, limitMax: 100 },
	{ name: 'i/notifications',        login: true },
	{ name: 'i/notifications/delete', login: true },
	{ name: 'i/notifications/clear',  login: true },
	{ name: 'i/drive/files/create',      login: true, limitDuration: hour, limitMax: 100, withFile: true },
	{ name: 'i/drive/files/show',        login: true },
	{ name: 'i/drive/files',        login: true },
	{ name: 'i/drive/files/delete',      login: true },
	{ name: 'i/drive/files/update',  login: true },
	{ name: 'i/drive/folders/create',    login: true, limitDuration: hour, limitMax: 50 },
	{ name: 'i/drive/folders',           login: true },
	{ name: 'i/drive/folders/show',      login: true },
	{ name: 'i/drive/folders/move',      login: true },
	{ name: 'i/drive/folders/rename',    login: true },
	{ name: 'i/drive/tags',               login: true },
	{ name: 'i/drive/tags/create',      login: true, limitDuration: hour, limitMax: 30 },
	{ name: 'i/drive/tags/update',       login: true },
	{ name: 'i/drive/tags/delete',       login: true },

	{ name: 'users/show',      login: false },
	{ name: 'users/posts',     login: false },
	{ name: 'users/following', login: false },
	{ name: 'users/followers', login: false },

	{ name: 'following/create', login: true, limitDuration: hour, limitMax: 100  },
	{ name: 'following/delete', login: true, limitDuration: hour, limitMax: 100 },

	{ name: 'posts/show',    login: false },
	{ name: 'posts/replies', login: false },
	{ name: 'posts/create',  login: true, limitDuration: hour, limitMax: 120, minInterval: 3 * second, limitKey: 'post' },
	{ name: 'posts/repost',  login: true, limitDuration: hour, limitMax: 120, minInterval: 0.5 * second, limitKey: 'post' },
	{ name: 'posts/reposts', login: false },

	{ name: 'talks/history/show', login: true, limitDuration: hour, limitMax: 1000 },
	{ name: 'talks/messages/unread/count', login: true },
	{ name: 'talks/messages/say', login: true, limitDuration: hour, limitMax: 120, minInterval: second },
	{ name: 'talks/messages/show', login: true, limitDuration: hour, limitMax: 1000 },
	{ name: 'talks/messages/read', login: true },
	{ name: 'talks/messages/stream', login: true, limitDuration: hour, limitMax: 1000 },
	{ name: 'talks/messages/delete', login: true, limitDuration: hour, limitMax: 100 },
	{ name: 'talks/group/create', login: true, limitDuration: day, limitMax: 30 },
	{ name: 'talks/group/show', login: true },
	{ name: 'talks/group/members/invite', login: true, limitDuration: day, limitMax: 30 },
	{ name: 'talks/group/invitations/show', login: true },
	{ name: 'talks/group/invitations/accept', login: true },
	{ name: 'talks/group/invitations/decline', login: true },

	{ name: 'hashtags/search', login: false },
	{ name: 'hashtags/trend/show', login: false },

	{ name: 'bbs/topics/create', login: true, limitDuration: day, limitMax: 30 },
	{ name: 'bbs/posts/create', login: true, limitDuration: hour, limitMax: 120 }
];
