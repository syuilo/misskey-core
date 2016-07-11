import {Schema, Document} from 'mongoose';
import db from '../db';

const schema = new Schema({
	created_at: { type: Date, required: true, default: Date.now },
	post:       { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
	user:       { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

interface PostFavorite extends Document {
	created_at: Date;
	post:       string;
	user:       string;
}

export default db.model<PostFavorite>('PostFavorite', schema, 'post_favorites');
