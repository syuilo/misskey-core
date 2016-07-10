import * as mongoose from 'mongoose';
import config from '../config';

const db = mongoose.createConnection(config.mongo.uri, config.mongo.options);

import driveFile from './schemas/drive-file';
import driveFolder from './schemas/drive-folder';
import driveTag from './schemas/drive-tag';
import application from './schemas/application';
import hashtag from './schemas/hashtag';
import notification from './schemas/notification';
import post from './schemas/post';
import postMention from './schemas/post-mention';
import * as talk from './schemas/talk-message';
import talkGroup from './schemas/talk-group';
import talkGroupInvitation from './schemas/talk-group-invitation';
import {talkHistory, talkUserHistory, talkGroupHistory} from './schemas/talk-history';
import user from './schemas/user';
import following from './schemas/following';

/* tslint:disable:variable-name */
export const DriveFile = driveFile(db);
export const DriveFolder = driveFolder(db);
export const DriveTag = driveTag(db);
export const Application = application(db);
export const Hashtag = hashtag(db);
export const Notification = notification(db);
export const Post = post(db);
export const PostMention = postMention(db);
export const TalkMessage = talk.message(db);
export const TalkUserMessage = talk.userMessage(db);
export const TalkGroupMessageBase = talk.groupMessageBase(db);
export const TalkGroupMessage = talk.groupMessage(db);
export const TalkGroupSendInvitationActivity = talk.groupSendInvitationActivity(db);
export const TalkGroupMemberJoinActivity = talk.groupMemberJoinActivity(db);
export const TalkGroupMemberLeftActivity = talk.groupMemberLeftActivity(db);
export const TalkRenameGroupActivity = talk.renameGroupActivity(db);
export const TalkTransferGroupOwnershipActivity = talk.transferGroupOwnershipActivity(db);
export const TalkHistory = talkHistory(db);
export const TalkUserHistory = talkUserHistory(db);
export const TalkGroupHistory = talkGroupHistory(db);
export const TalkGroup = talkGroup(db);
export const TalkGroupInvitation = talkGroupInvitation(db);
export const User = user(db);
export const Following = following(db);
