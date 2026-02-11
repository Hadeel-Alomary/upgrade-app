import {Streamer, MarketSummaryMessage} from "../../streaming/index";
import {MarketSummary} from "./market-summary";
import {Subject, BehaviorSubject} from "rxjs";
import {Tc} from "../../../utils/index";
import {Loader, Market, MarketsManager} from "../../loader/index";
import {MiscStateService} from '../../state/index';
import {Injectable} from "@angular/core";

@Injectable()
export class MarketSummaryService {

    private marketSummaryStream:Subject<MarketSummary>;
    private marketStatusChangeStream:Subject<MarketSummary>;
    private lastMarketStatus:string;
    private marketSnapshots:{[marketAbbreviation:string]:MarketSummary} = {};

    constructor(private loader:Loader, private streamer:Streamer, private miscStateService:MiscStateService, private marketsManager:MarketsManager){

        this.marketSummaryStream = new BehaviorSubject<MarketSummary>(null);        
        this.marketStatusChangeStream = new Subject<MarketSummary>();
        
        this.loader.getMarketStream().
            subscribe(response => this.onMarketData(response),
                      error => Tc.error(error));
    }
    
    getMarketSummaryStream():Subject<MarketSummary> {
        return this.marketSummaryStream;
    }

    getMarketStatusChangeStream():Subject<MarketSummary> {
        return this.marketStatusChangeStream;
    }
        
    getSnapshot(marketAbbreviation:string):MarketSummary{
        return this.marketSnapshots[marketAbbreviation];
    }

    getSelectedMarket():Market{
        let marketAbbreviation:string = this.miscStateService.getSelectedMarket();
        let market = marketAbbreviation == null ? null : this.marketsManager.getMarketByAbbreviation(marketAbbreviation);
        if(!market){
            let defaultMarket = this.marketsManager.getDefaultMarket();
            this.miscStateService.setSelectedMarket(defaultMarket.abbreviation);
            return defaultMarket;
        }

        return market;
    }

    setSelectedMarket(market:Market):void{
        this.miscStateService.setSelectedMarket(market.abbreviation);
    }

    private onReceivingMarketSummaryMessage(message:MarketSummaryMessage) {
        
        let marketSummary:MarketSummary = new MarketSummary(
            message.market, //market
            message.date, //date
            message.time, //time
            +message.trades, //trades
            +message.volume, //volume
            +message.value, //amount
            +message.change, //change
            +message.pchange, //percentChange
            +message.index, //index
            +message.liq, //liquidity
            message.status, //status
            +message.totaltraded, //traded
            +message.advances, //advanced
            +message.declined, //declined
            +message.nochange //nochange            
        );

        this.marketSnapshots[marketSummary.market] = marketSummary;
        let selectedMarketAbbreviation:string = this.getSelectedMarket().abbreviation;
        if (selectedMarketAbbreviation == marketSummary.market) {
            this.streamStatusOnChange(marketSummary);
            this.marketSummaryStream.next(marketSummary);
        }
    }
    
    private streamStatusOnChange(marketSummary:MarketSummary) {
        if(!this.lastMarketStatus) {
            this.lastMarketStatus = marketSummary.status;
        }
        
        if(this.lastMarketStatus != marketSummary.status) {
            this.lastMarketStatus = marketSummary.status;
            this.marketStatusChangeStream.next(marketSummary);
        }
    }
    
    private onMarketData(market:Market) {
        this.streamer.subscribeMarketSummary(market.abbreviation);
        this.streamer.getMarketSummaryStream(market.abbreviation)
            .subscribe(message => this.onReceivingMarketSummaryMessage(message),
            error => Tc.error(error));
    }
    
}
