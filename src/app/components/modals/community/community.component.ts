import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';
import {ChannelListener} from '../shared/channel-listener';
import {ChannelRequest} from '../../../services/shared-channel/channel-request';
import {ChannelRequestType, SharedChannel} from '../../../services/shared-channel';
import {CommunityTabType} from './CommunityTabType';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CommunityService} from '../../../services/data/community/community.service';
import {CommunityNotification} from '../../../services/data/community/community';

@Component({
    selector: 'community-windows',
    templateUrl: './community.component.html',
    styleUrls: ['./community.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('expandChanged', [
            state('expanded', style({
                width:"*",
                overflow: 'visible'
           })),
            state('collapsed', style({
                width:'0',
                overflow: 'hidden'
            })),
            transition('collapsed => expanded', animate('200ms linear')),
            transition('expanded => collapsed', animate('200ms linear'))
        ])
    ]
})
export class CommunityComponent extends ChannelListener<ShowCommunityWindowRequest> implements AfterViewInit{
    isWindowShown: boolean = false;
    communityTabType:CommunityTabType = null;

    private lastOpenedTab: CommunityTabType = null;

    notifications:CommunityNotification[];

    constructor(public cd:ChangeDetectorRef, sharedChannel: SharedChannel, public communityService: CommunityService) {
        super(sharedChannel, ChannelRequestType.CommunityWindows);
    }

    ngAfterViewInit(): void {
        this.subscriptions.push(
            this.communityService.getNotificationsStream().subscribe((notifications:CommunityNotification[]) => {
                if(notifications) {
                    this.notifications = notifications;
                    this.cd.markForCheck();

                    if(this.isNotificationsTabOpened() &&  this.isWindowShown) {
                        this.markNotificationsAsRead();
                    }
                }
            })
        );
    }

    protected onChannelRequest(): void {
        this.communityTabType = this.channelRequest.communityTabType;

        this.isWindowShown = this.getWindowNewVisibleState();

        this.lastOpenedTab = this.communityTabType;

        this.cd.markForCheck();

        if(this.isNotificationsTabOpened() &&  this.isWindowShown) {
            this.markNotificationsAsRead();
        }
    }

    finishExpanding() {
        if(!this.isWindowShown && this.communityTabType){//Collapsed
            //Ehab If collapsed reset communityTabType so next open will make new http to refresh data
            this.communityTabType = null;
        }
        this.cd.markForCheck();
    }

    getWindowNewVisibleState() {
        if(this.isWindowShown) {
            return this.communityTabType != this.lastOpenedTab;
        }

        return true;
    }

    getWindowTitle() {
        if(this.isIdeasTabOpened()){
            return  'متابعة الأفكار';
        }else if(this.isNotificationsTabOpened()){
            return  'متابعة الإشعارات';
        }else if(this.isMyIdeasTabOpened()){
            return  'أفكاري';
        }
    }

    getIconClassName() {
        if(this.isIdeasTabOpened()){
            return 'ideas-icon';
        }else if(this.isNotificationsTabOpened()){
           return 'notifications-icon';
        }else if(this.isMyIdeasTabOpened()){
           return 'my-ideas-icon';
        }
    }

    isIdeasTabOpened():boolean {
        return this.communityTabType == CommunityTabType.Ideas;
    }

    isNotificationsTabOpened() {
        return this.communityTabType == CommunityTabType.Notifications;
    }

    isMyIdeasTabOpened():boolean {
        return this.communityTabType == CommunityTabType.MyIdeas;
    }

    closeWindow() {
        this.isWindowShown = false;
        this.channelRequest.caller.onCloseWindow();
    }

    private markNotificationsAsRead() {
        this.communityService.markNotificationsAsRead();
    }

}

export interface ShowCommunityWindowRequest extends ChannelRequest{
    communityTabType: CommunityTabType;
    caller:CommunityWindowCaller;
}

export interface CommunityWindowCaller {
    onCloseWindow():void;
}
