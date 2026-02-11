import {Injectable} from '@angular/core';
import {MarketTick} from './market-tick';
import {Tc} from '../../../utils/index';
import {MarketsTickSizeService} from './markets-tick-size.service';
import {tick} from '@angular/core/testing';
import {AppMathUtils} from '../../../utils/app.math.utils';

@Injectable()
export class ElementMarketsTickSizeService implements MarketsTickSizeService {

    private marketsTickSize:{[market:string]:MarketTick[]};

    constructor() {
        this.loadTicks();
    }

    public getTickSize(market:string, price:number):number{

        // MA abu5 suggested to use TickSize of 1 for indices, as they have large values and a small tick sizes may cause
        // excessive slowness.
        // return 1.00;
        // Abu5 update the above scenario, since we need this to improve calculation performance,
        // the new scenario will return 1 if the price exceeds 500
        // **  this new scenario is added to remove MarketsManager dependency, in order to be abel
        // to inject this service for chart element viewer  **

        if(price>500) {
            return 1;
        }

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
        this.getTickSize(market, price);
    }

    public getMarketTickSizes(market:string):MarketTick[]{
        return this.marketsTickSize[market] ;
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

    private loadTicks(): void {
        this.marketsTickSize =
        {
            'TAD':
                [
                    {tickSize: 0.01, startPrice: 0, endPrice: 24.99},
                    {tickSize: 0.02, startPrice: 25, endPrice: 49.98},
                    {tickSize: 0.05, startPrice: 50, endPrice: 99.95},
                    {tickSize: 0.10, startPrice: 100, endPrice: 249.90},
                    {tickSize: 0.20, startPrice: 250, endPrice: 499.80},
                    {tickSize: 0.50, startPrice: 500, endPrice: Number.MAX_SAFE_INTEGER}
                ]
        },
        {
            'KSE':
                [
                    {tickSize: 0.1, startPrice: 0, endPrice: 100.9},
                    {tickSize: 1, startPrice: 101, endPrice: Number.MAX_SAFE_INTEGER}
                ]
        },
        {
            'DFM':
                [
                    {tickSize: 0.001, startPrice: 0.001, endPrice: 0.999},
                    {tickSize: 0.01, startPrice: 1, endPrice: 9.99},
                    {tickSize: 0.05, startPrice: 10, endPrice: 99.95},
                    {tickSize: 0.10, startPrice: 100, endPrice: Number.MAX_SAFE_INTEGER}
                ]
        },
        {
            'ADX':
                [
                    {tickSize: 0.001, startPrice: 0.001, endPrice: 0.999},
                    {tickSize: 0.01, startPrice: 1, endPrice: 9.99},
                    {tickSize: 0.05, startPrice: 10, endPrice: 99.95},
                    {tickSize: 0.10, startPrice: 100, endPrice: Number.MAX_SAFE_INTEGER}
                ]
        },
        {
            'DSM':
                [
                    {tickSize: 0.001, startPrice: 0.001, endPrice: 10},
                    {tickSize: 0.10, startPrice: 10.001, endPrice: Number.MAX_SAFE_INTEGER}
               ]
        },
        {
            'ASE':
                [
                    {tickSize: 0.01, startPrice: 0, endPrice: Number.MAX_SAFE_INTEGER}
                ]
        },
        {
            'EGY':
                [
                    {tickSize: 0.001, startPrice: 0, endPrice: 1.999},
                    {tickSize: 0.01, startPrice: 2, endPrice: Number.MAX_SAFE_INTEGER}
                ]
        },
        {
            'USA':
                [
                    {tickSize: 0.01, startPrice: 0, endPrice: Number.MAX_SAFE_INTEGER}
                ]
        };
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
