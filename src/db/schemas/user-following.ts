import {Schema, Connection, Document, Model} from 'mongoose';

export default function(db: Connection): Model<Document> {
	const schema = new Schema({
		createdAt: { type: Date, required: true, default: Date.now },
		followee: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		follower: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	});

	return db.model('UserFollowing', schema, 'UserFollowings');
}
