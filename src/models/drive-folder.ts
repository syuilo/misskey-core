import {Schema, Document} from 'mongoose';
import db from '../db';

interface DriveFolder extends Document {
	color:      string;
	created_at: Date;
	name:       string;
	parent:     string;
	user:       string;
}

export default db.model<DriveFolder>('DriveFolder', schema, 'drive_folders');
