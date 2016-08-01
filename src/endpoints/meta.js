'use strict';

/**
 * Module dependencies
 */
import Git from 'nodegit';
import config from '../config';

/**
 * Show core info
 *
 * @param {Object} params
 * @param {Object} reply
 * @return {void}
 */
module.exports = async (params, reply) =>
{
	const repository = await Git.Repository.open(__dirname + '/../../');

	reply({
		maintainer: config.maintainer,
		commit: (await repository.getHeadCommit()).sha(),
		secure: config.https.enable
	});
};
