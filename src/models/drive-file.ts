export interface DriveFile {
	comment:    string;
	created_at: Date;
	data:       Buffer;
	datasize:   number;
	folder:     string;
	type:       string;
	hash:       string;
	name:       string;
	properties: any;
	tags:       string[];
	user:       string;
}

export default (<any>global).db.collection('drive_files');
