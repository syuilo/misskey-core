import DriveTag from '../models/drive-tag';

const self = (
	tag: any
) => new Promise<Object>(async (resolve, reject) =>
{
	if (typeof tag === 'string') {
		tag = await DriveTag.findOne({_id: tag});
	}

	tag.id = tag._id;
	delete tag._id;

	resolve(tag);
});

export default self;
