import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {AppModeAuthorizationService, AuthorizationService, ChannelRequestType, DrawingService, FontSize, IndicatorService, LanguageService, MiscStateService, Page, SharedChannel, TradingService, VolatileStateService, WorkspaceStateService} from '../../services/index';
import {AppTcTracker} from '../../utils/index';
import {FeatureType} from '../../services/auhtorization/feature';
import {BrokerSelectorCaller, BrokerSelectorChannelRequest} from '../modals/trading/broker-selector/broker-selector.component';
import {BrokerType} from '../../services/trading/broker/broker';
import {ConfirmationCaller, ConfirmationRequest, MessageBoxRequest, UpgradeMessageChannelRequest, UpgradeMessageType} from '../modals/popup';
import {WorkspaceSelectRequest} from '../modals/workspace';
import {AppModeFeatureType} from '../../services/auhtorization/app-mode-authorization/app-mode-feature';

@Component({
    selector: 'footer',
    templateUrl:'./footer.component.html',
    styleUrls:['./footer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})

export class FooterComponent implements BrokerSelectorCaller, ConfirmationCaller {

    @Input() selectedPage:Page;
    @Output() outputPage = new EventEmitter();
    @Output() outputDeletePage = new EventEmitter();

    @Output() outputLogout = new EventEmitter();

     height:number;
     fullscreen:boolean = false;
     fontSize = FontSize; // use enum in template
     brokerSelected:boolean = false;
    savingWorkspace:boolean = false;
    appModeFeatureType = AppModeFeatureType;

    constructor( public sharedChannel:SharedChannel,
                 public miscStateService:MiscStateService,
                 private authorizationService:AuthorizationService,
                 private volatileStateService:VolatileStateService,
                 private workspaceStateService:WorkspaceStateService,
                 public cd:ChangeDetectorRef,
                 public tradingService:TradingService,
                 public languageService: LanguageService,
                 private appModeAuthorizationService:AppModeAuthorizationService,
                 public drawingService: DrawingService,
                 public indicatorService: IndicatorService) {

        tradingService.getBrokerSelectionStream().subscribe( (brokerType:BrokerType) => {
            this.brokerSelected = brokerType != BrokerType.None;
            this.cd.markForCheck();
        })

        this.updateFooterWorkspaceIconDuringSaving();

    }

    private updateFooterWorkspaceIconDuringSaving() {
        this.sharedChannel.getRequestStream().subscribe(request => {
            if (request.type == ChannelRequestType.WorkspaceUpdateInProgress) {
                this.savingWorkspace = true;
                this.cd.markForCheck();
                window.setTimeout(() => {
                    this.savingWorkspace = false;
                    this.cd.markForCheck();
                }, 4500);
            }
        });
    }

    /* template helpers */

     get screenModeTooltipTitle():string {
        return this.fullscreen ? 'إلغاء تكبير الشاشة' : 'تكبير الشاشة';
    }

     get screenModeCssClass():string {
        return this.fullscreen ? 'normal' : 'fullscreen';
    }

     isSelectedFont(fontSize:FontSize):boolean {
        return this.miscStateService.getFontSize() == fontSize;
    }

    /* interactive events */

     onDeletePage(page:Page) {
        this.outputDeletePage.emit(page);
    }

     onSelectPage(page:Page) {
        this.outputPage.emit(page);
    }

     onTechnicalSupport() {
        this.sharedChannel.request({type: ChannelRequestType.SupportInfo});
    }

    onConfirmation(confirmed: boolean, param: unknown): void {
         if(confirmed) {
             this.languageService.switchLanguage();
         }
    }

     onMyAccount() {
        this.sharedChannel.request({type: ChannelRequestType.SettingsMenu});
    }

     onLogout() {
         this.outputLogout.emit();
    }

    onSelectWorkspace() {
         this.authorizationService.authorize(FeatureType.SAVE_WORKSPACE_ON_CLOUD, () => {
             let workspaceSelectRequest:WorkspaceSelectRequest = {type: ChannelRequestType.WorkspaceSelect, forceSelection:false};
             this.sharedChannel.request(workspaceSelectRequest);
         })
    }

     onToggleScreenMode() {
        // http://stackoverflow.com/questions/7836204/chrome-fullscreen-api

        AppTcTracker.trackToggleMaximizeScreen();

        if(!this.fullscreen) {
            let el:ToggleScreenElement = document.documentElement as unknown as ToggleScreenElement;
            let rfs = el.requestFullscreen
                || el.webkitRequestFullscreen
                || el.mozRequestFullScreen;

            rfs.call(el);
        } else {
            let el:ToggleScreenElement = document as unknown as ToggleScreenElement;
            let efs = el.exitFullscreen
                || el.webkitExitFullscreen
                || el.mozCancelFullScreen;
            efs.call(el);
        }

    }

     onFontSize(fontSize:FontSize){
        this.miscStateService.setFontSize(fontSize);
    }


     onResize() {
        // http://stackoverflow.com/questions/16755129/detect-fullscreen-mode
        this.fullscreen = (screen.availHeight || screen.height-30) <= window.innerHeight;
    }

    showBrokerConnectionBtn():boolean {
         if(this.authorizationService.isVisitor()) {
             return false;
         }
         let result = !this.brokerSelected;
         return result;
    }


    onBrokerActivate(){
        let brokerSelectorChannelRequest:BrokerSelectorChannelRequest = {type: ChannelRequestType.BrokerSelection, caller: this};
        this.sharedChannel.request(brokerSelectorChannelRequest);
    }

    public onBrokerSelection(brokerType: BrokerType): void {
        this.tradingService.selectBroker(brokerType, false);
    }

    isVisitor():boolean {
         return this.authorizationService.isVisitor();
    }

    isRegistered():boolean {
        return !this.isVisitor();
    }

    onSignin() {
        this.sharedChannel.request({type: ChannelRequestType.SignInOrSignUp});
    }

    getWorkspaceName() {
        return this.volatileStateService.getLoadedWorkspaceName();
    }

    hasWorkspaceLoaded() {
        return this.workspaceStateService.hasWorkspaceLoaded();
    }

    showSubscribeBtn():boolean {
        return this.authorizationService.isRegistered();
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

    public isBasicSubscriber(): boolean {
         return this.authorizationService.isBasicSubscriber();
    }


    appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

    public onResetWorkspace() {
        let self = this;
        let message:string = this.languageService.translate('هل أنت متأكد من حذف جميع التعديلات و الرسومات التي تم إضافتها إلى مساحة العمل و العودة إلى مساحة العمل الإفتراضية؟');
        let request:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: message,
            caller: new class implements ConfirmationCaller{
                onConfirmation(confirmed: boolean, param: unknown) {
                    if(confirmed) {
                        self.drawingService.clearAllDrawingDefaultSettings();
                        self.indicatorService.clearAllIndicatorsDefaultSettings();

                        //NK remove all user indicators and drawings default settings
                        self.workspaceStateService.resetLoadedWorkspace().subscribe(response => {
                            let message:string = self.languageService.translate('لقد تم إعادة مساحة العمل إلى الأعدادات الأصلية');
                            let request:MessageBoxRequest = {type: ChannelRequestType.MessageBox, messageLine: message};
                            self.sharedChannel.request(request);
                        });
                    }

                }
            } };
        this.sharedChannel.request(request);
     }

    protected readonly BrokerType = BrokerType;
}

interface ToggleScreenElement extends HTMLElement {
    webkitRequestFullscreen?:() => Promise<void>,
    mozRequestFullScreen?:() => Promise<void>,
    exitFullscreen?:() => Promise<void>,
    webkitExitFullscreen?:() => Promise<void>,
    mozCancelFullScreen?:() => Promise<void>

}
