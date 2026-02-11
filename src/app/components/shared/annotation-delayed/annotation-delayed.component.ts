import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AppModeAuthorizationService, AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';
import {LanguageService} from '../../../services';

@Component({
  standalone:true,
  selector: 'annotation-delayed',
  templateUrl: './annotation-delayed.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationDelayedComponent implements OnInit {

    @Input() isChart: boolean = false;
    @Input() marketName: string;
    @Input() symbol: string;



    constructor(public appModeAuthorizationService: AppModeAuthorizationService, public languageService: LanguageService) { }

  ngOnInit() {
  }

    public derayahAnnotationDelayed(): boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.DERAYAH_ANNOTATION_DELAYED);
    }


    public getAnnotationDelayedForDerayahMode(): string {
        if(this.isChart) {
            return this.languageService.arabic ? `الأسعار على هذا الرسم البياني متأخرة.` : `Prices on this chart receive delayed updates.`;
        }else {
            return  this.languageService.arabic ? `بيانات ${this.getSymbolOrMarketAsText()} متأخره 15 دقيقه. ` :
                `${this.getSymbolOrMarketAsText()} data is delayed by 15 minutes.`
        }
    }

    private getSymbolOrMarketAsText(): string {
        return this.symbol ? `" ${this.symbol} "` : this.languageService.translate('السوق')
    }

    public getAnnotationDelayedFooterForDerayahMode(): string {
        return this.languageService.arabic ? `يرجى التواصل مع دراية المالية للحصول على البيانات اللحظية.` : 'Please contact Derayah for real-time data.'
    }
    public getAnnotationDelayedText() {
        if(this.isChart) {
            return this.languageService.arabic ? `الأسعار على هذا الرسم البياني متأخرة. إذا كنت ترغب في اتخاذ قرارات بناء على البيانات اللحظية, تحتاج الى إضافة ${this.marketName} اللحظية `
                : `Prices on this chart receive delayed updates. if you want to make decisions based on real-time data, add ${this.marketName} real-time data `
        }else {
            return this.languageService.arabic ? `   بيانات ${this.getSymbolOrMarketAsText()} متأخرة 15 دقيقة. تحتاج الى إضافة بيانات
                                        ${this.marketName} اللحظية.` : `${this.getSymbolOrMarketAsText()} data is delayed by 15 minutes. You need to add  ${this.marketName} real-time data.`
        }
    }


}
