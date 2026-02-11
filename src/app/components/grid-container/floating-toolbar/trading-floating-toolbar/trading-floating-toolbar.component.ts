import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    OnDestroy,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';

import {
    Quote,
    Quotes,
    ChannelRequestType,
    Accessor,
    QuoteService,
    AutoLinkType,
    ChannelRequest,
    TradingService
} from '../../../../services/index';

import {
    ChannelListener
} from '../../../modals/index';

import {
    MarketUtils,
    StringUtils
} from '../../../../utils/index';
import {AppBrowserUtils} from '../../../../utils';

@Component({
    selector: 'trading-floating-toolbar',
    templateUrl:'./trading-floating-toolbar.component.html',
    styleUrls:['./trading-floating-toolbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class TradingFloatingToolbarComponent extends ChannelListener<TradingToolbarChannelRequest> implements AfterViewInit, OnDestroy{

    quote:Quote;
    quotes:Quotes;
    visible:boolean = false;

    constructor(
        public cd:ChangeDetectorRef,
        public accessor:Accessor,
        public quoteService:QuoteService,
        public tradingService:TradingService){
        super(accessor.sharedChannel, ChannelRequestType.TradingFloatingToolbar);
    }

    isDesktop():boolean {
        return AppBrowserUtils.isDesktop();
    }

    ngAfterViewInit() {

        this.setPosition(this.tradingService.toolbarPosition);

        this.subscriptions.push(
            this.quoteService.getSnapshotStream()
                .subscribe(quotes => this.onQuotes(quotes))
        );

        this.subscriptions.push(
            this.quoteService.getUpdateStream()
                .subscribe(symbol => this.onUpdate(symbol))
        );

        this.subscriptions.push(
            this.accessor.autoLinkService.getStream()
                .subscribe(autoLinkInfo => this.onAutolink(autoLinkInfo))
        );

        this.subscriptions.push(
            this.tradingService.getSessionStream()
                .subscribe(connected => {
                    if(connected) {
                        this.visible = this.tradingService.toolbarVisible;
                        this.cd.markForCheck();
                    } else {
                        this.visible = false;
                    }
                })
        );

    }

    ngOnDestroy(){
        if(this.quote){
            this.quoteService.unSubscribeQuote(this.quote.symbol);
        }
        this.onDestroy();
    }

    /* Shared Channel */

    protected onChannelRequest(){
        this.visible = !this.visible;
        this.tradingService.toolbarVisible = this.visible;
        this.cd.markForCheck();
    }

    /* position methods */

    setPosition(position:{left:number, top:number}):void{
        $('.trading-floating-toolbar').css('top', position.top);
        $('.trading-floating-toolbar').css('left', position.left);
    }

    savePosition(position:{left:number, top:number}):void{
        this.tradingService.toolbarPosition = position;
    }

    /* data methods */

    onQuotes(quotes:Quotes){
        if(quotes){
            this.quotes = quotes;
        }
    }

    onUpdate(symbol:string){
        if(this.quote && this.quote.symbol == symbol){
            this.cd.markForCheck();
        }
    }

    onAutolink(autoLinkInfo:{autoLinkType:AutoLinkType, pageId:string, symbol:string}){

        if(!this.quotes){
            return;
        }

        if (this.quote)
            this.quoteService.unSubscribeQuote(this.quote.symbol);

        if(!this.tradingService.isSymbolTradableByBroker(autoLinkInfo.symbol)){
            return;
        }

        this.quote = this.quotes.data[autoLinkInfo.symbol];
        this.quoteService.subscribeQuote(this.quote.symbol);
        this.cd.markForCheck();

    }

    /* template helpers */

    get symbol():string{
        return this.quote ? MarketUtils.symbolWithoutMarket(this.quote.symbol) : '-';
    }

    get askPrice():string{
        return this.quote ? StringUtils.formatVariableDigitsNumber(this.quote.askPrice) : '-';
    }

    get bidPrice():string{
        return this.quote ? StringUtils.formatVariableDigitsNumber(this.quote.bidPrice) : '-';
    }

    canBuyAndSell():boolean{
        return this.quote != null;
    }

    /* template events */

    onOpenSell(){
        if(!this.canBuyAndSell()){
            return;
        }
        this.tradingService.openSellScreen(this.quote.symbol);
    }

    onOpenBuy(){
        if(!this.canBuyAndSell()){
            return;
        }

        this.tradingService.openBuyScreen(this.quote.symbol);
    }
}

export interface TradingToolbarChannelRequest extends ChannelRequest{

}
