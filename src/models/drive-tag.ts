import {Schema, Document} from 'mongoose';
import db from '../db';

interface DriveTag extends Document {
	color:      string;
	name:       string;
	user:       string;
}

export default db.model<DriveTag>('DriveTag', schema, 'drive_tags');
