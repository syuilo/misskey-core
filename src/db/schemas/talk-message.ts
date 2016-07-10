import {Schema, Connection, Document, Model} from 'mongoose';

const base: Object = {
	createdAt: { type: Date, required: true, default: Date.now }
};

const groupBaseScema: Object = Object.assign({
	group: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroup' },
	reads: [{ type: Schema.Types.ObjectId, required: false, default: null, ref: 'User' }]
}, base);

const toObject: any = (doc: any, ret: any) => {
	ret.id = doc.id;
	delete ret._id;
	delete ret.__v;
	switch (doc.type) {
		case 'user-message':
			ret.isModified = doc._doc.isContentModified;
			delete ret.isContentModified;
			break;
		case 'group-message':
			ret.isModified = doc._doc.isContentModified;
			delete ret.isContentModified;
			break;
		default:
			break;
	}
};

export function message(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		type: { type: String, required: true }
	}, base));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TalkMessage', schema, 'TalkMessages');
}

export function userMessage(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		file: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
		isContentModified: { type: Boolean, required: false, default: false },
		isDeleted: { type: Boolean, required: false, default: false },
		isRead: { type: Boolean, required: false, default: false },
		recipient: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		text: { type: String, required: false, default: '' },
		type: { type: String, required: false, default: 'user-message' },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	}, base));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TalkUserMessage', schema, 'TalkMessages');
}

export function groupMessageBase(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		type: { type: String, required: true }
	}, groupBaseScema));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TalkGroupBase', schema, 'TalkMessages');
}

export function groupMessage(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		file: { type: Schema.Types.ObjectId, required: false, default: null, ref: 'AlbumFile' },
		isContentModified: { type: Boolean, required: false, default: false },
		isDeleted: { type: Boolean, required: false, default: false },
		text: { type: String, required: false, default: '' },
		type: { type: String, required: false, default: 'group-message' },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	}, groupBaseScema));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TalkGroupMessage', schema, 'TalkMessages');
}

export function groupSendInvitationActivity(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		invitee: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		inviter: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		invitation: { type: Schema.Types.ObjectId, required: true, ref: 'TalkGroupInvitation' },
		type: { type: String, required: false, default: 'group-send-invitation-activity' }
	}, groupBaseScema));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TalkGroupSendInvitationActivity', schema, 'TalkMessages');
}

export function groupMemberJoinActivity(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		joiner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		type: { type: String, required: false, default: 'group-member-join-activity' }
	}, groupBaseScema));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TalkGroupMemberJoinActivity', schema, 'TalkMessages');
}

export function groupMemberLeftActivity(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		lefter: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		type: { type: String, required: false, default: 'group-member-left-activity' }
	}, groupBaseScema));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TalkGroupMemberLeftActivity', schema, 'TalkMessages');
}

export function renameGroupActivity(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		renamer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		oldName: { type: String, required: true },
		newName: { type: String, required: true },
		type: { type: String, required: false, default: 'rename-group-activity' }
	}, groupBaseScema));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TalkRenameGroupActivity', schema, 'TalkMessages');
}

export function transferGroupOwnershipActivity(db: Connection): Model<Document> {
	const schema = new Schema(Object.assign({
		oldOwner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		newOwner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		type: { type: String, required: false, default: 'transfer-group-ownership-activity' }
	}, groupBaseScema));

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = toObject;

	return db.model('TalkTransferGroupOwnershipActivity', schema, 'TalkMessages');
}
