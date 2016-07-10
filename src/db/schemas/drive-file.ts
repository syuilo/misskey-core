import {Schema, Connection, Document, Model} from 'mongoose';
import config from '../../config';

const schema = new Schema({
	comment:    { type: String, required: false, default: null },
	created_at: { type: Date, required: true, default: Date.now },
	data:       { type: Buffer, required: true },
	datasize:   { type: Number, required: true },
	folder:     { type: Schema.Types.ObjectId, required: false, default: null, ref: 'DriveFolder' },
	type:       { type: String, required: true },
	hash:       { type: String, required: false, default: null },
	name:       { type: String, required: true },
	properties: { type: Schema.Types.Mixed, required: false, default: null },
	tags:       { type: [Schema.Types.ObjectId], required: false, default: null, ref: 'DriveTag' },
	user:       { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

export default function(db: Connection): Model<Document> {

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

	return db.model('DriveFile', schema, 'drive_files');
}
