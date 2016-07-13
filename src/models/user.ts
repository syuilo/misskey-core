import {Schema, Document} from 'mongoose';
import db from '../db';

const schema = new Schema({
	avatar:          { type: Schema.Types.ObjectId, required: false, default: null, ref: 'DriveFile' },
	banner:          { type: Schema.Types.ObjectId, required: false, default: null, ref: 'DriveFile' },
	birthday:        { type: Date, required: false, default: null },
	comment:         { type: String, required: false, default: null },
	created_at:      { type: Date, required: true, default: Date.now },
	description:     { type: String, required: false, default: null },
	email:           { type: String, required: false, sparse: true, default: null },
	followers_count: { type: Number, required: false, default: 0 },
	following_count: { type: Number, required: false, default: 0 },
	is_suspended:    { type: Boolean, required: false, default: false },
	is_verified:     { type: Boolean, required: false, default: false },
	lang:            { type: String, required: true },
	latest_Post:     { type: Schema.Types.ObjectId, required: false, default: null },
	location:        { type: String, required: false, default: null },
	name:            { type: String, required: true },
	password:        { type: String, required: true },
	posts_count:     { type: Number, required: false, default: 0 },
	username:        { type: String, required: true, unique: true, lowercase: true },
	links:           { type: [String], required: false, default: [] }
});

interface User extends Document {
	avatar:          string;
	banner:          string;
	birthday:        Date;
	comment:         string;
	created_at:      Date;
	description:     string;
	email:           string;
	followers_count: number;
	following_count: number;
	is_suspended:    boolean;
	is_verified:     boolean;
	lang:            string;
	latest_Post:     string;
	location:        string;
	name:            string;
	password:        string;
	posts_count:     number;
	username:        string;
	links:           string[];
}

export default db.model<User>('User', schema, 'users');
