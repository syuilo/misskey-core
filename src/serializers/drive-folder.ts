import * as mongo from 'mongodb';
import DriveFolder from '../models/drive-folder';
const deepcopy = require('deepcopy');

const self = (
	folder: any,
	options?: {
		includeParent: boolean
	}
) => new Promise<Object>(async (resolve, reject) =>
{
	let _folder = deepcopy(folder);

	const opts = options || {
		includeParent: true
	};

	// Populate the folder if folder is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(_folder)) {
		_folder = await DriveFolder.findOne({_id: _folder});
	}

	_folder.id = _folder._id;
	delete _folder._id;

	if (opts.includeParent && _folder.parent) {
		// Populate parent folder
		_folder.parent = await self(_folder.parent);
	}

	resolve(_folder);
});

export default self;
