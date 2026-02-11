import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {Loader, LoaderConfig, LoaderUrlType} from "../loader/index";
import {Tc} from '../../../utils/index';
import {map} from 'rxjs/operators';
import {MarketTick} from '../../data/markets-tick-size/market-tick';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {ProxyService} from '../loader/proxy.service';

@Injectable()
export class MarketsTickSizeLoaderService extends ProxiedUrlLoader {

    constructor(private http:HttpClient, private loader:Loader, private proxyService: ProxyService){
        super(proxyService);
    }

    public loadMarketsTickSize():Observable<{[market:string]:MarketTick[]}> {
        let url:string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.MarketsTickSize);
        return this.http.get(this.getProxyAppliedUrl(url)).pipe(map((response: MarketTickSizeResponse[]) => this.processMarketsTicksResponse(response)));
    }

    private processMarketsTicksResponse(response:MarketTickSizeResponse[]):{[market:string]:MarketTick[]}{
        let marketsTicks:{[market:string]:MarketTick[]} = {};
        for(let marketTick of response) {
            marketsTicks[marketTick.market] = this.processMarketTicks(marketTick.ticks);
        }

        return marketsTicks;
    }

    private processMarketTicks(ticks:TickSizeResponse[]){
        let marketTicks:MarketTick[] = [];
        for(let tick of ticks){
            marketTicks.push({
                tickSize: +tick.tick_size,
                startPrice: +tick.start_price,
                endPrice: tick["end_price"] === "" ? Number.MAX_SAFE_INTEGER : +tick["end_price"]
            });
        }

        return marketTicks;
    }

}

interface MarketTickSizeResponse {
    market: string,
    ticks: TickSizeResponse[]
}

interface TickSizeResponse {
    end_price: string,
    start_price: string,
    tick_size: string
}
