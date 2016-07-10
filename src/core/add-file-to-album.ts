import {dataSize} from 'powerful';
import * as crypto from 'crypto';
import * as gm from 'gm';
import {AlbumFile, AlbumFolder} from '../db/db';
import {IAlbumFile, IAlbumFolder} from '../db/interfaces';

/**
 * アルバムにファイルを追加します
 * @param appId 経由AppのID
 * @param userId 利用ユーザーのID
 * @param fileName ファイル名
 * @param mimetype ファイルのMIME Type
 * @param file 内容
 * @param size ファイルサイズ(byte)
 * @param folderId フォルダID
 * @param force trueに設定すると、ハッシュが同じファイルが見つかった場合でも無視してアルバムに登録します
 * @return 追加したファイルオブジェクト
 */
export default function(
	appId: string,
	userId: string,
	fileName: string,
	mimetype: string,
	file: Buffer,
	size: number,
	folderId: string = null,
	force: boolean = false
): Promise<IAlbumFile> {
	// ハッシュ生成
	const hash: string = crypto
		.createHash('sha256')
		.update(file)
		.digest('hex');

	return new Promise<IAlbumFile>((resolve, reject) => {
		if (!force) {
			// 同じハッシュ(と同じファイルサイズ(念のため))を持つファイルが既に存在するか確認
			AlbumFile.findOne({
				user: userId,
				isDeleted: false, // 削除されているファイルは除外する
				hash: hash,
				dataSize: size
			}, (hashmuchFileFindErr: any, hashmuchFile: IAlbumFile) => {
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
			// unconditionalがtrueの場合は強制登録
			register();
		}

		function register(): void {
			// アルバム使用量を取得するためにすべてのファイルを取得
			AlbumFile.find({user: userId}, (albumFilesFindErr: any, albumFiles: IAlbumFile[]) => {
				if (albumFilesFindErr !== null) {
					console.error(albumFilesFindErr);
					return reject(albumFilesFindErr);
				}

				// 現時点でのアルバム使用量を算出(byte)
				const used = albumFiles.map(albumFile => albumFile.dataSize).reduce((x, y) => x + y, 0);

				// 1000MBを超える場合
				if (used + size > dataSize.fromMiB(1000)) {
					return reject('no-free-space');
				}

				if (folderId !== null) {
					AlbumFolder.findById(folderId, (folderFindErr: any, folder: IAlbumFolder) => {
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

				function create(folder: IAlbumFolder = null): void {
					// AlbumFileドキュメントを作成
					AlbumFile.create({
						app: appId !== null ? appId : null,
						user: userId,
						folder: folder !== null ? folder.id : null,
						dataSize: size,
						mimeType: mimetype,
						name: fileName,
						serverPath: null,
						hash: hash
					}, (albumFileCreateErr: any, albumFile: IAlbumFile) => {
						if (albumFileCreateErr !== null) {
							console.error(albumFileCreateErr);
							return reject(albumFileCreateErr);
						}

						// 画像だった場合
						if (/^image\/.*$/.test(mimetype)) {
							// 幅と高さを取得してプロパティに保存しておく
							(<any>gm)(file, fileName)
							.size((getSizeErr: any, whsize: any) => {
								if (getSizeErr !== undefined && getSizeErr !== null) {
									console.error(getSizeErr);
									return save(albumFile);
								}
								albumFile.properties = {
									width: whsize.width,
									height: whsize.height
								};
								save(albumFile);
							});
						} else {
							save(albumFile);
						}
					});
				}
			});
		}

		function save(albumFile: IAlbumFile): void {
			albumFile.save((saveErr: any, saved: IAlbumFile) => {
				if (saveErr !== null) {
					console.error(saveErr);
					return reject(saveErr);
				}
				resolve(saved);
			});
		}
	});
}
