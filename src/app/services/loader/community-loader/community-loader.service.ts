import {Injectable} from '@angular/core';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {Tc} from '../../../utils';
import {ProxyService} from '../loader/proxy.service';
import {Company, Loader, LoaderConfig, LoaderUrlType, MarketsManager} from '../loader';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CommunityIdeaType,  CommunityNotification,  CommunityNotificationType,  CommunityFollowingIdea,  CommunityAuthorType,  AuthorType,  NotificationType,  IdeaType,  CommunityIdea,  CommunityMyIdea, IdeaAccessType, MyIdeaAccessType} from '../../data/community/community';
import {CommunityNotificationMessage} from '../../streaming/shared/message';
import {Interval} from 'tc-web-chart-lib';
import {LanguageService} from '../../state/language';
import {TcAuthenticatedHttpClient} from "../../../utils/app.tc-authenticated-http-client.service";


@Injectable()
export class CommunityLoaderService extends ProxiedUrlLoader {

    constructor(private tcAuthenticatedHttpClient: TcAuthenticatedHttpClient, private proxyService: ProxyService, private loader: Loader ,public marketsManager: MarketsManager,
                public languageService:LanguageService) {
        super(proxyService);
    }

    public getCommunityFollowingIdeas(): Observable<CommunityFollowingIdea[]> {
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityIdeas);

        Tc.info('community ideas list url: ' + url);

