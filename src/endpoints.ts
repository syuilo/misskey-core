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
	{ name: 'login', login: false },

	{ name: 'screenname/available', login: false },

	{ name: 'account/create',          login: false },
	{ name: 'account/show',            login: true },
	{ name: 'account/name/update',     login: true, limitDuration: day, limitMax: 50 },
	{ name: 'account/url/update',      login: true, limitDuration: day, limitMax: 50 },
	{ name: 'account/avatar/update',   login: true, limitDuration: day, limitMax: 50 },
	{ name: 'account/banner/update',   login: true, limitDuration: day, limitMax: 50 },
	{ name: 'account/comment/update',  login: true, limitDuration: day, limitMax: 50 },
	{ name: 'account/location/update', login: true, limitDuration: day, limitMax: 50 },
	{ name: 'account/tags/update',     login: true, limitDuration: day, limitMax: 50 },

	{ name: 'notifications/show',         login: true },
	{ name: 'notifications/timeline',     login: true },
	{ name: 'notifications/delete-all',   login: true },
	{ name: 'notifications/unread/count', login: true },

	{ name: 'users/show',                  login: false },
	{ name: 'users/follow',                login: true, limitDuration: hour, limitMax: 100  },
	{ name: 'users/unfollow',              login: true, limitDuration: hour, limitMax: 100 },
	{ name: 'users/following',             login: false },
	{ name: 'users/followers',             login: false },
	{ name: 'users/recommendations',       login: true },
	{ name: 'users/search',                login: false },
	{ name: 'users/search-by-screen-name', login: false },

	{ name: 'posts/timeline', login: true, limitDuration: 10 * minute, limitMax: 100 },
	{ name: 'posts/user-timeline', login: false },
	{ name: 'posts/mentions/show', login: true, limitDuration: 10 * minute, limitMax: 100 },
	{ name: 'posts/mentions/delete-all', login: true },
	{ name: 'posts/mentions/unread/count', login: true },
	{ name: 'posts/show', login: false },
	{ name: 'posts/talk/show', login: false },
	{ name: 'posts/replies/show', login: false },
	{ name: 'posts/timeline/unread/count', login: true },
	{ name: 'posts/create', login: true, limitDuration: hour, limitMax: 120, minInterval: 3 * second, imitKey: 'post' },
	{ name: 'posts/reply', login: true, limitDuration: hour, limitMax: 120, minInterval: 3 * second, limitKey: 'post' },
	{ name: 'posts/repost', login: true, limitDuration: hour, limitMax: 120, minInterval: 0.5 * second, limitKey: 'post' },
	{ name: 'posts/like', login: true, limitDuration: hour, limitMax: 120 },
	{ name: 'posts/search', login: false },
	{ name: 'posts/likes/show', login: false },
	{ name: 'posts/reposts/show', login: false },

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

	{ name: 'album/files/upload',      login: true, limitDuration: hour, limitMax: 100, withFile: true },
	{ name: 'album/files/show',        login: true },
	{ name: 'album/files/list',        login: true },
	{ name: 'album/files/stream',      login: true },
	{ name: 'album/files/move',        login: true },
	{ name: 'album/files/rename',      login: true },
	{ name: 'album/files/delete',      login: true },
	{ name: 'album/files/update-tag',  login: true },
	{ name: 'album/files/add-tag',     login: true },
	{ name: 'album/files/remove-tag',  login: true },
	{ name: 'album/files/find-by-tag', login: true },
	{ name: 'album/folders/create',    login: true, limitDuration: hour, limitMax: 50 },
	{ name: 'album/folders/list',      login: true },
	{ name: 'album/folders/show',      login: true },
	{ name: 'album/folders/move',      login: true },
	{ name: 'album/folders/rename',    login: true },
	{ name: 'album/tags/create',       login: true, limitDuration: hour, limitMax: 30 },
	{ name: 'album/tags/list',         login: true },
	{ name: 'album/tags/recolor',      login: true },
	{ name: 'album/tags/rename',       login: true },
	{ name: 'album/tags/delete',       login: true },

	{ name: 'hashtags/search', login: false },
	{ name: 'hashtags/trend/show', login: false },

	{ name: 'bbs/topics/create', login: true, limitDuration: day, limitMax: 30 },
	{ name: 'bbs/posts/create', login: true, limitDuration: hour, limitMax: 120 }
];
