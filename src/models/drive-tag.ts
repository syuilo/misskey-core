import db from '../db';

export interface DriveTag {
	color:      string;
	name:       string;
	user:       string;
}

export default db.collection('drive_tags');
