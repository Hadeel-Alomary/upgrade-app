import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';
import {
  AuthorType,
  CommunityAuthorType,
  CommunityIdea,
  MyIdeaAccessType,
  CommunityMyIdea
} from '../../../../services/data/community/community';
import {CommunityService} from '../../../../services/data/community/community.service';
import {AppBrowserUtils, MarketUtils} from '../../../../utils';
import {Company} from '../../../../services/loader/loader';
import {ContextMenuItem,} from '../community-context-menu/community-context-menu.component';
import {SharedChannel} from '../../../../services/shared-channel';
import {Subscription} from 'rxjs';
import {Accessor} from '../../../../services/accessor';

@Component({
    selector: 'my-ideas',
    templateUrl: './my-ideas.component.html',
    styleUrls: ['./my-ideas.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MyIdeasComponent {

    myIdeas: CommunityMyIdea[];

    waitingSubscription:Subscription;

    constructor(public accessor: Accessor, public cd:ChangeDetectorRef, public communityService: CommunityService ,public sharedChannel: SharedChannel) {

        this.waitingSubscription = this.communityService.getMyIdeas().subscribe((myIdeas: CommunityMyIdea[]) => {
            if (myIdeas) {
                this.myIdeas = myIdeas;
                this.cd.markForCheck();
            }
        });
    }

    getSymbolWithoutMarket(company:Company):string {
       return MarketUtils.symbolWithoutMarket(company.symbol);
    }

    openUserProfileOnCommunity(nickName: string) {
        let url = this.communityService.communityUserProfileUrl(nickName);
        window.open(url, '_blank');
    }

    openIdeaOnCommunity(ideaName:string) {
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

    showContextMenu(event: MouseEvent, idea: CommunityMyIdea) {
        if (AppBrowserUtils.isDesktop()) {
            this.contextMenu = {
                left:event.clientX, top: event.clientY,
                item:  {
                    idea:{
                        ideaName: idea.name,
                        ideaCompany: idea.company,
                    },
                    authorNickName: idea.nickName,
                    profileName:idea.profileName,
                }
            };
            this.cd.markForCheck();
        }
    }

    getCompanyName(company:Company):string {
        return this.accessor.languageService.arabic? company.arabic: company.english;
    }

    getIdeaAccessTypeDescription(ideaType: MyIdeaAccessType) : string {
        return this.accessor.languageService.arabic? ideaType.arabicDescription : ideaType.englishDescription;
    }

    getAuthorTypeDescription(authorType: CommunityAuthorType) : string {
        return this.accessor.languageService.arabic? authorType.arabicDescription : authorType.englishDescription;
    }
}


