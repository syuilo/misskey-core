import {Schema, Document} from 'mongoose';
import db from '../db';

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
	latest_post:     string;
	location:        string;
	name:            string;
	password:        string;
	posts_count:     number;
	username:        string;
	links:           string[];
}

export default db.model<User>('User', schema, 'users');
