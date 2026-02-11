import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AppModeAuthorizationService, AuthorizationService, ChannelRequest, ChannelRequestType, CredentialsStateService, DrawingService, IndicatorService, LanguageService, Loader, LoaderConfig, LoaderUrlType, MarketsManager, MiscStateService, SharedChannel, TradingService, UserInfo, WorkspaceStateService} from '../../../services/index';
import {ChannelListener} from '../shared/channel-listener';
import {AppBrowserUtils, DomUtils, AppTcTracker} from '../../../utils/index';
import {ConfirmationCaller, ConfirmationRequest, MessageBoxRequest} from '../popup/index';
import {BrokerSelectorCaller, BrokerSelectorChannelRequest} from '../trading/broker-selector/broker-selector.component';
import {BrokerType} from '../../../services/trading/broker/broker';
import {UpgradeMessageChannelRequest, UpgradeMessageType} from '../popup';
import {TcWebsiteService} from '../../../services/tc-website';
import {FontSize} from '../../../services';
import {AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';
import {FeatureType} from '../../../services/auhtorization/feature';
import {Packages} from '../../../services/loader/loader/packages';

@Component({
    selector: 'settings-menu',
    templateUrl:'./settings-menu.component.html',
    styleUrls:['./settings-menu.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('expandChanged', [
            state('expanded', style({
                width: '{{menuWidth}}px',
            }), {params: {menuWidth: 0}}),
            state('collapsed',   style({
                width: '0px'
            })),
            transition('collapsed => expanded', animate('500ms linear')),
            transition('expanded => collapsed', animate('500ms linear'))
        ])
    ]
})

export class SettingsMenuComponent  extends ChannelListener<SettingMenuChannelRequest> implements OnDestroy, ConfirmationCaller,BrokerSelectorCaller {

    expanded: boolean = false;
    expandState: string = 'collapsed';
    userInfo: UserInfo;
    fullscreen:boolean = false;
    savingWorkspace: boolean;

    fontSize = FontSize;

    appModeFeatureType = AppModeFeatureType;

    constructor(public sharedChannel: SharedChannel,
                public loader: Loader,
                public cd: ChangeDetectorRef,
                public el: ElementRef,
                public credentialsService: CredentialsStateService,
                public workspaceStateService: WorkspaceStateService,
                public marketsManager: MarketsManager,
                public tradingService: TradingService,
                public languageService:LanguageService,
                public authorizationService:AuthorizationService,
                public miscStateService: MiscStateService,
                private tcWebsiteService: TcWebsiteService,
                public appModeAuthorizationService: AppModeAuthorizationService,
                public drawingService: DrawingService,
                public indicatorService: IndicatorService){
        super(sharedChannel, ChannelRequestType.SettingsMenu);

    }

    ngAfterViewInit() {
        let eventType = AppBrowserUtils.isDesktop() ? 'click' : 'touchstart';
        window.document.addEventListener(eventType, event =>{
            if(!DomUtils.isEventOutsideComponent(this.el.nativeElement, event, ['modal-content', 'modal', 'btn-settings'])) {
                this.expanded = false;
                this.callCallerIfExist();
                this.cd.markForCheck();
            }
        });

    }

    ngOnDestroy() {
        this.onDestroy();
    }

    closeMenu(): void {
        this.expanded = false;
        this.callCallerIfExist();
        this.cd.markForCheck();
    }

    callCallerIfExist() {
        if(this.channelRequest && this.channelRequest.caller) {
            this.channelRequest.caller.changeSettingVisibleState(this.expanded);
        }
    }
    /* channel requests */

    protected onChannelRequest() {
        this.userInfo = this.loader.getUserInfo();
        this.expanded = !this.expanded;
        this.callCallerIfExist();
        this.cd.markForCheck();
    }

    onConfirmation(confirmed:boolean, param:unknown){
        if(confirmed) {
            this.drawingService.clearAllDrawingDefaultSettings();
            this.indicatorService.clearAllIndicatorsDefaultSettings();
            //NK remove all user indicators and drawings default settings
            this.workspaceStateService.resetLoadedWorkspace().subscribe(response => {
                let message:string = this.languageService.translate('لقد تم إعادة مساحة العمل إلى الأعدادات الأصلية');
                let request:MessageBoxRequest = {type: ChannelRequestType.MessageBox, messageLine: message};
                this.sharedChannel.request(request);
                this.closeMenu();
            });
        }
    }

    /* interactive events */
    onTechnicalSupport() {
        this.sharedChannel.request({type: ChannelRequestType.SupportInfo});
        this.closeMenu();
    }

    onBrokerActivate(){
        let brokerSelectorChannelRequest:BrokerSelectorChannelRequest = {type: ChannelRequestType.BrokerSelection, caller: this};
        this.sharedChannel.request(brokerSelectorChannelRequest);
        this.closeMenu();
    }

    public onBrokerSelection(brokerType: BrokerType): void {
            this.tradingService.selectBroker(brokerType, false);
    }

    onBrokerDeactivate(){
        this.tradingService.deselectBroker();
        this.closeMenu();
    }

