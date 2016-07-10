import * as crypto from 'crypto';
import * as gm from 'gm';
import {DriveFile, DriveFolder} from '../db/db';
import {IDriveFile, IDriveFolder} from '../db/interfaces';
const fileType = require('file-type');
const mimeType = require('mime-types');

/**
 * ドライブにファイルを追加します
 * @param userId ユーザーID
 * @param fileName ファイル名
 * @param file 内容
 * @param comment ファイルの説明
 * @param type ファイルタイプ
 * @param folderId フォルダID
 * @param force trueに設定すると、ハッシュが同じファイルが見つかった場合でも無視してドライブに登録します
 * @return 追加したファイルオブジェクト
 */
export default (
	userId: string,
	fileName: string,
	file: Buffer,
	comment: string = null,
	type: string = null,
	folderId: string = null,
	force: boolean = false
) => new Promise<IDriveFile>((resolve, reject) =>
{
	// ファイルサイズ
	const size = file.byteLength;

	// ファイルタイプ
	type = fileType(file) || mimeType.lookup(fileName) || type || 'application/octet-stream';

	// ハッシュ生成
	const hash: string = crypto
		.createHash('sha256')
		.update(file)
		.digest('hex');

	if (!force) {
		// 同じハッシュ(と同じファイルサイズ(念のため))を持つファイルが既に存在するか確認
		DriveFile.findOne({
			user: userId,
			hash: hash,
			datasize: size
		}, (hashmuchFileFindErr: any, hashmuchFile: IDriveFile) => {
			if (hashmuchFileFindErr !== null) {
				console.error(hashmuchFileFindErr);
				return reject('something-happend');
			}

			// 無かったら新規登録
			if (hashmuchFile === null) {
				register();
			} else {
				// あったら登録せずにそれを返却
				resolve(hashmuchFile);
			}
		});
	} else {
		// forceがtrueの場合は強制登録
		register();
	}

	function register(): void {
		// ドライブ使用量を取得するためにすべてのファイルを取得
		DriveFile
		.find({user: userId})
		.select({
			datasize: 1,
			_id: 0
		})
		.lean()
		.exec((driveFilesFindErr: any, driveFiles: IDriveFile[]) => {
			if (driveFilesFindErr !== null) {
				return reject(driveFilesFindErr);
			}

			// 現時点でのドライブ使用量を算出(byte)
			const used = driveFiles.map(driveFile => driveFile.datasize).reduce((x, y) => x + y, 0);

			// 1GBを超える場合
			if (used + size > 1073741824) {
				return reject('no-free-space');
			}

			if (folderId !== null) {
				DriveFolder.findById(folderId, (folderFindErr: any, folder: IDriveFolder) => {
					if (folderFindErr !== null) {
						return reject(folderFindErr);
					} else if (folder === null) {
						return reject('folder-not-found');
					} else if (folder.user.toString() !== userId) {
						return reject('folder-not-found');
					}
					create(folder);
				});
			} else {
				create(null);
			}

			function create(folder: IDriveFolder = null): void {
				// DriveFileドキュメントを作成
				DriveFile.create({
					user: userId,
					folder: folder !== null ? folder.id : null,
					datasize: size,
					type: type,
					name: fileName,
					comment: comment,
					hash: hash
				}, (driveFileCreateErr: any, driveFile: IDriveFile) => {
					if (driveFileCreateErr !== null) {
						console.error(driveFileCreateErr);
						return reject(driveFileCreateErr);
					}

					// 画像だった場合
					if (/^image\/.*$/.test(type)) {
						// 幅と高さを取得してプロパティに保存しておく
						(<any>gm)(file, fileName)
						.size((getSizeErr: any, whsize: any) => {
							if (getSizeErr !== undefined && getSizeErr !== null) {
								console.error(getSizeErr);
								return save(driveFile);
							}
							driveFile.properties = {
								width: whsize.width,
								height: whsize.height
							};
							save(driveFile);
						});
					} else {
						save(driveFile);
					}
				});
			}
		});
	}

	function save(driveFile: IDriveFile): void {
		driveFile.save((saveErr: any, saved: IDriveFile) => {
			if (saveErr !== null) {
				console.error(saveErr);
				return reject(saveErr);
			}
			resolve(saved);
		});
	}
});
