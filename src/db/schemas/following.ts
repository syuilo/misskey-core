import {Schema, Connection, Document, Model} from 'mongoose';

const schema = new Schema({
	created_at: { type: Date, required: true, default: Date.now },
	followee: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	follower: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

export default function(db: Connection): Model<Document> {
	return db.model('Following', schema, 'followings');
}
