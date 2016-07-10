import {Schema} from 'mongoose';
import db from '../db';

const schema = new Schema({
	color: { type: String, required: true },
	name:  { type: String, required: true },
	user:  { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

export const User = db.model('DriveTag', schema, 'drive_tags');
