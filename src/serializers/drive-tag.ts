import * as mongo from 'mongodb';
import DriveTag from '../models/drive-tag';

const self = (
	tag: any
) => new Promise<Object>(async (resolve, reject) =>
{
	if (mongo.ObjectID.prototype.isPrototypeOf(tag)) {
		tag = await DriveTag.findOne({_id: tag});
	}

	tag.id = tag._id;
	delete tag._id;

	resolve(tag);
});

export default self;
