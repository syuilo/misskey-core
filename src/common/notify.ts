import * as mongo from 'mongodb';
import Notification from '../models/notification';
import serialize from '../serializers/notification';
import event from '../event';

export default (
	i: mongo.ObjectID,
	type: string,
	content: any
) => new Promise<any>(async (resolve, reject) => {

	const res = await Notification.insert(Object.assign({
		created_at: Date.now(),
		i: i,
		type: type
	}, content));

	const notification = res.ops[0];

	resolve(notification);

	event.notify(await serialize(notification));
});
