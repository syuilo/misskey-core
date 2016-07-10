import {AlbumFile} from '../db/db';
import {IAlbumFile} from '../db/interfaces';

export default (
	meId: string,
	fileId: string
) => new Promise<IAlbumFile>((resolve, reject) =>
{
	AlbumFile.findById(fileId, (err: any, file: IAlbumFile) => {
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
