import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from '@angular/core';
import {CommunityService} from '../../../../services/data/community/community.service';
import {Company} from '../../../../services/loader/loader';
import {AuthorType, CommunityAuthorType, CommunityNotification, CommunityIdea, CommunityNotificationType} from '../../../../services/data/community/community';
import {AppBrowserUtils, MarketUtils} from '../../../../utils';
import {ContextMenuItem,} from '../community-context-menu/community-context-menu.component';
import {SharedChannel} from '../../../../services/shared-channel';
import {Accessor} from '../../../../services/accessor';

@Component({
    selector: 'following-notifications',
    templateUrl: './following-notifications.component.html',
    styleUrls: ['./following-notifications.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class FollowingNotificationsComponent  {

    @Input() notifications:CommunityNotification[];

    constructor(public accessor: Accessor, public communityService: CommunityService ,public sharedChannel: SharedChannel , public cd:ChangeDetectorRef) {}

    highlightNewNotification(notification: CommunityNotification): string {
        if(!notification.read) {
            return "new-notification";
        }
        return null;
    }

    getCompanyName(company:Company):string {
        return this.accessor.languageService.arabic? company.arabic: company.english;
    }

    getSymbolWithoutMarket(company:Company):string {
        return MarketUtils.symbolWithoutMarket(company.symbol);
    }

    openUserProfileOnCommunity(nickName: string) {
        let url = this.communityService.communityUserProfileUrl(nickName);
        window.open(url, '_blank');
    }

    openIdeaPageOnCommunity(ideaName:string) {
        let url = this.communityService.communityIdeaUrl(ideaName);
        window.open(url, '_blank');
    }

    openCompanyPageInCommunity(companyId:number) {
        let url = this.communityService.communityCompaniesUrl(companyId);
        window.open(url, '_blank');
    }

    showVideoPlayerIcon(idea: CommunityIdea):boolean {
        return idea.videoUrl !== '';
    }

    authorTypeIsUser(authorType: CommunityAuthorType) {
        return authorType.type == AuthorType.USER;
    }

    contextMenu : { left: number, top: number, item: ContextMenuItem } = {left: 0, top: 0, item: null};

    showContextMenu(event: MouseEvent, notification:CommunityNotification) {
        if (AppBrowserUtils.isDesktop()) {
            this.contextMenu = {
                left: event.clientX, top: event.clientY,
                item: {idea: null, profileName: notification.profileName, authorNickName: notification.nickName}
            };
            if (notification.idea) {
                this.contextMenu.item.idea = {
                    ideaName: notification.idea.name,
                    ideaCompany: notification.idea.company,
                };
            }
            this.cd.markForCheck();
        }
    }

    getNotificationTypeDescription(notificationType: CommunityNotificationType) : string {
        return this.accessor.languageService.arabic? notificationType.arabicDescription : notificationType.englishDescription;
    }

    getAuthorTypeDescription(authorType: CommunityAuthorType) : string {
        return this.accessor.languageService.arabic? authorType.arabicDescription : authorType.englishDescription;
    }

}



