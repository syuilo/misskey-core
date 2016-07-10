import {Schema, Connection, Document, Model} from 'mongoose';

export default function(db: Connection): Model<Document> {
	const schema = new Schema({
		count: { type: Number, required: false, default: 1 },
		createdAt: { type: Date, required: true, default: Date.now },
		name: { type: String, required: true, unique: true },
		users: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }]
	});

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('Hashtag', schema, 'Hashtags');
}
