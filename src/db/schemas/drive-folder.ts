import {Schema, Connection, Document, Model} from 'mongoose';

const schema = new Schema({
	created_at: { type: Date, required: true, default: Date.now },
	color:      { type: String, required: true },
	name:       { type: String, required: false, default: '' },
	parent:     { type: Schema.Types.ObjectId, required: false, default: null, ref: 'DriveFolder' },
	user:       { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

export default function(db: Connection): Model<Document> {

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('DriveFolder', schema, 'drive_folders');
}
