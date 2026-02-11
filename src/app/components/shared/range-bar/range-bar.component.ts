import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Quote, Quotes, QuoteService} from '../../../services/data/quote';
import {Accessor} from '../../../services/accessor';
import {SubscriptionLike as ISubscription} from 'rxjs';
import {StringUtils, Tc} from '../../../utils';
import {LanguageService, MiscStateService} from '../../../services/state';

@Component({
    selector: 'range-bar',
    templateUrl: './range-bar.component.html',
    styleUrls: ['./range-bar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class RangeBarComponent implements OnChanges, OnDestroy {

    @Input() symbol: string;
    @Input() rangeType:RangeType;

    quotes: Quotes;
    quote: Quote;

    protected subscriptions: ISubscription[] = [];

    constructor(public quoteService: QuoteService, public cd: ChangeDetectorRef, public accessor: Accessor, public miscStateService:MiscStateService , private languageService: LanguageService) {
        this.subscriptions.push(
            this.quoteService.getSnapshotStream()
                .subscribe(
                    quotes => this.onQuotes(quotes),
                    error => Tc.error(error)
                )
        );

        this.subscriptions.push(
            this.quoteService.getUpdateStream()
                .subscribe(
                    symbol => this.onUpdate(symbol),
                    error => Tc.error(error)
                )
        );
    }

    ngOnChanges() {
        if(this.quotes) {
            this.quote = this.quotes.data[this.symbol];
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
    }

    /* data handling */
    onQuotes(quotes: Quotes) {
        if (quotes) {
            this.quotes = quotes;
            this.quote = this.quotes.data[this.symbol];
            this.cd.markForCheck();
        }
    }

    onUpdate(symbol: string) {
        if (symbol == this.symbol) {
            this.quote = this.quotes.data[this.symbol];
            this.cd.markForCheck();
        }
    }

    showOpenPriceBalloon(): boolean {
        return Boolean(this.quote && this.quote.open);
    }

    showClosePriceBalloon(): boolean {
        return Boolean(this.quote && this.quote.close);
    }

    getRangePosPct(): number {
        let posPct: number = 0;
        if (this.quote && this.quote.open && this.quote.close) {
            let startPrice: number = Math.min(this.quote.open, this.quote.close);
            posPct = this.getPosPct(startPrice - this.getMinValue());
        }
        return posPct;
    }

    getRangeWidthPct(): number {
        let widthPct: number = 0;
        if (this.quote) {
            widthPct = this.getPosPct(Math.abs(this.getRangeWidth()));
        }
        return widthPct;
    }

    getCloseBalloonPosPct(): number {
        return this.getPosPct(this.quote.close - this.getMinValue());
    }

    getOpenBalloonPosPct(): number {
        return this.getPosPct(this.quote.open - this.getMinValue());
    }

    getRangeColor(): string {
        return this.getRangeWidth() > 0 ? 'rgb(38, 166, 154)' : '#ef5350';
    }

    getPriceFormattedValue(value: number) :string{
        let formattedValue: string;
        if (this.quote) {
            formattedValue = StringUtils.formatVariableDigitsNumber(value);
        }
        return formattedValue;
    }

    getFormattedMaxPrice(): string {
        return this.getPriceFormattedValue(this.getMaxValue());
    }

    getFormattedMinPrice(): string {
        return this.getPriceFormattedValue(this.getMinValue());
    }

    getMinValue(): number{
        if(this.rangeType == RangeType.Day)
            return this.quote.low;
        else if (this.rangeType == RangeType.W52)
            return this.quote.week52Low;
        else
            Tc.error("invalid range bar type " + this.rangeType);
    }

    getMaxValue(): number{
        if(this.rangeType == RangeType.Day)
            return this.quote.high;
        else if (this.rangeType == RangeType.W52)
            return this.quote.week52High;
        else
            Tc.error("invalid range bar type " + this.rangeType);
    }

    getCaption(): string{
        if(this.rangeType == RangeType.Day)
            return this.languageService.translate('مدى يومي');
        else if (this.rangeType == RangeType.W52)
            return this.languageService.translate('مدى 52 أسبوع');
        else
            Tc.error("invalid range bar type " + this.rangeType);
    }

    /* helper methods */

    private getRangeWidth(): number {
        if(isNaN(this.quote.open) || isNaN(this.quote.close)) {
            return 0;
        }
        return this.quote.close - this.quote.open;
    }

    private getPosPct(location: number): number {
        let posPct: number = 0;
        let width: number = this.getBarWidth();
        if (width != 0)
            posPct = location / width * 100;

        //Abu5, TASI index sometimes got openPrice below lowPrice, or closePrice above highPrice
        if(posPct < 0) {
            posPct = 0;
        }
        if(posPct > 100) {
            posPct = 100;
        }

        return posPct;
    }

    getBarWidth(): number {
        let width: number = this.getMaxValue() - this.getMinValue();
        if(!width)
            width = 0;

        return width;
    }

    closePriceBalloonColor() {
        return this.miscStateService.isDarkTheme() ? "#00ff00" : "#26a69a";
    }

    balloonOpacity() {
        return this.miscStateService.isDarkTheme() ? 0.75 : 0.5;
    }

    openPriceBalloonColor() {
        return this.miscStateService.isDarkTheme() ? "#ff0000" : "#ef5350";
    }

    getOpenPriceTitle(): string {
        return this.languageService.translate('الإفتتاح') + ' = ' + this.getPriceFormattedValue(this.quote.open);
    }

    getClosePriceTitle(): string {
        return this.languageService.translate('الإغلاق') + ' = ' + this.getPriceFormattedValue(this.quote.close);
    }
}

export enum RangeType {
    Day = 1,
    W52 = 2
}
