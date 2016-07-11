import {Schema, Document} from 'mongoose';
import db from '../db';

const schema = new Schema({
	color: { type: String, required: true },
	name:  { type: String, required: true },
	user:  { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

interface DriveTag extends Document {
	color:      string;
	name:       string;
	user:       string;
}

export default db.model<DriveTag>('DriveTag', schema, 'drive_tags');
