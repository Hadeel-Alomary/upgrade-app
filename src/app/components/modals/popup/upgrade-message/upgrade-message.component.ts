import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';
import {AppModeAuthorizationService, AuthorizationService, ChannelRequestType, LanguageService, Loader, LoaderConfig, LoaderUrlType, MarketsManager, SharedChannel, TcWebsiteService, UpgradeMessageService} from '../../../../services/index';
import {ChannelListener} from '../../shared/channel-listener';
import {UpgradeMessageChannelRequest, UpgradeMessageType} from './upgrade-message-channel-request';
import {Tc, AppTcTracker} from '../../../../utils';
import {Feature, FeatureCountType, FeatureType} from '../../../../services/auhtorization/feature';
import {AppModeFeatureType} from '../../../../services/auhtorization/app-mode-authorization';

@Component({
    selector: 'upgrade-message',
    templateUrl:'./upgrade-message.component.html',
    styleUrls:['./upgrade-message.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class UpgradeMessageComponent  extends ChannelListener<UpgradeMessageChannelRequest> implements OnDestroy {

    @ViewChild(ModalDirective) public messageBoxModal: ModalDirective;
    appModeFeatureType = AppModeFeatureType;

    constructor(public sharedChannel:SharedChannel,
                public cd:ChangeDetectorRef,
                public languageService:LanguageService,
                public marketsManager:MarketsManager,
                public loader:Loader,
                public upgradeMessageService:UpgradeMessageService,
                public authorizationService: AuthorizationService,
                private tcWebsiteLinksService: TcWebsiteService,
                private appModeAuthorizationService: AppModeAuthorizationService){
        super(sharedChannel, ChannelRequestType.UpgradeMessage);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel requests */

    protected onChannelRequest() {
        this.messageBoxModal.show();

        AppTcTracker.trackSubscriptionMessage(this.channelRequest.upgradeMessageType == UpgradeMessageType.BASIC_SUBSCRIPTION ? 'light' : 'plus');
        this.cd.markForCheck();
    }

    showBasicUpgradeMessage():boolean {
        return this.channelRequest.upgradeMessageType == UpgradeMessageType.BASIC_SUBSCRIPTION;
    }

    isAdvanced():boolean {
        return this.channelRequest.upgradeMessageType == UpgradeMessageType.ADVANCED_SUBSCRIPTION;
    }

    public showPaidMarketsMessage(): boolean {
        // Ehab: showPaidMarketsMessage when the user is Professional subscriber to the one market like Saudi then try to use professional feature like (adding alert, trading, adding one of the liquidity indicators) or,
        //                              when the user is Basic subscriber to the one market like Amman then try to use Basic feature like (Buying,Selling) then we need to show him
        // message like: هذه الميزة تدعم الأسواق ذات الاشتراكات المدفوعة فقط.

        if(!this.channelRequest.isMarketAuthorized) {
            return this.authorizationService.isBasicSubscriber() || this.authorizationService.isAdvanceSubscriber() || this.authorizationService.isProfessionalSubscriber();
        }

        return false;
    }

    public getPaidMarketMessageForDerayahMode() {
        let feature = this.channelRequest.feature ? Feature.getFeature(this.channelRequest.feature.type) : null;
        let message: string = '';
        if (feature) {
            message = this.languageService.arabic ? `لا يمكن إضافة ${feature.arabic} على الييانات المتأخرة 15 دقيقة. يرجى التواصل مع دراية المالية للحصول على البيانات اللحظية.`
                : 'You can not add alerts on delayed 15 minutes data. Please contact Derayah to get real-time data.';
        }
        return message;
    }

    public getFeatureMessage(): string {
        let featureWord: string = this.languageService.translate('ميزة');
        let feature = this.channelRequest.feature;

        let message: string = this.languageService.translate('لمتابعة أسعار السوق اللحظية مع الرسم البياني اللحظي');

        if (feature) {
            message = this.languageService.arabic ? featureWord + ' ' + feature.arabic : feature.english + ' ' + featureWord;

            if (this.isFeatureScreensCounterInvalid()) {
                message = this.languageService.arabic ? `فتح شاشات متعددة من ${feature.arabic}` : `Open ${feature.english} multiple screens`;
            }

            if (this.isFeatureCounterInvalid()) {
                featureWord = this.languageService.translate('اضافة أكثر من ');
                message = this.languageService.arabic ? featureWord + ' ' + this.channelRequest.AllowedFeatureCount + ' ' + feature.arabic : featureWord + ' ' + this.channelRequest.AllowedFeatureCount + ' ' + feature.english  ;
            }
        }

        return message;
    }

    public getUpgradeMessages(): string {
        if (this.showBasicUpgradeMessage()) {
            return this.languageService.arabic ? 'اشترك مع تكرتشارت وتابع الأسعار اللحظية مباشرة من السوق ' : 'Subscribe with TickerChart, and monitor the market in realtime';
        } else {
            if (this.isBasicSubscriber() || this.isAdvancedSubscriber()) {
                return this.languageService.arabic ? 'رقي اشتراكك وتمتع بعدد كبير من المميزات المتقدمة، مثل التحكم بالشاشات، حفظ مساحات العمل، التنبيهات، وغيرها الكثير من الميزات' : 'Upgrade TickerChart subscription, and enjoy many advanced features as in controlling screen layout, saving to the cloud, alerts and much more.';
            } else {
                return this.languageService.arabic  ? ' اشترك مع تكرتشارت ، وتمتع بعدد كبير من المميزات المتقدمة، مثل التحكم بالشاشات، حفظ مساحات العمل، التنبيهات، وغيرها الكثير من الميزات': 'Subscribe with TickerChart, and enjoy many advanced features as in controlling screen layout, saving to the cloud, alerts and much more.';
            }
        }
    }

    public isFeatureScreensCounterInvalid() {
        if(this.channelRequest && !this.channelRequest.isValidFeatureCount && this.getIsScreenType()) {
            return true;
        }
        return false;
    }

    public isMarketGridBoxIncludedInPages() {
        if(this.channelRequest && this.channelRequest.isMarketGridBoxIncludedInPages) {
            return true;
        }
        return false;
    }

    public isFeatureCounterInvalid() {
        if(this.channelRequest && !this.channelRequest.isValidFeatureCount && !this.getIsScreenType()) {
            return true;
        }
        return false;
    }

    public getIsScreenType(): boolean {
        let feature = this.channelRequest.feature;
        if(feature) {
            return feature.featureCountType == FeatureCountType.Screens
        }
        return false
    }


    public getFeatureScreensCounterInvalidMessage() {
        let featureWord:string = this.languageService.translate('ميزة');
        let feature = this.channelRequest.feature;

        let message: string = this.languageService.arabic ?  featureWord + ' ' + feature.arabic : feature.english + ' ' + featureWord;
        let type: string = '';
        let gridBoxCounter: number = 0;

        if (this.isFeatureScreensCounterInvalid()) {
            const isArabic = this.languageService.arabic;
            const featureType = feature.type;

            if(!this.isMarketGridBoxIncludedInPages()){
                if (this.authorizationService.isBasicSubscriber()) {
                    if (this.authorizationService.getCompanyScreens().includes(featureType)) {
                        type = isArabic ? 'شاشة الشركات' : 'company';
                        gridBoxCounter = 5;
                    } else if (this.authorizationService.getMarketScreens().includes(featureType)) {
                        type = isArabic ? 'شاشة السوق' : 'market';
                        gridBoxCounter = 3;
                    }
                } else if (this.authorizationService.isAdvanceSubscriber() && this.authorizationService.getMarketScreens().includes(featureType)) {
                    type = isArabic ? 'شاشة السوق' : 'market';
                    gridBoxCounter = 5;
                }
            }
            gridBoxCounter = gridBoxCounter ? gridBoxCounter : this.channelRequest.AllowedFeatureCount;
            type = type ? type : this.languageService.arabic ? feature.arabic : feature.english;

            message = this.languageService.arabic ?
                `الباقة الحالية تتيح فتح شاشات عدد ` + gridBoxCounter + '،' +
                ` من نوع ` + type + '،' +
                ` يرجى إغلاق شاشة حالية من نوع `  + type +
                ` لتتمكن من فتح شاشة أخرى.`
                :

                `Current subscription allow you to open ` + gridBoxCounter + ' of ' + type + ' screen(s), ' +
                `Please close one of current `  + type + ' screen(s) ' +
                `to open another screen.`;
        }

        return message;
    }

    public getFeatureScreensCounterInvalidMessageForDerayahMode() {
        let feature = this.channelRequest.feature;
        let message: string = '';

        if (this.isFeatureScreensCounterInvalid()) {

            if (this.authorizationService.getCompanyScreens().includes(feature.type)) {
                message = this.languageService.arabic ? 'وصلت الى الحد الأعلى للشاشات المفتوحة من النوع شاشة الشركات. يرجى اغلاق شاشة الشركات لتتمكن من فتح شاشة جديدة.' :
                    'You have reached to the maximum limit of opened Company screens. Please close company screen to be able to open a new one.';
            } else if (this.authorizationService.getMarketScreens().includes(feature.type)) {
                message = this.languageService.arabic ? 'وصلت الى الحد الأعلى للشاشات المفتوحة من النوع شاشة السوق. يرجى اغلاق شاشة السوق لتتمكن من فتح شاشة جديدة.' :
                    'You have reached to the maximum limit of opened Market screens. Please close Market screen to be able to open a new one.';
            } else {
                message = this.languageService.arabic ?
                    ` وصلت الحد الأعلى للشاشات المفتوحة من النوع  ${feature.arabic}.
                    يرجى إغلاق شاشة ${feature.arabic}
                    لتتمكن من فتح شاشة جديدة.` : `You have reached to the maximum limit of ${feature.english}. Please close ${feature.english} to be able to open a new one.  `;

            }
        }

        return message;
    }

    public isMultiplePagesFeature() {
        return this.channelRequest.feature.type == FeatureType.MULTIPLE_PAGES;
    }

    public getMultiplePagesReachedLimitFeatureMessage() {
        let arMessage  = "الباقة الحالية تتيح فتح صفحتين فقط في مساحة العمل الواحدة، يرجى إغلاق صفحة حالية للتمكن من فتح صفحة اخرى."
        let enMessage = "Current subscription allows opening only two pages in one workspace Please close a current page to be able to open another page.";
        return this.languageService.arabic ? arMessage : enMessage;
    }

    public isMultipleAlertsFeature() {
        return this.channelRequest.feature.type == FeatureType.MULTIPLE_SIMPLE_ALERTS;
    }

    public getAlertsReachedLimitMessage() {
        let count = this.isBasicSubscriber() ? this.channelRequest.feature.basicCount : this.channelRequest.feature.advancedCount;
        let arMessage  = ` الباقة الحالية تتيح إضافة ${count} تنبيهات  فعالة، يرجى حذف تنبيه فعال للتمكن من إضافة تنبيه آخر. `
        let enMessage = "Current subscription allows adding three active alerts, Please delete one alert to be able to add another alert.";
        return this.languageService.arabic ? arMessage : enMessage;
    }


    public getAlertsReachedLimitMessageForDerayahMode() {
        let arMessage  = "وصلت الى الحد الأعلى لاضافة تنبيه بسيط فعال. يرجى حدف تنبيه فعال لتتمكن من اضافة تنبيه جديد."
        let enMessage = "Current subscription allows adding three simple active alerts, Please delete one alert to be able to add another alert.";
        return this.languageService.arabic ? arMessage : enMessage;
    }

    public isAddMoreThanFiveIndicatorsFeature() {
        return this.channelRequest.feature.type == FeatureType.ADD_MORE_THAN_FIVE_INDICATORS;
    }

    public getAddMoreThanFiveIndicatorsMessage() {
        let arMessage  = "الباقة الحالية لا تتيح إضافه أكثر من 5 مؤشرات , يرجى حذف مؤشر للتمكن من إضافة مؤشر آخر."
        let enMessage = "Current subscription does not allow adding more than five indicators , Please delete one indicator to be able to add another indicator.";
        return this.languageService.arabic ? arMessage : enMessage;
    }

    isVisitor() {
        return this.authorizationService.isVisitor();
    }

    isBasicSubscriber() {
        return this.authorizationService.isBasicSubscriber();
    }

    isAdvancedSubscriber() {
        return this.authorizationService.isAdvanceSubscriber();
    }

    public showUpgradeButton() {
        return this.authorizationService.isBasicSubscriber() || this.isAdvanced();
    }

    isGenericUpgradeMessage(): boolean {
        return !this.channelRequest.feature;
    }

    onClose() {
        this.messageBoxModal.hide();
    }

    showContent():boolean {
        return this.channelRequest != null;
    }

    openBuyUrl() {
        let url = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.TcWebsiteSubscribe);
        this.isVisitor() ? window.open(url) : this.tcWebsiteLinksService.openUrl(url);
        this.hideModal();
    }

    openSubscriptionUpgradeUrl() {
        return this.upgradeMessageService.openSubscriptionUpgradeUrl();
        this.hideModal();
    }

    private hideModal() {
        AppTcTracker.trackSubscriptionMessageAction(this.channelRequest.upgradeMessageType == UpgradeMessageType.BASIC_SUBSCRIPTION ? 'light' : 'plus');
        this.messageBoxModal.hide();
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }
}
