'use strict';

/**
 * Module dependencies
 */
import DriveFile from './models/drive-file';

/**
 * Get drive information
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, reply, user) =>
{
	// ドライブ使用量を取得するためにすべてのファイルを取得
	const files = await DriveFile
		.find({ user: user._id }, {
			datasize: true,
			_id: false
		})
		.toArray();

	// 現時点でのドライブ使用量を算出(byte)
	const usage = files.map(file => file.datasize).reduce((x, y) => x + y, 0);

	reply({
		capacity: user.drive_capacity,
		usage: usage
	});
};
