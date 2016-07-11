import {Schema, Document} from 'mongoose';
import db from '../db';

const schema = new Schema({
	created_at: { type: Date, required: true, default: Date.now },
	followee:   { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	follower:   { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

interface Following extends Document {
	created_at: Date;
	followee:   string;
	follower:   string;
}

export default db.model<Following>('Following', schema, 'following');
