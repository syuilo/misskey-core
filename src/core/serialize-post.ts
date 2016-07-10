import {User, Post, PostLike, Repost, AlbumFile} from '../db/db';
import {IUser, IPost, IAlbumFile} from '../db/interfaces';

export default function serializePost(
	post: any,
	me: IUser = null,
	includeReply: boolean = true
): Promise<Object> {
	const postObj = post.toObject();

	return new Promise<Object>((resolve, reject) => {
		// 作者
		User.findById(post.user, (findUserErr: any, user: IUser) => {
			if (findUserErr !== null) {
				return reject(findUserErr);
			}
			postObj.user = user.toObject();

			switch (post.type) {
				case 'status':
					serializeStatus(resolve, reject, postObj, me);
					break;
				case 'reply':
					serializeReply(resolve, reject, postObj, me, includeReply);
					break;
				case 'repost':
					serializeRepost(resolve, reject, postObj, me);
					break;
				default:
					reject('unknown-post-type');
					break;
			}
		});
	});
}

function serializeStatus(
	resolve: any,
	reject: any,
	post: any,
	me: IUser = null
): void {
	common(post, me).then(postObj => {
		if (postObj.files === null) {
			return resolve(postObj);
		}
		// Get attached files
		Promise.all(postObj.files.map((fileId: string) => new Promise<Object>((resolve2, reject2) => {
			AlbumFile.findById(fileId, (findErr: any, file: IAlbumFile) => {
				if (findErr !== null) {
					reject2(findErr);
				} else {
					resolve2(file.toObject());
				}
			});
		})))
		.then(files => {
			postObj.files = files;
			resolve(postObj);
		}, (getFilesErr: any) => {
			reject(getFilesErr);
		});
	}, (serializeErr: any) => {
		reject(serializeErr);
	});
}

function serializeReply(
	resolve: any,
	reject: any,
	post: any,
	me: IUser = null,
	includeReply: boolean = true
): void {
	common(post, me).then(postObj => {
		// Get reply source
		if (includeReply) {
			Post.findById(postObj.inReplyToPost, (findReplyErr: any, inReplyToPost: IPost) => {
				if (findReplyErr !== null) {
					return reject(findReplyErr);
				}
				serializePost(inReplyToPost, me, false).then(serializedReply => {
					kyoppie(serializedReply);
				}, (serializedReplyErr: any) => {
					reject(serializedReplyErr);
				});
			});
		} else {
			kyoppie(postObj.inReplyToPost);
		}
		function kyoppie(inReplyToPost: any): void {
			postObj.inReplyToPost = inReplyToPost;
			if (postObj.files === null) {
				return resolve(postObj);
			}
			// Get attached files
			Promise.all(postObj.files.map((fileId: string) => new Promise<Object>((resolve2, reject2) => {
				AlbumFile.findById(fileId, (findErr: any, file: IAlbumFile) => {
					if (findErr !== null) {
						reject2(findErr);
					} else {
						resolve2(file.toObject());
					}
				});
			})))
			.then(files => {
				postObj.files = files;
				resolve(postObj);
			}, (getFilesErr: any) => {
				reject(getFilesErr);
			});
		}
	}, (serializeErr: any) => {
		reject(serializeErr);
	});
}

function serializeRepost(
	resolve: any,
	reject: any,
	post: any,
	me: IUser = null
): void {
	Post.findById(post.post, (findTargetErr: any, target: IPost) => {
		if (findTargetErr !== null) {
			return reject(findTargetErr);
		}
		serializePost(target, me).then(serializedTarget => {
			post.post = serializedTarget;
			resolve(post);
		}, (err: any) => {
			reject(err);
		});
	});
}

function common(
		post: any,
		me: IUser = null
): Promise<any> {
	return new Promise<Object>((resolve, reject) => {
		Promise.all<boolean, boolean>([
			// Get is liked
			new Promise<boolean>((getIsLikedResolve, getIsLikedReject) => {
				if (me === null) {
					return getIsLikedResolve(null);
				}
				PostLike.find({
					post: post.id,
					user: me.id
				}).limit(1).count((countErr: any, count: number) => {
					if (countErr !== null) {
						return getIsLikedReject(countErr);
					}
					getIsLikedResolve(count > 0);
				});
			}),
			// Get is reposted
			new Promise<boolean>((getIsRepostedResolve, getIsRepostedReject) => {
				if (me === null) {
					return getIsRepostedResolve(null);
				}
				Repost.find({
					type: 'repost',
					post: post.id,
					user: me.id
				}).limit(1).count((countErr: any, count: number) => {
					if (countErr !== null) {
						return getIsRepostedReject(countErr);
					}
					getIsRepostedResolve(count > 0);
				});
			})
		]).then(([isLiked, isReposted]) => {
			const serialized: any = post;
			serialized.isLiked = isLiked;
			serialized.isReposted = isReposted;
			resolve(serialized);
		},
		(serializedErr: any) => {
			reject(serializedErr);
		});
	});
}
