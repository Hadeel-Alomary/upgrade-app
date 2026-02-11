import {Company} from '../../loader/loader';

export interface CommunityIdea {
    name: string,
    title: string,
    description: string,
    created: string,
    url: string,
    thumbnailUrl: string,
    videoUrl: string,
    nickName: string,
    profileName: string,
    authorType: CommunityAuthorType,
    avatarUrl: string,
    company: Company,
    intervalName:string,
}

export interface CommunityFollowingIdea extends CommunityIdea{
    ideaType: CommunityIdeaType,
    updateText: string,
    unread: boolean,
}

export interface CommunityMyIdea extends CommunityIdea{
    accessType: MyIdeaAccessType,
}

export interface CommunityNotification {
    id:string,
    avatarUrl: string,
    nickName: string,
    profileName: string,
    authorType: CommunityAuthorType,
    notificationType: CommunityNotificationType,
    idea?: CommunityIdea,
    read: boolean,
    created: string,
}

export interface CommunityAuthorType {
    type: AuthorType;
    arabicDescription: string;
    englishDescription: string;
    className: string;
}

export enum  AuthorType {
    USER = 1,
    ANALYST ,
}

export interface CommunityNotificationType {
    type: NotificationType;
    arabicDescription: string;
    englishDescription: string;
    className: string;
}

export enum  NotificationType {
    USER_FOLLOW = 1,
    IDEA_LIKE,
    IDEA_FOLLOW,
    IDEA_COMMENT,
}

export interface CommunityIdeaType {
  type: IdeaType;
  arabicDescription: string;
  englishDescription: string;
  className: string;
}

export enum IdeaType {
    NEW = 1,
    UPDATE,
}

export interface MyIdeaAccessType {
  accessType: IdeaAccessType;
  arabicDescription: string;
  englishDescription: string;
  className: string;
}

export enum  IdeaAccessType {
  PUBLIC = 1,
  PRIVATE,
}


