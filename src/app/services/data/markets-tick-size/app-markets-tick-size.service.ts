import {Injectable} from '@angular/core';
import {Loader, MarketsTickSizeLoaderService} from '../../loader/index';
import {MarketTick} from './market-tick';
import {Tc} from '../../../utils/index';
import {MarketsTickSizeService} from './markets-tick-size.service';
// import {tick} from '@angular/core/testing';
import {AppMathUtils} from '../../../utils/app.math.utils';

@Injectable()
export class AppMarketsTickSizeService implements MarketsTickSizeService{

    private marketsTickSize:{[market:string]:MarketTick[]};

    constructor(private loader:Loader, private marketsTickSizeLoader:MarketsTickSizeLoaderService) {

        this.loader.isLoadingDoneStream()
            .subscribe((loadingDone: boolean) => {
                if (loadingDone) {
                    this.loadTicks();
                }
            });
    }

    public getTickSize(market:string, price:number):number {
        Tc.assert(this.marketsTickSize != null, "Trying to get market tick size before getting init, Market is: " + market);
        let selectedTick = this.marketsTickSize[market].find(tick => {return tick.startPrice <= price && price <= tick.endPrice});
        if(selectedTick){
            return selectedTick.tickSize;
        }

        Tc.info("Cannot find tick size for market " + market + " for price: " + price);
        return 0.1;
    }

    public getVolumeProfilerTickSize(market:string, price:number): number {
        if(market == 'USA') {
            let selectedTick = this.getVolumeProfilerMarketTickSizes(market).find(tick => {return tick.startPrice <= price && price <= tick.endPrice});
            if(selectedTick){
                return selectedTick.tickSize;
            }

            Tc.info("Cannot find tick size for market " + market + " for price: " + price);
            return 0.1;
        }
        return this.getTickSize(market,  price);
    }

    public getMarketTickSizes(market:string):MarketTick[]{
        return this.marketsTickSize ? this.marketsTickSize[market] : [];
    }

    public getVolumeProfilerMarketTickSizes(market:string): MarketTick[] {
        if(market == 'USA') {
            return [
                {tickSize: 0.01, startPrice: 0,   endPrice: 9.99},
                {tickSize: 0.02, startPrice: 10,  endPrice: 24.98},
                {tickSize: 0.05, startPrice: 25,  endPrice: 49.95},
                {tickSize: 0.10, startPrice: 50,  endPrice: 99.90},
                {tickSize: 1,    startPrice: 100, endPrice: Number.MAX_SAFE_INTEGER}
            ]
        }
        return this.getMarketTickSizes(market);
    }

    private loadTicks():void{
        this.marketsTickSizeLoader.loadMarketsTickSize()
            .subscribe((marketsTicks:{[market:string]:MarketTick[]}) => {
                this.marketsTickSize = marketsTicks;
            })
    }

    public getDecreaseStepTickSize(market: string, price: number , priceStep: number): number {
        let marketTickSizes = this.getMarketTickSizes(market);
        if (marketTickSizes) {
            let ticks = marketTickSizes;
            for (let i = 1; i < ticks.length; i++) {
                let roundedNumber = AppMathUtils.roundToNearestStep(+price, priceStep)
                if (roundedNumber === ticks[i].startPrice) {
                    return ticks[i - 1].tickSize;
                }
            }
            return priceStep;
        }
    }

}
