import {Schema, Connection, Document, Model} from 'mongoose';

export default function(db: Connection): Model<Document> {
	const schema = new Schema({
		createdAt: { type: Date, required: true, default: Date.now },
		color: { type: String, required: true },
		name: { type: String, required: false, default: '' },
		parent: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFolder' },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('AlbumFolder', schema, 'AlbumFolders');
}
