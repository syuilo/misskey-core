import * as mongo from 'mongodb';
import Notification from '../models/notification';
import event from '../event';
import serialize from '../serializers/notification';

export default (
	i: mongo.ObjectID,
	type: string,
	content: any
) => new Promise<any>(async (resolve, reject) => {

	// Create notification
	const res = await Notification.insert(Object.assign({
		created_at: new Date(),
		i: i,
		type: type
	}, content));

	const notification = res.ops[0];

	resolve(notification);

	// Publish notification event
	event(notification.i, 'notification', await serialize(notification));
});
