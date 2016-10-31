// TODO: インターバル以下の情報は0にする
// 例えばインターバルが1日に設定されていて、最初のレコードが9時だったとき、
// 次の日の「9時」以降にならないと1日経ったと判定されない
// (期待する動作は、次の日の0時以降で1日経ったと判定されてほしい
// X日の23時にレコードが作成されて、Y日の1時に次のレコードが作成された場合、
// 後者のレコードは前者のレコードの一日後ということにする
// なぜなら集計は指定されたインターバル(この場合なら1日単位)で行うため)
// 同様に考えて、たとえばインターバルが30分とかなら、秒の情報を切り捨てる

import * as mongodb from 'mongodb';

interface IOptions {
	interval: number;
	reset: boolean;
	aggregate: () => Promise<number>;
}

const db = <mongodb.Db>(<any>global).db;

export async function inc(name: string, id: any, options: IOptions): Promise<void> {
	await update(name, id, 1, true, options);
}

export async function dec(name: string, id: any, options: IOptions): Promise<void> {
	await update(name, id, -1, true, options);
}

export async function update(name: string, id: any, value: number, inc: boolean, options: IOptions): Promise<void> {
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
