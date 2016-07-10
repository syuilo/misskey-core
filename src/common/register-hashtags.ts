import {Hashtag} from '../db/db';
import {IUser, IHashtag} from '../db/interfaces';

export default function(me: IUser, hashtags: string[]): void {
	hashtags.forEach(hashtag => {
		hashtag = hashtag.toLowerCase();
		Hashtag.findOne({
			name: hashtag
		}, (err: any, existHashtag: IHashtag) => {
			if (existHashtag === null) {
				Hashtag.create({
					name: hashtag,
					users: [me.id]
				});
			} else {
				const meExist: any[] = (<any>existHashtag.users).filter((id: any) => {
					return id.toString() === me.id.toString();
				});
				if (meExist.length === 0) {
					existHashtag.count++;
					(<any>existHashtag.users).push(me.id);
					existHashtag.markModified('users');
					existHashtag.save();
				}
			}
		});
	});
}
