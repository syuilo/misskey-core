import * as mongodb from 'mongodb';
import * as crypto from 'crypto';
import * as gm from 'gm';
const fileType = require('file-type');
const prominence = require('prominence');
import DriveFile from '../models/drive-file';
import DriveFolder from '../models/drive-folder';
import serialize from '../serializers/drive-file';
import event from '../event';
import es from '../db/elasticsearch';

/**
 * ドライブにファイルを追加します
 *
 * @param user ユーザー
 * @param fileName ファイル名
 * @param data 内容
 * @param comment ファイルの説明
 * @param type ファイルタイプ
 * @param folderId フォルダID
 * @param force trueに設定すると、ハッシュが同じファイルが見つかった場合でも無視してドライブに登録します
 * @return 追加したファイルオブジェクト
 */
export default (
	user: any,
	data: Buffer,
	name: string = null,
	comment: string = null,
	folderId: mongodb.ObjectID = null,
	force: boolean = false
) => new Promise<any>(async (resolve, reject) =>
{
	// ファイルサイズ
	const size = data.byteLength;

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

	// ハッシュ生成
	const hash = <string>crypto
		.createHash('sha256')
		.update(data)
		.digest('hex');

	if (!force) {
		// 同じハッシュ(と同じファイルサイズ(念のため))を持つファイルが既に存在するか確認
		const much = await DriveFile.findOne({
			user: user._id,
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
		.find({ user: user._id }, {
			datasize: true,
			_id: false
		})
		.toArray();

	// 現時点でのドライブ使用量を算出(byte)
	const usage = files.map(file => file.datasize).reduce((x, y) => x + y, 0);

	// 容量を超える場合
	if (usage + size > user.drive_capacity) {
		return reject('no-free-space');
	}

	// フォルダ指定時
	let folder: any = null;
	if (folderId !== null) {
		folder = await DriveFolder
			.findOne({
				_id: folderId,
				user: user._id
			});

		if (folder === null) {
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

	// DriveFileドキュメントを作成
	const res = await DriveFile.insert({
		created_at: new Date(),
		user: user._id,
		folder: folder !== null ? folder._id : null,
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

	// Serialize
	const fileObj = await serialize(file);

	// Publish drive_file_created event
	event(user._id, 'drive_file_created', fileObj);

	// Register to search database
	es.index({
		index: 'misskey',
		type: 'drive_file',
		id: file._id.toString(),
		body: {
			name: file.name,
			user: user._id.toString()
		}
	});
});
