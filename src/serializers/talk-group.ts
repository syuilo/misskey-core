'use strict';

/**
 * Module dependencies
 */
import * as mongo from 'mongodb';
import Group from '../models/talk-group';
import serializeUser from './user';
const deepcopy = require('deepcopy');

/**
 * Serialize a group
 *
 * @param {Object} group
 * @param {Object} me?
 * @param {Object} options?
 * @return {Promise<Object>}
 */
export default (
	group: any,
	me: any,
	options?: {
		populateMembers: boolean
	}
) => new Promise<Object>(async (resolve, reject) =>
{
	const opts = options || {
		populateMembers: true
	};

	let _group: any;

	// Populate the group if 'group' is ID
	if (mongo.ObjectID.prototype.isPrototypeOf(group)) {
		_group = await Group.findOne({
			_id: group
		});
	} else if (typeof group === 'string') {
		_group = await Group.findOne({
			_id: new mongo.ObjectID(group)
		});
	} else {
		_group = deepcopy(group);
	}

	// Rename _id to id
	_group.id = _group._id;
	delete _group._id;

	// Populate owner
	_group.owner = await serializeUser(_group.owner, me);

	if (opts.populateMembers) {
		// Populate members
		_group.members = await Promise.all(_group.members.map(async (member: any) =>
			await serializeUser(member)
		));
	}

	resolve(_group);
});
