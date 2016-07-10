import {DriveFile} from '../../db/db';
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
		file = await DriveFile.findById(file).lean().exec();
	}

	file.id = file._id;
	delete file._id;
	delete file.__v;

	if (opts.includeTags && file.tags) {
		file.tags = await (<string[]>file.tags).map(async (tag) => {
			return await serializeDriveTag(tag);
		});
	}

	resolve(file);
});

export default self;
