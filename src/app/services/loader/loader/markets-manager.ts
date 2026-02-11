import {Injectable} from '@angular/core';
import {Company, Market} from './market';

@Injectable()
export abstract class MarketsManager {

    public abstract getAllMarkets():Market[];

    public abstract hasUsaMarket():boolean;

    public abstract hasTadMarket(): boolean;

    public abstract getDefaultMarket():Market;

    public abstract getDefaultSymbol():string;

    public abstract getMarketById(id:number):Market;

    public abstract getMarketBySymbol(symbol:string):Market;

    public abstract getMarketByAbbreviation(marketAbbreviation:string):Market;

    public abstract isSubscribedInMarket(marketAbbr:string):boolean;

    public abstract getCompanyBySymbol(symbol:string):Company;

    public abstract getCompanyById(id:number):Company;

    public abstract hasCompany(symbol:string):boolean;

    public abstract subscribedInMultipleMarkets():boolean;

    public abstract addMarket(market:Market):void;

    public abstract initSelectedMarketForNonSubscribers():void;

}
