'use strict';

/**
 * Module dependencies
 */
const deepcopy = require('deepcopy');
import serializeApp from './app';

/**
 * Serialize an auth session
 *
 * @param {Object} session
 * @return {Promise<Object>}
 */
export default (
	session: any
) => new Promise<any>(async (resolve, reject) => {
	let _session: any;

	delete _session._id;

	// Populate app
	_session.app = await serializeApp(_session.app);

	resolve(_session);
});
