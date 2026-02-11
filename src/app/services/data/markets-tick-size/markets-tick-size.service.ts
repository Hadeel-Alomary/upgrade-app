import {MarketTick} from './market-tick';
import {Injectable} from '@angular/core';

@Injectable()
export abstract class MarketsTickSizeService {
    public abstract getTickSize(market:string, price:number):number;
    public abstract getDecreaseStepTickSize(market:string, price: number , priceStep: number): number;
    public abstract getVolumeProfilerTickSize(market:string, price:number):number;

    public abstract getMarketTickSizes(market:string):MarketTick[];
    public abstract getVolumeProfilerMarketTickSizes(market:string):MarketTick[];
}

