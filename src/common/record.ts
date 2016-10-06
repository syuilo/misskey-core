import * as mongodb from 'mongodb';

interface IOptions {
	interval: number;
	reset: boolean;
	aggregate: () => Promise<number>;
}

const db = <mongodb.Db>(<any>global).db;

export async function inc(name: string, id: any, options: IOptions) {
	await update(name, id, 1, true, options);
}

export async function dec(name: string, id: any, options: IOptions) {
	await update(name, id, -1, true, options);
}

export async function update(name: string, id: any, value: number, inc: boolean, options: IOptions) {
	const collection = db.collection(`record_of_${name}`);

	const record = await collection.findOne({ key: id });

	if (record) {
		if (Date.now() - record.at.getTime() > options.interval) {
			collection.insert({
				at: new Date(),
				count: options.reset ? value : record.count + value
			});
		} else {
			collection.updateOne({ key: id }, { $set: {
				at: new Date(),
				count: record.count + value
			}});
		}
	} else {
		const count = await options.aggregate();
		collection.insert({
			at: new Date(),
			count: count
		});
	}
}