import {Schema, Connection, Document, Model} from 'mongoose';
import config from '../../config';

export default function(db: Connection): Model<Document> {
	const schema = new Schema({
		avatar: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
		avatarPath: { type: String, required: false, default: null },
		banner: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
		bannerPath: { type: String, required: false, default: null },
		birthday: { type: Date, required: false, default: null },
		color: { type: String, required: false, default: null },
		comment: { type: String, required: false, default: null },
		createdAt: { type: Date, required: true, default: Date.now },
		credit: { type: Number, required: true },
		description: { type: String, required: false, default: null },
		email: { type: String, required: false, sparse: true, default: null },
		encryptedPassword: { type: String, required: true },
		followersCount: { type: Number, required: false, default: 0 },
		followingCount: { type: Number, required: false, default: 0 },
		isDeleted: { type: Boolean, required: false, default: false },
		isEmailVerified: { type: Boolean, required: false, default: false },
		isPrivate: { type: Boolean, required: false, default: false },
		isPro: { type: Boolean, required: false, default: false },
		isStaff: { type: Boolean, required: false, default: false },
		isSuspended: { type: Boolean, required: false, default: false },
		isVerified: { type: Boolean, required: false, default: false },
		lang: { type: String, required: true },
		latestPost: { type: Schema.Types.ObjectId, required: false, default: null },
		likedCount: { type: Number, required: false, default: 0 },
		likesCount: { type: Number, required: false, default: 0 },
		location: { type: String, required: false, default: null },
		name: { type: String, required: true },
		pinnedPost: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
		postsCount: { type: Number, required: false, default: 0 },
		screenName: { type: String, required: true, unique: true },
		screenNameLower: { type: String, required: true, unique: true, lowercase: true },
		tags: { type: [String], required: false, default: [] },
		timelineReadCursor: { type: Number, required: false, default: 0 },
		url: { type: String, required: false, default: null },
		wallpaper: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
		wallpaperPath: { type: String, required: false, default: null }
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;

		// Normalization avatar URL
		delete ret.avatar;
		delete ret.avatarPath;
		ret.avatarUrl = doc.avatar !== null
			? `${config.fileServer.url}/${encodePath(doc.avatarPath)}`
			: `${config.fileServer.url}/defaults/avatar.jpg`;
		ret.avatarThumbnailUrl = `${ret.avatarUrl}?thumbnail`;

		// Normalization banner URL
		delete ret.banner;
		delete ret.bannerPath;
		ret.bannerUrl = doc.banner !== null
			? `${config.fileServer.url}/${encodePath(doc.bannerPath)}`
			: `${config.fileServer.url}/defaults/banner.jpg`;
		ret.bannerThumbnailUrl = `${ret.bannerUrl}?thumbnail`;

		// Normalization wallpaper URL
		delete ret.wallpaper;
		delete ret.wallpaperPath;
		ret.wallpaperUrl = doc.wallpaper !== null
			? `${config.fileServer.url}/${encodePath(doc.wallpaperPath)}`
			: `${config.fileServer.url}/defaults/wallpaper.jpg`;
		ret.wallpaperThumbnailUrl = `${ret.wallpaperUrl}?thumbnail`;

		// Remove needless properties
		delete ret._id;
		delete ret.__v;
		delete ret.screenNameLower;
		delete ret.email;
		delete ret.encryptedPassword;
	};

	return db.model('User', schema, 'Users');
}

function encodePath(path: string): string {
	return (<string>path).split('/').map(encodeURI).join('/');
}
