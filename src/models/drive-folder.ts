import {Schema, Document} from 'mongoose';
import db from '../db';

const schema = new Schema({
	color:      { type: String, required: true },
	created_at: { type: Date, required: true, default: Date.now },
	name:       { type: String, required: false, default: '' },
	parent:     { type: Schema.Types.ObjectId, required: false, default: null, ref: 'DriveFolder' },
	user:       { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

interface DriveFolder extends Document {
	color:      string;
	created_at: Date;
	name:       string;
	parent:     string;
	user:       string;
}

export default db.model<DriveFolder>('DriveFolder', schema, 'drive_folders');
