import Post from '../models/post';
import serializeUser from './user';
import serializeDriveFile from './drive-file';

const self = (
	post: any,
	me: any,
	options?: {
		serializeReplyTo: boolean
	}
) => new Promise<Object>(async (resolve, reject) =>
{
	const opts = options || {
		serializeReplyTo: true
	};

	if (typeof post === 'string') {
		post = await Post.findById(post).lean().exec();
	}

	post.id = post._id;
	delete post._id;
	delete post.__v;

	post.user = await serializeUser(post.user, me);

	if (post.files) {
		post.files = await (<string[]>post.files).map(async (file) => {
			return await serializeDriveFile(file);
		});
	}

	if (post.reply_to && opts.serializeReplyTo) {
		post.reply_to = await self(post.reply_to, me, {
			serializeReplyTo: false
		});
	}

	if (post.repost) {
		post.repost = await self(post.repost, me);
	}

	resolve(post);
});

export default self;
