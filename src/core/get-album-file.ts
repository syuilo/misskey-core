import {AlbumFile} from '../db/db';
import {IAlbumFile} from '../db/interfaces';

export default function(
	meId: string,
	fileId: string
): Promise<IAlbumFile> {
	return new Promise<IAlbumFile>((resolve, reject) => {
		AlbumFile.findById(fileId, (findErr: any, file: IAlbumFile) => {
			if (findErr !== null) {
				reject(findErr);
			} else if (file === null) {
				reject('file-not-found');
			} else if (file.user.toString() !== meId.toString()) {
				reject('file-not-found');
			} else if (file.isDeleted) {
				reject('file-not-found');
			} else {
				resolve(file);
			}
		});
	});
}
