import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AppModeAuthorizationService, AuthorizationService, ChannelRequest, ChannelRequestType, CommunityService, MarketsManager, PageService, SharedChannel, TradingService} from '../../../services/index';
import {GridBoxType} from '../../shared/grid-box/index';
import {SubscriptionLike as ISubscription} from 'rxjs';
import {Feature, FeatureType} from '../../../services/auhtorization/feature';
import {CommunityTabType} from '../../modals/community/CommunityTabType';
import {CommunityWindowCaller, ShowCommunityWindowRequest} from '../../modals/community/community.component';
import {BrokerType} from '../../../services/trading/broker/broker';
import {FeatureGridBox} from '../../../services/auhtorization/feature-grid-box';
import {AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';
import {UpgradeMessageChannelRequest, UpgradeMessageType} from '../../modals/popup/upgrade-message';
import {AccessType} from '../../../services/auhtorization/access-type';

@Component({
    selector: 'window-toolbar',
    templateUrl:'./window-toolbar.component.html',
    styleUrls:['./window-toolbar.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('expandTools', [
            state('expanded', style({
                height: '135px'
            })),
            state('collapsed',   style({
                height: '0px'
            })),
            transition('collapsed => expanded', animate('500ms linear')),
            transition('expanded => collapsed', animate('500ms linear'))
        ]),
        trigger('expandCompanyWindows', [
            state('expanded', style({
                height: '*'
            })),
            state('collapsed',   style({
                height: '0px'
            })),
            transition('collapsed => expanded', animate('500ms linear')),
            transition('expanded => collapsed', animate('500ms linear'))
        ]),
        trigger('expandMarketWindows', [
            state('expanded', style({
                height: '*'
            })),
            state('collapsed',   style({
                height: '0px'
            })),
            transition('collapsed => expanded', animate('500ms linear')),
            transition('expanded => collapsed', animate('500ms linear'))
        ]),
        trigger('expandTradingWindows', [
            state('expanded', style({
                height: '*'
            })),
            state('collapsed',   style({
                height: '0px'
            })),
            transition('collapsed => expanded', animate('500ms linear')),
            transition('expanded => collapsed', animate('500ms linear'))
        ]),
        trigger('expandCommunityWindows', [
            state('expanded', style({
                height: '*'
            })),
            state('collapsed',   style({
                height: '0px'
            })),
            transition('collapsed => expanded', animate('500ms linear')),
            transition('expanded => collapsed', animate('500ms linear'))
        ]),
    ],
    host: {
        '(window:resize)': 'onResize($event)'
    }
})

export class WindowToolbarComponent implements CommunityWindowCaller, OnDestroy {
    toolsExpanded = false;
    marketWindowsExpanded = true;
    companyWindowsExpanded = false;
    tradingWindowsExpanded = false;
    communityWindowsExpanded = false;

    showTradingWindows:boolean;

    unreadCommunityNotificationsCounter:number = 0;

    subscriptions:ISubscription[] = [];

    FeatureType = FeatureType;
    appModeFeatureType = AppModeFeatureType;

    constructor( public sharedChannel:SharedChannel,
                 public cd:ChangeDetectorRef,
                 public tradingService:TradingService,
                 public pageService:PageService,
                 public authorizationService:AuthorizationService,
                 public communityService:CommunityService,
                 public marketsManager: MarketsManager,
                 public appModeAuthorizationService: AppModeAuthorizationService) {
        this.subscriptions.push(this.tradingService.getSessionStream()
            .subscribe(validSession => this.onTradingSession(validSession)));

        this.subscriptions.push(
            this.communityService.getNotificationsStream().subscribe(notifications => {
                if(notifications) {
                    this.unreadCommunityNotificationsCounter = this.communityService.getNumberOfUnreadNotification();
                    this.cd.markForCheck();
                }
            })
        );

    }

    ngOnDestroy(){
        for(let subscription of this.subscriptions){
            subscription.unsubscribe();
        }
        this.subscriptions = [];
    }

    @Output() outputAddSymbolBox = new EventEmitter();
    @Output() outputAddMarketBox = new EventEmitter();

    onTradingSession(session:boolean){
         this.showTradingWindows = session;
         if(!this.showTradingWindows && this.tradingWindowsExpanded){
             this.onExpandMarketWindows();
         }

         this.cd.markForCheck();
    }

    // MA Bringing enum in template: https://github.com/angular/angular/issues/2885
     gridBoxType = GridBoxType;

    /* template helper */
     maxHeight():string {
        return (window.innerHeight - 40 * 2) + 'px'; // for summary and footer
    }

     windowHeight():number {
        return window.innerHeight - ((40 * 2) + (30 * 3));
    }

    /* interactive events */

     onOpenWatchlist() {
        this.sendChannelRequest({type: ChannelRequestType.WatchlistProperties});
    }

    private sendChannelRequest(channelRequest: ChannelRequest) {
        this.sharedChannel.request(channelRequest);
    }