     onResetWorkspace(){
        let message:string = this.languageService.translate('هل أنت متأكد من حذف جميع التعديلات و الرسومات التي تم إضافتها إلى مساحة العمل و العودة إلى مساحة العمل الإفتراضية؟');
        let request:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: message, caller: this};
        this.sharedChannel.request(request);
        this.closeMenu();
    }

    getUsername() {
        let username: string = this.userInfo.username;

        if(this.appModeAllowedFeature(AppModeFeatureType.BROKER_USER_NAME)) {
            username = LoaderConfig.brokerUser(this.loader.getConfig());
        }

        return username;
    }

    onSwitchLanguage() {
        this.languageService.switchLanguage();
    }

    getSwitchLanguageText(): string {
        return this.languageService.arabic ? 'Switch language to English' : 'تغيير إلى اللغة للعربية';
    }

    onFontSize(fontSize:FontSize){
        this.miscStateService.setFontSize(fontSize);
    }

    isVisitor():boolean {
        return this.authorizationService.isVisitor();
    }

    isRegistered():boolean {
        return !this.isVisitor();
    }

    getSaveWorkspaceText() {
        return this.savingWorkspace ? "جار حفظ مساحة العمل": "حفظ مساحة العمل";
    }

    onUpdateWorkspace() {
        this.authorizationService.authorize(FeatureType.SAVE_WORKSPACE_ON_CLOUD, () => {
            if (this.savingWorkspace) {
                return; // saving button was just clicked, so don't process it again.
            }
            this.savingWorkspace = true;
            this.workspaceStateService.updateWorkspace().subscribe();
            this.cd.markForCheck();

            window.setTimeout(() => {
                this.savingWorkspace = false;
                this.cd.markForCheck();
            }, 4500);
        });

    }

    onLogout() {
        this.sharedChannel.request({type: ChannelRequestType.Logout})
    }

    /* template helpers */

     openSubscribeUrl() {
         let url:string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.TcWebsiteSubscribe);
         this.tcWebsiteService.openUrl(url);
    }

     openSubscriptionsUrl() {
        let url:string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.TcWebsiteViewSubscribtions);
        this.tcWebsiteService.openUrl(url);
    }

     openRewardUrl() {
         let url:string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.TcWebsiteReward);
         this.tcWebsiteService.openUrl(url);
    }

    public allowBrokerSelection(){
        return !this.loader.getSnbcapitalLoginInfo().subscribed && !this.loader.getAlrajhicapitalLoginInfo().subscribed && !this.loader.getMusharakaLoginInfo().subscribed && !this.loader.getBsfLoginInfo().subscribed && !this.loader.getAlkhabeercapitalLoginInfo().subscribed//Snbcapital package subscriber is not allowed to select broker
    }

    get supportProgramUrl():string{
        return AppBrowserUtils.isMac() ? "http://www.tickerchart.com/download/TickerChart_TV7QS_MAC_ar.dmg" : "https://www.tickerchart.com/download/TickerChartTV11QS-idc65ikk9g.exe";
    }

    get connectedWithBroker():boolean {
         return this.tradingService.hasSelectedBroker();
    }

    getPackageType():string {
        let subscriptionType:string = this.loader.getPackageType();
        return this.languageService.arabic ? Packages.getPackage(subscriptionType).arabic: Packages.getPackage(subscriptionType).english;
    }

    public getPackageEndDate(): string {
        return this.loader.getEndDate();
    }

    showSubscriptionDates():boolean {
         return this.authorizationService.isSubscriber() && this.getPackageEndDate().length > 0;
    }

    isDesktop():boolean {
         return AppBrowserUtils.isDesktop();
    }

    /* switch theme */

    getSwitchThemeText(): string {
        let message = this.miscStateService.isDarkTheme() ? 'التحويل إلى الطابع الفاتح' : 'التحويل إلى الطابع الغامق';
        return this.languageService.translate(message);
    }

    onSwitchTheme() {

        let self = this;

        let message = this.miscStateService.isDarkTheme() ?
            "هل ترغب في تغيير الطابع العام إلى الفاتح؟" :
            "هل ترغب في تغيير الطابع العام إلى الغامق؟";

        let openRequest: ConfirmationRequest = {
            type: ChannelRequestType.Confirmation,
            messageLine: this.languageService.translate(message),
            caller: new class implements ConfirmationCaller {
                onConfirmation(confirmed: boolean, params: unknown): void {
                    if (confirmed) {
                        AppTcTracker.trackSwitchTheme(!self.miscStateService.isDarkTheme() ? "dark" : "light");
                        self.miscStateService.setDarkTheme(!self.miscStateService.isDarkTheme());
                        self.sharedChannel.request({type: ChannelRequestType.SwitchTheme})
                    }
                }
            }
        };

        this.sharedChannel.request(openRequest);

    }

    showUpgradeSubscriptionBtn():boolean {
        return this.authorizationService.isBasicSubscriber();
    }

    onSubscription() {
        let upgradeTo: UpgradeMessageType = UpgradeMessageType.BASIC_SUBSCRIPTION;
        if (this.authorizationService.isBasicSubscriber()) {
            upgradeTo = UpgradeMessageType.PROFESSIONAL_SUBSCRIPTION;
        }

        let upgradeMessageRequest: UpgradeMessageChannelRequest = {
            type: ChannelRequestType.UpgradeMessage,
            upgradeMessageType: upgradeTo
        };
        this.sharedChannel.request(upgradeMessageRequest);
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

    public isAllowedFontSize(featureType: AppModeFeatureType): boolean {
        return this.authorizationService.isProfessionalSubscriber() || this.appModeAllowedFeature(featureType);
    }
}





export interface SettingMenuChannelRequest extends ChannelRequest {
    caller?:SettingMenuCaller
}

export interface SettingMenuCaller {
    changeSettingVisibleState(visible:boolean):void;
}

