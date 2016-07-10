import {Schema, Connection, Document, Model} from 'mongoose';

export default function(db: Connection): Model<Document> {
	const schema = new Schema({
		app: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Application' },
		content: { type: Schema.Types.Mixed, required: false, default: {} },
		createdAt: { type: Date, required: true, default: Date.now },
		isRead: { type: Boolean, required: false, default: false },
		type: { type: String, required: true },
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

	return db.model('Notification', schema, 'Notifications');
}
