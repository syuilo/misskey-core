import {Schema, Document} from 'mongoose';
import db from '../db';

const schema = new Schema({
	created_at: { type: Date, required: true,  default: Date.now },
	files:      { type: [Schema.Types.ObjectId], required: false, default: null, ref: 'DriveFile' },
	next:       { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
	prev:       { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
	replies_count: { type: Number, required: false, default: 0 },
	reply_to:   { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
	repost:     { type: Schema.Types.ObjectId, required: false, default: null, ref: 'Post' },
	repost_count: { type: Number, required: false, default: 0 },
	text:       { type: String, required: false, default: null },
	user:       { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

interface Post extends Document {
	created_at: Date;
	files:      string[];
	next:       string;
	prev:       string;
	reply_to:   string;
	repost:     string;
	text:       string;
	user:       string;
}

export default db.model<Post>('Post', schema, 'posts');
