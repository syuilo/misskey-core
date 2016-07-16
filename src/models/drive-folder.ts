import db from '../db';

export interface DriveFolder {
	color:      string;
	created_at: Date;
	name:       string;
	parent:     string;
	user:       string;
}

export default db.collection('drive_folders');
