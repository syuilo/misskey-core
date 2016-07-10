import {Schema, Connection, Document, Model} from 'mongoose';
import {User} from '../db';

const schema = new Schema({
	created_at: { type: Date,                    required: true,  default: Date.now                   },
	files:      { type: [Schema.Types.ObjectId], required: false, default: null,     ref: 'DriveFile' },
	next:       { type: Schema.Types.ObjectId,   required: false, default: null,     ref: 'Post'      },
	prev:       { type: Schema.Types.ObjectId,   required: false, default: null,     ref: 'Post'      },
	reply_to:   { type: Schema.Types.ObjectId,   required: false, default: null,     ref: 'Post'      },
	text:       { type: String,                  required: false, default: null                       },
	user:       { type: Schema.Types.ObjectId,   required: true,                     ref: 'User'      }
});

schema.method('serialize', async () => {
	const self = this;
	return new Promise(async (resolve, reject) => {
		await User.findById(self.id).exec();
	});
});

export default function(db: Connection): Model<Document> {

	if (!(<any>schema).options.toObject) {
		(<any>schema).options.toObject = {};
	}
	(<any>schema).options.toObject.transform = (doc: any, ret: any) => {
		ret.id = doc.id;
		delete ret._id;
		delete ret.__v;
	};

	return db.model('Post', schema, 'posts');
}
