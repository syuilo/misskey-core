import {Notification} from '../db/db';
import {IApplication, INotification} from '../db/interfaces';
import event from '../event';

export default function(
	app: IApplication,
	userId: string,
	type: string,
	content: any
): Promise<INotification> {
	return new Promise<INotification>((resolve, reject) => {
		Notification.create({
			app: app !== null ? app.id : null,
			user: userId,
			type: type,
			content: content
		}, (createErr: any, createdNotification: INotification) => {
			if (createErr !== null) {
				reject(createErr);
			} else {
				resolve(createdNotification);
				event.publishNotification(createdNotification);
			}
		});
	});
}
