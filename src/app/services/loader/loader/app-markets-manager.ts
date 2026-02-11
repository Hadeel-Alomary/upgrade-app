import {Injectable} from '@angular/core';
import {Company, Market} from './market';
import {AuthorizationService} from '../../auhtorization';
import {MiscStateService} from '../../state/misc/misc-state.service';
import {MarketsManager} from './markets-manager';
import {ArrayUtils, MarketUtils} from '../../../utils';

import find from 'lodash/find';
// const find = require("lodash/find");

@Injectable()
export class AppMarketsManager implements MarketsManager {

    private loaderMarkets:{[marketAbbreviation:string]:Market} = {};

    constructor(private authorizationService:AuthorizationService,
                private miscStateService:MiscStateService){}

    getAllMarkets():Market[]{
        return ArrayUtils.values(this.loaderMarkets);
    }

    hasUsaMarket():boolean {
        return this.isSubscribedInMarket('USA');
    }

    hasTadMarket(): boolean{
        return this.isSubscribedInMarket('TAD');
    }

    getDefaultMarket():Market{
        let subscribedMarkets = this.getLoaderMarkets();
        // MA if TAD market exists, then return TAD. Otherwise, return any market.
        return "TAD" in subscribedMarkets ? subscribedMarkets["TAD"] : this.getAllMarkets()[0];
    }

    getDefaultSymbol():string{
        return this.getDefaultMarket().companies[0].symbol;
    }

    getMarketById(id:number):Market{
        return find(this.getLoaderMarkets(), (market: Market) => market.id == id);
    }

    getMarketBySymbol(symbol:string):Market{
        let marketAbbreviation:string = MarketUtils.marketAbbr(symbol);
        return this.getMarketByAbbreviation(marketAbbreviation);
    }

    getMarketByAbbreviation(marketAbbreviation:string):Market{
        return this.getLoaderMarkets()[marketAbbreviation];
    }

    isSubscribedInMarket(marketAbbr:string):boolean {
        return marketAbbr in this.getLoaderMarkets();
    }

    getCompanyBySymbol(symbol:string):Company{
        let market = this.getMarketBySymbol(symbol);
        if(!market) {
            return null;
        }
        return market.getCompany(symbol);
    }

    getCompanyById(id:number):Company{
        let allMarkets = this.getAllMarkets();
        for(let i = 0; i < allMarkets.length; ++i){
            let company = allMarkets[i].getCompanyById(id);
            if(company) {
                return company;
            }
        }
        return null;
    }

    hasCompany(symbol:string):boolean {
        let market:Market = this.getMarketBySymbol(symbol);
        if(!market) {
            return false;
        }
        return market.getCompany(symbol) != null;
    }

    subscribedInMultipleMarkets():boolean{
        return 1 < this.getAllMarkets().length;
    }

    addMarket(market:Market):void{
        this.loaderMarkets[market.abbreviation] = market;
    }

    initSelectedMarketForNonSubscribers() {
        // MA for non-registered users, and if there is an initial symbol, then change selected market
        if (!this.authorizationService.isSubscriber()) {
            if (this.miscStateService.hasInitialMarket()) {
                let market: string = this.miscStateService.getInitialMarket();
                this.miscStateService.setSelectedMarket(market);
            }
        }
    }

    private getLoaderMarkets():{[marketAbbreviation:string]:Market} {
        return this.loaderMarkets;
    }

}
