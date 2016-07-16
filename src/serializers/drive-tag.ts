'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import DriveTag from '../models/drive-tag';
const deepcopy = require('deepcopy');

/**
 * Serialize a drive tag
 *
 * @param {Object} tag
 * @return {Promise<Object>}
 */
const self = (
	tag: any
) => new Promise<Object>(async (resolve, reject) =>
{
	let _tag = deepcopy(tag);

	// Populate the tag if tag is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(_tag)) {
		_tag = await DriveTag.findOne({_id: _tag});
	}

	_tag.id = _tag._id;
	delete _tag._id;

	resolve(_tag);
});

export default self;
