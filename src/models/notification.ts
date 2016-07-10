import {Schema} from 'mongoose';
import db from '../db';

const schema = new Schema({
	content:    { type: Schema.Types.Mixed, required: false, default: {} },
	created_at: { type: Date, required: true, default: Date.now },
	is_read:    { type: Boolean, required: false, default: false },
	type:       { type: String, required: true },
	user:       { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

export default db.model('Notification', schema, 'notifications');
