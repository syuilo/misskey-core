import * as mongodb from 'mongodb';

export default ((global as any).db as mongodb.Db).collection('drive_files');

export function validateFileName(name: string): boolean {
	return (
		(name.trim().length > 0) &&
		(name.length <= 128) &&
		(name.indexOf('\\') === -1) &&
		(name.indexOf('/') === -1) &&
		(name.indexOf('..') === -1)
	);
}
