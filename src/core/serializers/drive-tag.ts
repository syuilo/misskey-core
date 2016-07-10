import {DriveTag} from '../../db/db';

const self = (
	tag: any
) => new Promise<Object>(async (resolve, reject) =>
{
	if (typeof tag === 'string') {
		tag = await DriveTag.findById(tag).lean().exec();
	}

	tag.id = tag._id;
	delete tag._id;
	delete tag.__v;

	resolve(tag);
});

export default self;
