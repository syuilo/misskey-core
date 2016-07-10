import {Schema, Connection, Document, Model} from 'mongoose';
import config from '../../config';

export default function(db: Connection): Model<Document> {
	const schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		createdAt: { type: Date, required: true, default: Date.now },
		dataSize: { type: Number, required: true },
		folder: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFolder' },
		mimeType: { type: String, required: true },
		hash: { type: String, required: false, default: null },
		isDeleted: { type: Boolean, required: false, default: false },
		isHidden: { type: Boolean, required: false, default: false },
		isPrivate: { type: Boolean, required: false, default: false },
		name: { type: String, required: true },
		properties: { type: Schema.Types.Mixed, required: false, default: null },
		serverPath: { type: String, required: false },
		tags: [{ type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumTag' }],
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		ret.url = `${config.fileServer.url}/${(<string>doc.serverPath).split('/').map(encodeURI).join('/')}`;
		ret.thumbnailUrl = `${ret.url}?thumbnail`;
		delete ret._id;
		delete ret.__v;
		delete ret.serverPath;
	};

	return db.model('AlbumFile', schema, 'AlbumFiles');
}
