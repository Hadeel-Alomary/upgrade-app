import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {ChannelListener} from '../shared';
import {ChannelRequest, ChannelRequestType, SharedChannel} from '../../../services/shared-channel';
import {ModalDirective} from '../../../ng2-bootstrap/components/modal/modal.component';
import {BS_VIEW_PROVIDERS} from '../../../ng2-bootstrap/ng2-bootstrap';
import {AppMarketInfoUtils, MarketUtils} from '../../../utils';
import {AppModeAuthorizationService, AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';
import {LanguageService} from '../../../services';

@Component({
    selector: 'annotation-delayed-modal',
    templateUrl: './annotation-delayed-modal.component.html',
    styleUrls: ['./annotation-delayed-modal.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})
export class AnnotationDelayedModalComponent extends ChannelListener<AnnotationDelayedRequest> {

    @ViewChild(ModalDirective) annotationDelayedModal: ModalDirective;
    symbol: string;
    isChart: boolean;
    appModeFeatureType = AppModeFeatureType;

    constructor(public sharedChannel: SharedChannel, public cd: ChangeDetectorRef, private languageService: LanguageService, public appModeAuthorizationService: AppModeAuthorizationService) {
        super(sharedChannel, ChannelRequestType.AnnotationDelayed);
    }

    protected onChannelRequest(): void {
        if(this.channelRequest.symbol){
            this.symbol = this.channelRequest.symbol;
            this.isChart = this.channelRequest.isChart ? this.channelRequest.isChart : false;
        }
        this.cd.markForCheck();

        this.annotationDelayedModal.show();
    }

    public getSymbolWithoutAbbr(): string {
        if(this.symbol) {
            return MarketUtils.symbolWithoutMarket(this.symbol);
        }
        return '';
    }

    public getMarketName(): string {
        if(this.symbol) {
            let marketAbbr: string = MarketUtils.marketAbbr(this.symbol);
            return AppMarketInfoUtils.getMarketNameByAbbreviation(marketAbbr, true);
        }
        return '';
    }

    public getDerayahAnnotationDelayedText() {
        return  this.languageService.arabic ? `بيانات "${this.getSymbolWithoutAbbr()} " متأخرة 15 دقيقة.` : `${this.getSymbolWithoutAbbr()} data is delayed by 15 minutes.`;
    }

    public getAnnotationDelayedText() {
        let annotationText = this.languageService.arabic ?
            `بيانات "${this.getSymbolWithoutAbbr()} " متأخرة 15 دقيقة. تحتاج الى الإشتراك في باقة ${this.getMarketName()} للحصول على البيانات اللحظية.` :
            `${this.getSymbolWithoutAbbr()} data is delayed by 15 minutes. To get real-time data, please subscribe to ${this.getMarketName()}`;

        return annotationText;
    }

    public getAnnotationDelayedChartText() {
        let annotationText = this.languageService.arabic ?
            `الأسعار على هذا الرسم البياني متأخرة. إذا كنت ترغب في إتخاذ قرارات بناء على البيانات اللحظية, تحتاج إلى الإشتراك في ${this.getMarketName()}.` :
            `Prices on this chart receive delayed updates. If you want to make decisions based on real-time data, please subscribe to ${this.getMarketName()} market`;

        return annotationText;
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

}

export interface AnnotationDelayedRequest extends ChannelRequest{
    symbol: string,
    isChart?: boolean
}