    onOpenAlert(){
         this.authorizationService.authorize(FeatureType.ALERT, () => {
             this.sendChannelRequest({type:ChannelRequestType.AlertCenter});
         });
    }

     onOpenFilter(){
         this.authorizationService.authorize(FeatureType.FILTER, () => {
             this.sendChannelRequest({type:ChannelRequestType.FilterProperties});
         });
    }

    onAddSymbolBox(type: GridBoxType) {
         this.authorizeGridBoxType(type, () => {
             this.outputAddSymbolBox.emit(type);
         })
    }

     onAddMarketBox(type:GridBoxType) {
         this.authorizeGridBoxType(type, () => {
             this.outputAddMarketBox.emit(type);
         })
    }

    onToggleTradingToolbar(){
        this.sendChannelRequest({type:ChannelRequestType.TradingFloatingToolbar});
    }

    onShowSettingsModal(){
        let settingsModalType: ChannelRequestType = null;
        switch (this.tradingService.getBrokerType()) {
            case BrokerType.VirtualTrading:
                settingsModalType = ChannelRequestType.VirtualTradingSettings;
                break;
            case BrokerType.Tradestation:
                settingsModalType = ChannelRequestType.TradestationSettings;
               break;
            case BrokerType.Snbcapital:
                settingsModalType = ChannelRequestType.SnbcapitalSettings;
                break;
            case BrokerType.Riyadcapital:
                settingsModalType = ChannelRequestType.RiyadcapitalSettings;
                break;
            case BrokerType.Alinmainvest:
                settingsModalType = ChannelRequestType.AlinmainvestSettings;
                break;
            case BrokerType.Aljaziracapital:
                settingsModalType = ChannelRequestType.AljaziracapitalSettings;
                break;
            case BrokerType.Alrajhicapital:
                settingsModalType = ChannelRequestType.AlrajhicapitalSettings;
                break;
            case BrokerType.Musharaka:
                settingsModalType = ChannelRequestType.MusharakaSettings;
                break
            case BrokerType.Bsf:
                settingsModalType = ChannelRequestType.BsfSettings;
                break;
            case BrokerType.Alkhabeercapital:
                settingsModalType = ChannelRequestType.AlkhabeercapitalSettings;
                break;
        }
        this.sendChannelRequest({type: settingsModalType});
    }

    onShowAccountTransactions() {
        this.sendChannelRequest({type:ChannelRequestType.VirtualTradingTransactions});
    }

    onShowTransferMoney() {
        let request = this.tradingService.getTransferMoneyType();
        this.sendChannelRequest({type: request})
    }

    shouldDisplaySettings(): boolean {
        return this.tradingService.shouldDisplaySettings();
    }

    showAccountTransactions(): boolean{
        return this.tradingService.shouldDisplayAccountTransactions()
    }

    showTransferMoney():boolean {
        return this.tradingService.shouldDisplayTransferMoney();
    }

    shouldDisplayAccountBalances():boolean {
        return this.tradingService.shouldDisplayAccountBalances();
    }

    shouldDisplayAccount(): boolean {
        return this.tradingService.shouldDisplayAccount();
    }

     onExpandMarketWindows() {
        if(!this.marketWindowsExpanded) {
            this.toolsExpanded = false;
            this.companyWindowsExpanded = false;
            this.tradingWindowsExpanded = false;
            this.marketWindowsExpanded = true;
            this.communityWindowsExpanded = false;
        }
    }

     onExpandCompanyWindows() {
        if(!this.companyWindowsExpanded) {
            this.toolsExpanded = false;
            this.marketWindowsExpanded = false;
            this.tradingWindowsExpanded = false;
            this.companyWindowsExpanded = true;
            this.communityWindowsExpanded = false;
        }
    }

     onExpandTools(){
        if(!this.toolsExpanded){
            this.companyWindowsExpanded = false;
            this.marketWindowsExpanded = false;
            this.tradingWindowsExpanded = false;
            this.toolsExpanded = true;
            this.communityWindowsExpanded = false;
        }
    }

     onExpandTradingWindows(){
        if(!this.tradingWindowsExpanded){
            this.companyWindowsExpanded = false;
            this.marketWindowsExpanded = false;
            this.toolsExpanded = false;
            this.tradingWindowsExpanded = true;
            this.communityWindowsExpanded = false;
        }
    }

    onExpandCommunityWindows() {
        if(!this.communityWindowsExpanded){
            this.companyWindowsExpanded = false;
            this.marketWindowsExpanded = false;
            this.tradingWindowsExpanded = false;
            this.toolsExpanded = false;
            this.communityWindowsExpanded = true;
        }
    }
    /* trading */

    onAddTradingOrdersScreen():void{
        let boxType:GridBoxType = this.tradingService.getTradingOrdersGridBoxType();
        this.onAddMarketBox(boxType);
    }

    onAddTradingPositionsScreen():void{
        let boxType:GridBoxType = this.tradingService.getTradingPositionsGridBoxType();
        this.onAddMarketBox(boxType);
    }

