import {Document} from 'mongoose';
import db from '../db';

interface Post extends Document {
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

export default db.model<Post>('Post', null, 'posts');