        return this.tcAuthenticatedHttpClient.getWithAuth(url).pipe(map((response: FollowingIdeasResponse) => {
            Tc.assert(response.success, 'Fail to get community ideas list');

            return this.processIdeas(response.response.stream);
        }));
    }

    public getCommunityNotifications(): Observable<CommunityNotification[]> {
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityNotifications);

        Tc.info('community notification list url: ' + url);

        return this.tcAuthenticatedHttpClient.getWithAuth(url).pipe(map((response: NotificationsResponse) => {
            Tc.assert(response.success, 'Fail to get community notification list ');

            return this.processNotifications(response.response.notifications);
        }));
    }

    public getCommunityMyIdeas(): Observable<CommunityMyIdea[]> {
      let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityMyIdeas);

      Tc.info('community my ideas list url: ' + url);

      return this.tcAuthenticatedHttpClient.getWithAuth(url).pipe(map((response: MyIdeasResponse) => {
        Tc.assert(response.success, 'Fail to get community my ideas list');

        return this.processMyIdeas(response.response.ideas);
      }));
    }

    public markNotificationsAsRead(notificationsId:string[]){
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.MarkNotificationsAsRead);

        Tc.info('Mark notification as read : ' + url);

        return this.tcAuthenticatedHttpClient.postWithAuth(url, {identifiers: notificationsId}).pipe(map((response:MarkAsReadResponse)=> {
                Tc.assert(response.success, 'Fail to mark community notifications as read');
            })).subscribe();
    }

    private processIdeas(IdeasResponse:  FollowingIdeaResponse[]): CommunityFollowingIdea[] {
        let communityIdeas: CommunityFollowingIdea[] = [];

        for (let ideaResponse of IdeasResponse) {
            let item: CommunityFollowingIdea = {
                name: ideaResponse.name,
                title: ideaResponse.title,
                description: ideaResponse.description,
                created: moment(ideaResponse.created).format('YYYY-MM-DD'),
                url: ideaResponse.url,
                thumbnailUrl: ideaResponse.thumbnail,
                videoUrl: ideaResponse.video_url,
                nickName: ideaResponse.nick_name,
                profileName: ideaResponse.profile_name,
                authorType: this.getAuthorType(ideaResponse.user_type),
                avatarUrl: ideaResponse.avatar,
                ideaType:this.getIdeaType(ideaResponse.result_type) ,
                updateText: ideaResponse.update_text,
                unread: ideaResponse.unread,
                company:this.getCompanyById(ideaResponse.company_id),
                intervalName:Interval.getIntervalNameFromCommunityServerMessage(ideaResponse.interval_name , ideaResponse.interval_repeat, this.languageService.arabic),
            };

            if(this.companyIncludedInUserSubscription(item.company)) {
                communityIdeas.push(item);
            }
        }

        return communityIdeas;
    }

    private companyIncludedInUserSubscription(company: Company): boolean{
      //Abu5, client can follow companies not included in his subscription.
      // in this case we will ignore all not exist companies
      if(company) {
        return true
      }
      return false;
    }

    private processMyIdeas(MyIdea: MyIdeaResponse[]): CommunityMyIdea[] {
        let communityMyIdeas: CommunityMyIdea[] = [];

        for (let myIdea of MyIdea) {
            let myIdeas: CommunityMyIdea = {
                name: myIdea.name,
                title: myIdea.title,
                description: myIdea.description,
                accessType: this.getIdeaAccessType(myIdea.access_type),
                created: moment(myIdea.created).format('YYYY-MM-DD'),
                url: myIdea.url,
                thumbnailUrl: myIdea.thumbnail,
                videoUrl: myIdea.video_url,
                nickName: myIdea.nick_name,
                profileName: myIdea.profile_name,
                authorType: this.getAuthorType(myIdea.user_type),
                avatarUrl: myIdea.avatar,
                company:this.getCompanyById(myIdea.company_id),
                intervalName:Interval.getIntervalNameFromCommunityServerMessage(myIdea.interval_name , myIdea.interval_repeat, this.languageService.arabic),
            };

            if(this.companyIncludedInUserSubscription(myIdeas.company)) {
              communityMyIdeas.push(myIdeas);
            }
        }

        return communityMyIdeas;
    }

    private processNotifications(notifications: NotificationResponse[]): CommunityNotification[] {

        let notificationList: CommunityNotification[] = [];

        for (let notification of notifications) {
            let item: CommunityNotification = {
                id: notification.identifier,
                avatarUrl: notification.avatar,
                nickName: notification.nick_name,
                profileName: notification.profile_name,
                authorType: this.getAuthorType(notification.user_type),
                notificationType: this.getNotificationType(notification.notification_type),
                read: notification.read,
                created: moment(notification.created).format('YYYY-MM-DD'),
            };

            let notificationTypeIsUserFollow:boolean = this.getNotificationType(notification.notification_type).type == NotificationType.USER_FOLLOW;

            if(Object.keys(notification.idea).length == 0 && !notificationTypeIsUserFollow) {
                Tc.error(`Community notification type "${notification.notification_type}" don't have Idea`);
            }

            if (!notificationTypeIsUserFollow) {
                item.idea = this.getNotificationIdeaData(notification);
            }

            notificationList.push(item);
        }

        return notificationList;
    }

    private getNotificationIdeaData(notification: NotificationResponse) :CommunityIdea {
        return {
            name: notification.idea.name,
            title: notification.idea.title,
            description: notification.idea.description,
            created: notification.idea.created,
            url: notification.idea.url,
            thumbnailUrl: notification.idea.thumbnail,
            videoUrl: notification.idea.video_url,
            nickName: notification.idea.nick_name,
            profileName: notification.idea.profile_name,
            authorType: this.getAuthorType(notification.idea.user_type),
            avatarUrl: notification.idea.avatar,
            company: this.getCompanyById(notification.idea.company_id),
            intervalName:Interval.getIntervalNameFromCommunityServerMessage(notification.idea.interval_name ,notification.idea.interval_repeat,this.languageService.arabic),
        }
    }

    public  mapMessageToCommunityNotifications(message: CommunityNotificationMessage):CommunityNotification {
        let notificationTypeIsUserFollow:boolean = this.getNotificationType(message.notification_type).type == NotificationType.USER_FOLLOW;
        let item: CommunityNotification = {
            id: message.identifier,
            avatarUrl: message.avatar,
            nickName: message.nick_name,
            profileName: message.profile_name,
            authorType: this.getAuthorType(message.user_type),
            notificationType: this.getNotificationType(message.notification_type),
            read: message.read != '0',
            created: moment(message.created).format('YYYY-MM-DD'),
        };

        if (!notificationTypeIsUserFollow) {
            item.idea = {
                name: message.idea_name,
                title: message.idea_title,
                description: message.idea_description,
                created: message.idea_created,
                url: message.idea_url,
                thumbnailUrl: message.idea_thumbnail,
                videoUrl: message.idea_video_url,
                nickName: message.idea_nick_name,
                profileName: message.idea_profile_name,
                authorType:this.getAuthorType(message.idea_user_type),
                avatarUrl: message.idea_avatar,
                company: this.getCompanyById(message.idea_company_id),
                intervalName:Interval.getIntervalNameFromCommunityServerMessage(message.interval_name , message.interval_repeat, this.languageService.arabic),
            }
        }

        return item;
    }

    public getCommunityUserProfileUrl(nickName: string): string {
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityUserProfileUrl);

        return url.replace('{1}', `${nickName}`);
    }

    public getCommunityIdeaUrl(ideaName: string): string {
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityIdeaUrl);

        return url.replace('{1}', `${ideaName}`);
    }

    public getCommunityCompaniesUrl(companyId: number): string {
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.CommunityCompanyUrl);

        return url.replace('{1}', `${companyId}`);
    }

    private getCompanyById(companyId:string):Company {
        return this.marketsManager.getCompanyById(+companyId) ;
    }

    private getAuthorType(authorType:string):CommunityAuthorType {
        switch (authorType) {
            case 'user':
                return {type: AuthorType.USER, arabicDescription: 'مستخدم', englishDescription: 'User',className:'user'};
                break;

            case 'analyst':
                return {type: AuthorType.ANALYST, arabicDescription: 'محترف', englishDescription: 'PRO',className:'analyst'};
                break;

            default:
                Tc.error(`Invalid community author type ${authorType}`);
        }
    }

    private getNotificationType(notificationType: string):CommunityNotificationType {
        switch (notificationType) {
            case 'user_follow':
                return {type: NotificationType.USER_FOLLOW, arabicDescription: 'تابع حسابك', englishDescription: 'Followed Your Account', className: 'user-follow'};
                break;

            case 'idea_like':
                return {type: NotificationType.IDEA_LIKE, arabicDescription: 'اعجبته فكرتك', englishDescription: 'Liked Your Idea', className: 'idea-like'};
                break;

            case 'idea_follow':
                return {type: NotificationType.IDEA_FOLLOW, arabicDescription: 'تابع فكرتك', englishDescription: 'Followed Your Idea', className: 'idea-follow'};
                break;

            case 'idea_comment':
                return {type: NotificationType.IDEA_COMMENT, arabicDescription: 'علق على فكرتك', englishDescription: 'Commented on Your Idea', className: 'idea-comment'};
                break;

            default:
                Tc.error(`Invalid community notification type ${notificationType}`);
        }
    }

    private getIdeaType(ideaType: string):CommunityIdeaType {

        switch (ideaType) {
            case 'idea':
                return {type: IdeaType.NEW, arabicDescription: 'فكرة جديدة', englishDescription: 'New Idea', className: 'new-idea'};
                break;

            case 'idea_updates':
                return {type: IdeaType.UPDATE, arabicDescription: 'تحديث فكرة', englishDescription: 'Updated Idea', className: 'edit-idea'};
                break;

            default:
                Tc.error(`Invalid community idea type ${ideaType}`);
        }
    }

    private getIdeaAccessType(ideaAccessType: string):MyIdeaAccessType {

        switch (ideaAccessType) {
            case 'public':
                return {accessType: IdeaAccessType.PUBLIC, arabicDescription: 'فكرة عامة', englishDescription: 'Public Idea', className: 'public-idea'};
                break;

            case 'private':
                return {accessType: IdeaAccessType.PRIVATE, arabicDescription: 'فكرة خاصة', englishDescription: 'Private Idea', className: 'private-idea'};
                break;

            default:
                Tc.error(`Invalid community idea access type ${ideaAccessType}`);
        }
    }

}

interface IdeaResponse {
    name: string,
    title: string,
    description: string,
    created: string,
    url: string,
    thumbnail: string,
    video_url: string,
    nick_name: string,
    profile_name: string,
    user_type: string,
    avatar: string,
    company_id: string,
    interval_name: string,
    interval_repeat:string,
}

interface FollowingIdeasResponse {
    success: boolean,
    response: {
        stream:  FollowingIdeaResponse[]
    }
}

interface FollowingIdeaResponse extends IdeaResponse{
    result_type: string,
    update_text: string,
    unread: boolean,
}

interface NotificationsResponse {
    success: boolean,
    response: {
        notifications: NotificationResponse[]
    }
}

interface MyIdeaResponse extends IdeaResponse{
    access_type: string,
}

interface NotificationResponse {
    identifier:string;
    avatar: string;
    nick_name: string
    profile_name: string
    user_type: string
    idea:IdeaResponse;
    notification_type: string
    read: boolean
    created: string
}

interface MyIdeasResponse {
    success: boolean,
    response: {
        ideas: MyIdeaResponse[]
    }
}

interface MarkAsReadResponse {
    success: boolean,
}
