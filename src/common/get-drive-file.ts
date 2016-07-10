import {DriveFile} from '../db/db';
import {IDriveFile} from '../db/interfaces';

export default (
	meId: string,
	fileId: string
) => new Promise<IDriveFile>((resolve, reject) =>
{
	DriveFile.findById(fileId, (err: any, file: IDriveFile) => {
		if (err) {
			reject(err);
		} else if (file === null) {
			reject('file-not-found');
		} else if (file.user.toString() !== meId.toString()) {
			reject('file-not-found');
		} else {
			resolve(file);
		}
	});
});
