import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from '@angular/core';
import {MarketsManager, SharedChannel} from '../../../services/index';

@Component({
    standalone:true,
    selector:'trading-context-menu',
    templateUrl:'./trading-context-menu.component.html',
    styleUrls:['./trading-context-menu.component.css'],
    encapsulation:ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TradingContextMenuComponent{
    @Input() symbol:string;
    @Input() price:number;
    showContextMenu:boolean;

    constructor(
                 public cd:ChangeDetectorRef,
                 public marketsManager:MarketsManager,
                 public sharedChannel:SharedChannel) {

        // this.tradingService.getSessionStream()
        //     .subscribe(validSession => {
        //         this.showContextMenu = validSession;
        //         this.cd.markForCheck();
        //     });
    }

    canBuyAndSell():boolean{
      return false;
        // return this.tradingService.isSymbolTradableByBroker(this.symbol);
    }

    onOpenSell(){
        if(!this.canBuyAndSell()){
            return;
        }
        // this.tradingService.openSellScreen(this.symbol, this.price);
    }

    onOpenBuy(){
        if(!this.canBuyAndSell()){
            return;
        }
        // this.tradingService.openBuyScreen(this.symbol, this.price);
    }
}
