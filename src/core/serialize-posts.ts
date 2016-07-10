import serializePost from './serialize-post';
import {IUser} from '../db/interfaces';

export default function(posts: any[], me: IUser = null): Promise<Object[]> {
	return Promise.all(posts.map(post => serializePost(post, me)));
}
