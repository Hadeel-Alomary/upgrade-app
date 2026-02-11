import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {SymbolBoxOpenRequest} from '../../../../services/shared-channel/channel-request';
import {ChannelRequestType} from '../../../../services/shared-channel';
import {GridBoxType} from '../../../shared/grid-box';
import {Accessor, CommunityService} from '../../../../services';
import {Company} from '../../../../services/loader/loader';

@Component({
    selector: 'community-context-menu',
    templateUrl: './community-context-menu.component.html',
    styleUrls: ['./community-context-menu.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CommunityContextMenuComponent {

    @Input() contextMenu: { left: number, top: number, item: ContextMenuItem };
    @Output() onOpenUserProfilePage = new EventEmitter<string>();
    @Output() onOpenIdeaPage = new EventEmitter<string>();
    @Output() onOpenCompanyPage = new EventEmitter<number>();

    constructor(public cd: ChangeDetectorRef, public accessor: Accessor, public communityService: CommunityService) {
    }

    public getContextMenuItem(): ContextMenuItem {
        return this.contextMenu.item;
    }

    getContextMenuIdeaItem(): ContextMenuIdeaItem {
        if( this.getContextMenuItem()) {
            return this.getContextMenuItem().idea;
        }
    }

    getContextMenuAuthorPageItemText(profileName: string) : string {
        let arabicProfile: string = `مشاهدة صفحة " ${profileName} " في مجتمع تكرتشارت`;
        let englishProfile: string = `View " ${profileName} " Page in TickerChart Community`;
        return this.accessor.languageService.arabic? arabicProfile: englishProfile;
    }

    getContextMenuAuthorNickNameItem(): string {
        if( this.getContextMenuItem()) {
            return this.getContextMenuItem().authorNickName;
        }
    }

    public openWindow(window: GridBoxType): void {
        let ideaItem: ContextMenuIdeaItem = this.getContextMenuIdeaItem();
        let openRequest: SymbolBoxOpenRequest = {
            type: ChannelRequestType.OpenSymbol,
            gridBoxType: window,
            symbol: ideaItem.ideaCompany.symbol
        };
        this.accessor.sharedChannel.request(openRequest);
    }

    openIdeaOnCommunity() {
        this.onOpenIdeaPage.emit(this.getContextMenuIdeaItem().ideaName);
    }

    openUserProfileOnCommunity() {
        this.onOpenUserProfilePage.emit(this.getContextMenuAuthorNickNameItem());
    }


    openCompanyPageInCommunity() {
        this.onOpenCompanyPage.emit(this.getContextMenuIdeaItem().ideaCompany.id);
    }
}

export interface ContextMenuItem {
    idea : ContextMenuIdeaItem,
    profileName:string,
    authorNickName: string,
}

export interface ContextMenuIdeaItem {
    ideaName: string
    ideaCompany: Company,
}
