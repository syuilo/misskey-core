import DriveFile from '../models/drive-file';
import serializeDriveTag from './drive-tag';

const self = (
	file: any,
	options?: {
		includeTags: boolean
	}
) => new Promise<Object>(async (resolve, reject) =>
{
	const opts = options || {
		includeTags: true
	};

	if (typeof file === 'string') {
		file = await DriveFile.findOne({_id: file});
	}

	file.id = file._id;
	delete file._id;

	if (opts.includeTags && file.tags) {
		file.tags = await (<string[]>file.tags).map(async (tag) => {
			return await serializeDriveTag(tag);
		});
	}

	resolve(file);
});

export default self;
