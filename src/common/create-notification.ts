import Notification from '../models/notification';
import event from '../event';

export default (
	app: any,
	userId: string,
	type: string,
	content: any
) => new Promise<any>((resolve, reject) => {
	Notification.create({
		app: app !== null ? app.id : null,
		user: userId,
		type: type,
		content: content
	}, (createErr, createdNotification) => {
		if (createErr !== null) {
			reject(createErr);
		} else {
			resolve(createdNotification);
			event.publishNotification(createdNotification);
		}
	});
});
