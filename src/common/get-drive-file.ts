import DriveFile from '../models/drive-file';

export default (
	meId: string,
	fileId: string
) => new Promise<any>((resolve, reject) =>
{
	DriveFile.findById(fileId, (err, file) => {
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
