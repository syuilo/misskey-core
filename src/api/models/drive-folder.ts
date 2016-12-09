import * as mongodb from 'mongodb';

export default ((global as any).db as mongodb.Db).collection('drive_folders');

export function isValidFolderName(name: string): boolean {
	return (
		(name.trim().length > 0) &&
		(name.length <= 200)
	);
}
