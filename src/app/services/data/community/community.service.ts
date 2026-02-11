import {Injectable} from '@angular/core';
import {CommunityLoaderService} from '../../loader/community-loader/community-loader.service';
import {Observable, Subject} from 'rxjs';
import {CommunityNotification, CommunityFollowingIdea, CommunityMyIdea} from './community';
import {Loader} from '../../loader/loader';
import {FeatureType} from '../../auhtorization/feature';
import {AuthorizationService} from '../../auhtorization';
import {MarketsManager} from '../../loader';
import {Streamer} from '../../streaming';
import {CommunityNotificationMessage} from '../../streaming/shared/message';

@Injectable()
export class CommunityService {

    private notifications:CommunityNotification[];
    private notificationsHistoryStream: Subject<CommunityNotification[]>;

    constructor(private loader: Loader, private communityLoaderService: CommunityLoaderService, private authorizationService:AuthorizationService,
                private marketsManager:MarketsManager ,  streamer:Streamer) {

        this.notificationsHistoryStream = new Subject<CommunityNotification[]>();

        this.loader.isLoadingDoneStream().subscribe(loadingDone => {
            if (loadingDone) {
                this.authorizationService.authorizeService(FeatureType.COMMUNITY, () => {

                    this.communityLoaderService.getCommunityNotifications().subscribe((notifications: CommunityNotification[]) => {
                        this.notifications = notifications;
                        this.notificationsHistoryStream.next(this.notifications);
                    });

                    streamer.getGeneralPurposeStreamer().subscribeCommunityNotifications(loader.getUserInfo().userId);
                    streamer.getGeneralPurposeStreamer().getCommunityNotificationsStreamer().subscribe(message => this.onNotificationStreamerMessage(message));
                });
            }
        });

    }

    public getFollowingIdeas(): Observable<CommunityFollowingIdea[]> {
        return this.communityLoaderService.getCommunityFollowingIdeas();
    }

    public getMyIdeas(): Observable<CommunityMyIdea[]> {
        return this.communityLoaderService.getCommunityMyIdeas();
    }

    public getNotificationsStream(): Subject<CommunityNotification[]> {
        return this.notificationsHistoryStream;
    }

    private onNotificationStreamerMessage(message: CommunityNotificationMessage) {
        let newNotification :CommunityNotification = this.communityLoaderService.mapMessageToCommunityNotifications(message);
        this.updateNotification(newNotification);
    }

    private updateNotification(newNotification:CommunityNotification) {
        this.notifications = [newNotification,...this.notifications];
        this.notificationsHistoryStream.next(this.notifications);
    }

    public getNumberOfUnreadNotification():number {
        let unreadNotifications = this.notifications.filter(notification => notification.read == false);
        return unreadNotifications.length;
    }

    public markNotificationsAsRead(): void {

        let self = this;
        setTimeout(function () {
            let unReadNotifications: string[] = [];
            self.notifications.map(notification => {
                if (!notification.read) {
                    notification.read = true;
                    unReadNotifications.push(notification.id);
                }
            });

            if (unReadNotifications.length > 0) {
                self.notifications = [...self.notifications];
                self.notificationsHistoryStream.next(self.notifications);
                self.communityLoaderService.markNotificationsAsRead(unReadNotifications);
            }
        }, 3 * 1000);

    };

    public communityUserProfileUrl(nickName:string):string {
        return this.communityLoaderService.getCommunityUserProfileUrl(nickName);
    }

    public communityIdeaUrl(ideaName:string):string {
        return this.communityLoaderService.getCommunityIdeaUrl(ideaName);
    }

    public communityCompaniesUrl(companyId:number):string{
        return this.communityLoaderService.getCommunityCompaniesUrl(companyId);
    }
}
