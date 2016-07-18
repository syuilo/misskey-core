'use strict';

/**
 * Module dependencies
 */
import serializeUser from './user';
const deepcopy = require('deepcopy');

/**
 * Serialize a following
 *
 * @param {Object} following
 * @param {Object} me?
 * @return {Promise<Object>}
 */
const self = (
	following: any,
	me?: any
) => new Promise<Object>(async (resolve, reject) =>
{
	let _following = deepcopy(following);

	delete _following._id;

	// Serrialize follower
	_following.follower = await serializeUser(_following.follower);

	// Serrialize followee
	_following.followee = await serializeUser(_following.followee);

	resolve(_following);
});

export default self;
