import * as mongoose from 'mongoose';
import {Schema, Connection, Document, Model} from 'mongoose';

const base: Object = {
	updatedAt: { type: Date, required: true, default: Date.now },
	message: { type: Schema.Types.ObjectId, required: true, ref: 'TalkMessage' },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
};

export function talkHistory(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		type: { type: String, required: true }
	}, base));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('TalkHistory', schema, 'TalkHistories');
}

export function talkUserHistory(db: Connection): Model<Document> {
	const deepPopulate: any = require('mongoose-deep-populate')(mongoose);

	const schema = new Schema(Object.assign({
		recipient: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		type: { type: String, required: false, default: 'user' }
	}, base));

	schema.plugin(deepPopulate);

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('TalkUserHistory', schema, 'TalkHistories');
}

export function talkGroupHistory(db: Connection): Model<Document> {
	const deepPopulate: any = require('mongoose-deep-populate')(mongoose);

	const schema = new Schema(Object.assign({
		group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
		type: { type: String, required: false, default: 'group' }
	}, base));

	schema.plugin(deepPopulate);

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('TalkGroupHistory', schema, 'TalkHistories');
}
