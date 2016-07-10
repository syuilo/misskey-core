import {Document, Types} from 'mongoose';

export interface IUser extends Document {
	avatar: string | Types.ObjectId | IAlbumFile;
	banner: string | Types.ObjectId | IAlbumFile;
	birthday: Date;
	comment: string;
	created_at: Date;
	description: string;
	email: string;
	password: string;
	followers_count: number;
	following_count: number;
	is_suspended: Boolean;
	is_verified: Boolean;
	lang: string;
	latest_post: string | Types.ObjectId | IPost;
	location: string;
	name: string;
	posts_count: number;
	username: string;
	links: string[];
}

export interface IUserFollowing extends Document {
	created_at: Date;
	followee: string | Types.ObjectId | IUser;
	follower: string | Types.ObjectId | IUser;
}

export interface IApplication extends Document {
	createdAt: Date;
	userId: string | Types.ObjectId;
	appKey: string;
	callbackUrl: string;
	description: string;
	iconId: string | Types.ObjectId;
	isDeleted: boolean;
	isSuspended: boolean;
	permissions: string[];
}

export interface IHashtag extends Document {
	count: number;
	created_at: Date;
	name: string;
	users: string[] | Types.ObjectId[] | IUser[];
}

export interface IPost extends Document {
	created_at: Date;
	files: string[] | Types.ObjectId[] | IAlbumFile[];
	prev: string | Types.ObjectId | IPost;
	next: string | Types.ObjectId | IPost;
	reply_to: string | Types.ObjectId | IPost;
	repost: string | Types.ObjectId | IPost;
	replies_count: number;
	repost_count: number;
	text: string;
	user: string | Types.ObjectId | IUser;
}

export interface IPostLike extends Document {
	createdAt: Date;
	post: string | Types.ObjectId | IPost;
	user: string | Types.ObjectId | IUser;
}

export interface IPostMention extends Document {
	createdAt: Date;
	isRead: boolean;
	post: string | Types.ObjectId | IPost;
	user: string | Types.ObjectId | IUser;
}

export interface IAlbumFile extends Document {
	app: string | Types.ObjectId | IApplication;
	createdAt: Date;
	dataSize: number;
	folder: string | Types.ObjectId | IAlbumFolder;
	mimeType: string;
	hash: string;
	isDeleted: boolean;
	isHidden: boolean;
	isPrivate: boolean;
	name: string;
	properties: any;
	serverPath: string;
	tags: string[] | Types.ObjectId[] | IAlbumTag[];
	user: string | Types.ObjectId | IUser;
}

export interface IAlbumFolder extends Document {
	createdAt: Date;
	color: string;
	name: string;
	parent: string | Types.ObjectId | IAlbumFolder;
	user: string | Types.ObjectId | IUser;
}

export interface IAlbumTag extends Document {
	color: string;
	name: string;
	user: string | Types.ObjectId | IUser;
}

export interface INotification extends Document {
	app: string | Types.ObjectId | IApplication;
	content: Object;
	createdAt: Date;
	isRead: boolean;
	type: string;
	user: string | Types.ObjectId | IUser;
}

export interface ITalkGroup extends Document {
	allowInvite: boolean;
	createdAt: Date;
	icon: string | Types.ObjectId | IAlbumFile;
	iconPath: string;
	members: string[] | Types.ObjectId[] | IUser[];
	name: string;
	owner: string | Types.ObjectId | IUser;
}

export interface ITalkGroupInvitation extends Document {
	createdAt: Date;
	group: string | Types.ObjectId | ITalkGroup;
	isDeclined: boolean;
	text: string;
	user: string | Types.ObjectId | IUser;
}

export interface ITalkMessage extends Document {
	createdAt: Date;
	type: string;
}

export interface ITalkUserMessage extends ITalkMessage {
	file: string | Types.ObjectId | IAlbumFile;
	isContentModified: boolean;
	isDeleted: boolean;
	isRead: boolean;
	recipient: string | Types.ObjectId | IUser;
	text: string;
	user: string | Types.ObjectId | IUser;
}

export interface ITalkGroupMessage extends ITalkMessage {
	file: string | Types.ObjectId | IAlbumFile;
	group: string | Types.ObjectId | ITalkGroup;
	isContentModified: boolean;
	isDeleted: boolean;
	reads: string[] | Types.ObjectId[] | IUser[];
	text: string;
	user: string | Types.ObjectId | IUser;
}

export interface ITalkGroupSendInvitationActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	invitee: string | Types.ObjectId | IUser;
	inviter: string | Types.ObjectId | IUser;
	invitation: string | Types.ObjectId | ITalkGroupInvitation;
}

export interface ITalkGroupMemberJoinActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	joiner: string | Types.ObjectId | IUser;
}

export interface ITalkGroupMemberLeftActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	lefter: string | Types.ObjectId | IUser;
}

export interface ITalkRenameGroupActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	renamer: string | Types.ObjectId | IUser;
	oldName: string;
	newName: string;
}

export interface ITalkTransferGroupOwnershipActivity extends ITalkMessage {
	group: string | Types.ObjectId | ITalkGroup;
	oldOwner: string | Types.ObjectId | IUser;
	newOwner: string | Types.ObjectId | IUser;
}

export interface ITalkHistory extends Document {
	updatedAt: Date;
	message: string | Types.ObjectId | ITalkMessage;
	user: string | Types.ObjectId | IUser;
}

export interface ITalkUserHistory extends ITalkHistory {
	recipient: string | Types.ObjectId | IUser;
}

export interface ITalkGroupHistory extends ITalkHistory {
	group: string | Types.ObjectId | ITalkGroup;
}
