import * as crypto from 'crypto';
import * as gm from 'gm';
import DriveFile from '../models/drive-file';
import DriveFolder from '../models/drive-folder';
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
) => new Promise<any>(async (resolve, reject) =>
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
		const much = await DriveFile.findOne({
			user: userId,
			hash: hash,
			datasize: size
		});

		if (much !== null) {
			resolve(much);
			return;
		}
	}

	// ドライブ使用量を取得するためにすべてのファイルを取得
	const driveFiles = await DriveFile
		.find({user: userId})
		.select({
			datasize: 1,
			_id: 0
		})
		.lean()
		.exec();

	// 現時点でのドライブ使用量を算出(byte)
	const used = driveFiles.map(driveFile => driveFile.datasize).reduce((x, y) => x + y, 0);

	// 1GBを超える場合
	if (used + size > 1073741824) {
		return reject('no-free-space');
	}

	// フォルダ指定時
	if (folderId !== null) {
		const folder = await DriveFolder.findById(folderId);
		if (folder === null) {
			return reject('folder-not-found');
		} else if (folder.user !== userId) {
			return reject('folder-not-found');
		}
	}

	// DriveFileドキュメントを作成
	const driveFile = await DriveFile.create({
		user: userId,
		folder: folderId,
		datasize: size,
		type: type,
		name: fileName,
		comment: comment,
		hash: hash
	});

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

	function save(driveFile: any): void {
		driveFile.save((saveErr: any, saved: any) => {
			if (saveErr !== null) {
				console.error(saveErr);
				return reject(saveErr);
			}
			resolve(saved);
		});
	}
});
