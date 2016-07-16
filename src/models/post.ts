import db from '../db';

export interface Post {
	_id:           string;
	created_at:    Date;
	files:         string[];
	next:          string;
	prev:          string;
	replies_count: number;
	reply_to:      string;
	repost:        string;
	repost_count:  number;
	text:          string;
	user:          string;
}

export default db.collection('posts');
