import * as mongo from 'mongodb';
import DriveFolder from '../models/drive-folder';

const self = (
	folder: any,
	options?: {
		includeParent: boolean
	}
) => new Promise<Object>(async (resolve, reject) =>
{
	const opts = options || {
		includeParent: true
	};

	if (mongo.ObjectID.prototype.isPrototypeOf(folder)) {
		folder = await DriveFolder.findOne({_id: folder});
	}

	folder.id = folder._id;
	delete folder._id;

	if (opts.includeParent && folder.parent) {
		folder.parent = await self(folder.parent);
	}

	resolve(folder);
});

export default self;