    onAddTradingAccountBalanceScreen(): void {
        let boxType: GridBoxType = this.tradingService.getTradingAccountBalanceGridBoxType();
        this.onAddMarketBox(boxType);
    }

    /* Community */
    communityIdeasIconFocused: boolean = false;
    communityMyIdeasIconFocused: boolean = false;
    communityNotificationIconFocused: boolean = false;
    isCommunityWindowExpandingDone: boolean = true;

    onToggleCommunityIdeas() {
        this.authorizationService.authorize(FeatureType.COMMUNITY, () => {
            this.focusOnCommunityIdeasIcon();
            this.openCommunityWindow(CommunityTabType.Ideas);
        })
    }

    private focusOnCommunityIdeasIcon() {
        this.communityIdeasIconFocused = !this.communityIdeasIconFocused;
        this.communityNotificationIconFocused = false;
        this.communityMyIdeasIconFocused = false;
    }

    onToggleCommunityNotifications() {
        this.authorizationService.authorize(FeatureType.COMMUNITY, () => {
            this.focusOnCommunityNotificationIcon();
            this.openCommunityWindow(CommunityTabType.Notifications);
        });
    }

    private focusOnCommunityNotificationIcon() {
        this.communityIdeasIconFocused = false;
        this.communityNotificationIconFocused = !this.communityNotificationIconFocused;
        this.communityMyIdeasIconFocused = false;
    }

    onToggleCommunityMyIdeas() {
        this.authorizationService.authorize(FeatureType.COMMUNITY, () => {
            this.focusOnCommunityMyIdeasIcon();
            this.openCommunityWindow(CommunityTabType.MyIdeas);
        })
    }

    private focusOnCommunityMyIdeasIcon() {
        this.communityIdeasIconFocused = false;
        this.communityNotificationIconFocused = false;
        this.communityMyIdeasIconFocused = !this.communityMyIdeasIconFocused;
    }

    openCommunityWindow(type: CommunityTabType) {
        let showCommunityWindowRequest: ShowCommunityWindowRequest = {type: ChannelRequestType.CommunityWindows, communityTabType: type , caller:this};
        this.sharedChannel.request(showCommunityWindowRequest);
    }

    onCloseWindow() {
        this.communityIdeasIconFocused = false;
        this.communityNotificationIconFocused = false;
        this.communityMyIdeasIconFocused = false;
        this.cd.markForCheck();
    }

    startCommunityWindowExpanding() {
        this.isCommunityWindowExpandingDone = false;
    }

    finishCommunityWindowExpanding() {
        this.isCommunityWindowExpandingDone = true;
    }

    getUnreadNotificationsCounterAsString():string {
        return this.unreadCommunityNotificationsCounter <= 10 ? this.unreadCommunityNotificationsCounter.toString() : '10+';
    }

    showNewNotificationsCounter(): boolean {
        return this.communityWindowsExpanded && this.isCommunityWindowExpandingDone && !this.communityNotificationIconFocused && this.hasUnreadNotifications();
    }

    private hasUnreadNotifications():boolean {
        return this.unreadCommunityNotificationsCounter > 0;
    }

    notificationClass(): string {
        let cssClass: string = '';
        if (!this.communityWindowsExpanded && !this.communityNotificationIconFocused && this.hasUnreadNotifications()) {
            cssClass = 'has-notifications';
        }
        return cssClass;
    }

    /* animations */

     get expandTools():string {
        return this.toolsExpanded ? 'expanded' : 'collapsed';
    }

     get expandMarketWindows():string {
        return this.marketWindowsExpanded ? 'expanded' : 'collapsed';
    }

     get expandCompanyWindows():string{
        return this.companyWindowsExpanded ? 'expanded' : 'collapsed';
    }

     get expandTradingWindows():string{
        return this.tradingWindowsExpanded ? 'expanded' : 'collapsed';
    }

    get expandCommunityWindows():string{
        return this.communityWindowsExpanded ? 'expanded' : 'collapsed';
    }

    /* windows event */
     onResize() {
        this.cd.markForCheck();
    }

    private authorizeGridBoxType(type: GridBoxType, cb: () => void) {
        let featureType: FeatureType = FeatureGridBox.getAuthorizationFeatureTypeByGridBoxType(type);
        this.authorizationService.authorize(featureType, cb, true, this.pageService.countOpenGridBoxes(type), this.pageService.isMarketGridBoxIncludedInPages(type));
    }

    hasTadMarket(): boolean {
      return this.marketsManager.hasTadMarket();
    }

    isUnauthorized(featureType: FeatureType): boolean {
        return !this.authorizationService.authorizeFeature(featureType);
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }


    public isFeatureAllowed(feature: number) {
         return this.isProfessionalSubscriber() || this.appModeAllowedFeature(feature);
    }

    public isProfessionalSubscriber(): boolean {
         return this.authorizationService.isProfessionalSubscriber()
    }
}
