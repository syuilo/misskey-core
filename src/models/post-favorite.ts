import {Schema, Document} from 'mongoose';
import db from '../db';

interface PostFavorite extends Document {
	created_at: Date;
	post:       string;
	user:       string;
}

export default db.model<PostFavorite>('PostFavorite', schema, 'post_favorites');
