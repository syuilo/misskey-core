import {Schema} from 'mongoose';
import db from '../db';

const schema = new Schema({
	created_at: { type: Date, required: true, default: Date.now },
	followee:   { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	follower:   { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

export default db.model('Following', schema, 'followings');
