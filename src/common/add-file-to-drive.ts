import * as mongodb from 'mongodb';
import * as crypto from 'crypto';
import * as gm from 'gm';
const fileType = require('file-type');
const prominence = require('prominence');
import DriveFile from '../models/drive-file';
import DriveFolder from '../models/drive-folder';

/**
 * ドライブにファイルを追加します
 * @param userId ユーザーID
 * @param fileName ファイル名
 * @param data 内容
 * @param comment ファイルの説明
 * @param type ファイルタイプ
 * @param folderId フォルダID
 * @param force trueに設定すると、ハッシュが同じファイルが見つかった場合でも無視してドライブに登録します
 * @return 追加したファイルオブジェクト
 */
export default (
	userId: mongodb.ObjectID,
	data: Buffer,
	name: string = null,
	comment: string = null,
	folderId: string = null,
	force: boolean = false
) => new Promise<any>(async (resolve, reject) =>
{
	// ファイルサイズ
	const size = data.byteLength;

	console.log(size);

	// ファイルタイプ
	let mime = 'application/octet-stream';
	const type = fileType(data);
	if (type !== null) {
		mime = type.mime;

		if (name === null) {
			name = `untitled.${type.ext}`;
		}
	} else {
		if (name === null) {
			name = 'untitled';
		}
	}

	console.log(mime);

	// ハッシュ生成
	const hash = <string>crypto
		.createHash('sha256')
		.update(data)
		.digest('hex');

	console.log(hash);

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
	const files = await DriveFile
		.find({user: userId}, {
			datasize: true,
			_id: false
		})
		.toArray();

	console.log(files);

	// 現時点でのドライブ使用量を算出(byte)
	const usage = files.map(file => file.datasize).reduce((x, y) => x + y, 0);

	console.log(usage);

	// 1GBを超える場合
	if (usage + size > 1073741824) {
		return reject('no-free-space');
	}

	// フォルダ指定時
	if (folderId !== null) {
		const folder = await DriveFolder
			.findOne({ _id: folderId });

		if (folder === null) {
			return reject('folder-not-found');
		} else if (folder.user !== userId) {
			return reject('folder-not-found');
		}
	}

	let properties: any = null;

	// 画像だった場合
	if (/^image\/.*$/.test(mime)) {
		// 幅と高さを取得してプロパティに保存しておく
		const g = gm(data, name);
		const size = await prominence(g).size();
		properties = {
			width: size.width,
			height: size.height
		};
	}

	console.log('createing...');

	// DriveFileドキュメントを作成
	const res = await DriveFile.insert({
		created_at: Date.now(),
		user: userId,
		folder: folderId,
		data: data,
		datasize: size,
		type: mime,
		name: name,
		comment: comment,
		hash: hash,
		properties: properties
	});

	const file = res.ops[0];

	resolve(file);
});
