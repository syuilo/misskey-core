import db from '../db';

export interface Following {
	created_at: Date;
	followee:   string;
	follower:   string;
}

export default db.collection('following');
