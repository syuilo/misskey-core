import {Schema, Connection, Document, Model} from 'mongoose';
import config from '../../config';

export default function(db: Connection): Model<Document> {
	const schema = new Schema({
		allowInvite: { type: Boolean, required: false, default: true },
		createdAt: { type: Date, required: true, default: Date.now },
		icon: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFiles' },
		iconPath: { type: String, required: false, default: null },
		members: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
		name: { type: String, required: true },
		owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;

		delete ret.icon;
		delete ret.iconPath;
		ret.iconUrl = doc.icon !== null
			? `${config.fileServer.url}/${encodePath(doc.iconPath)}`
			: `${config.fileServer.url}/defaults/talk-group-icon.jpg`;
		ret.iconThumbnailUrl = `${ret.iconUrl}?thumbnail`;
	};

	return db.model('TalkGroup', schema, 'TalkGroups');
}

function encodePath(path: string): string {
	return (<string>path).split('/').map(encodeURI).join('/');
}
