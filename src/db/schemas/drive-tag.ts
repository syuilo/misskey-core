import {Schema, Connection, Document, Model} from 'mongoose';

const schema = new Schema({
	color: { type: String, required: true },
	name:  { type: String, required: true },
	user:  { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

export default function(db: Connection): Model<Document> {
	return db.model('DriveTag', schema, 'drive_tags');
}
