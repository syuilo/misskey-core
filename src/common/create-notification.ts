import Notification from '../models/notification';
import event from '../event';

export default (
	userId: string,
	type: string,
	content: any
) => new Promise<any>(async (resolve, reject) => {

	const res = await Notification.insert({
		created_at: Date.now(),
		user: userId,
		type: type,
		content: content
	});

	const notification = res.ops[0];

	resolve(notification);

	event.notification(notification);
});
