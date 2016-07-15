import {Schema, Document} from 'mongoose';
import db from '../db';

interface Following extends Document {
	created_at: Date;
	followee:   string;
	follower:   string;
}

export default db.model<Following>('Following', schema, 'following');
