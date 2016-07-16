import * as mongo from 'mongodb';
import DriveFile from '../models/drive-file';
import serializeDriveTag from './drive-tag';
const deepcopy = require('deepcopy');

const self = (
	file: any,
	options?: {
		includeTags: boolean
	}
) => new Promise<Object>(async (resolve, reject) =>
{
	let _file = deepcopy(file);

	const opts = options || {
		includeTags: true
	};

	// Populate the file if file is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(_file)) {
		_file = await DriveFile.findOne({_id: _file});
	}

	_file.id = _file._id;
	delete _file._id;

	if (opts.includeTags && _file.tags) {
		// Populate tags
		_file.tags = await (<string[]>_file.tags).map(async (tag) => {
			return await serializeDriveTag(tag);
		});
	}

	resolve(_file);
});

export default self;
