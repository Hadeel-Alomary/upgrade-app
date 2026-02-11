import {Injectable} from '@angular/core';
import {Streamer, TimeAndSaleMessage} from '../../streaming/index';
import {BigTradeLoader, Company, Loader, Market, MarketsManager} from '../../loader/index';
import {TimeAndSale} from './time-and-sale';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Tc} from '../../../utils/index';

@Injectable()
export class BigTradeService {

    private bigTradeStream:Subject<TimeAndSale>;

    constructor(private loader:Loader, private streamer:Streamer, private bigTradeLoader:BigTradeLoader, private marketsManager:MarketsManager) {

        this.bigTradeStream = new Subject<TimeAndSale>();

        this.loader.getMarketStream().
            subscribe(response => this.onMarketData(response),
                      error => Tc.error(error));

    }

    getBigTradeStream():Subject<TimeAndSale> {
        return this.bigTradeStream;
    }

    loadBigTradeHistory(market:Market):Observable<TimeAndSale[]>{
        return this.bigTradeLoader.loadBigTrades(market.abbreviation)
            .pipe(map(messages => this.mapHistoryData(messages)));
    }

    private onMarketData(market:Market) {
        this.streamer.subscribeBigTrade(market.abbreviation);

        this.streamer.getBigTradeStream(market.abbreviation)
            .subscribe(message => this.onTimeAndSaleMessage(message),
            error => Tc.error(error));
    }

    private onTimeAndSaleMessage(message:TimeAndSaleMessage) {
        let company:Company = this.marketsManager.getCompanyBySymbol(message.symbol);
        let isRealTimeMarket: boolean = this.marketsManager.getMarketBySymbol(message.symbol).isRealTime;
        if(!company) {//Ehab: When company is deleted or ignored like Nomu, we will get no company --> so ignore the message
            return;
        }
        this.bigTradeStream.next(TimeAndSale.fromTimeAndSaleMessage(company, message, isRealTimeMarket));
    }

    private mapHistoryData(messages:TimeAndSaleMessage[]):TimeAndSale[]{
        let timeAndSales:TimeAndSale[] = [];
        messages.forEach(message => {
            let company:Company = this.marketsManager.getCompanyBySymbol(message.symbol);
            if(company) {//Ehab: When company is deleted or ignored like Nomu, we will get no company --> so ignore the message
                timeAndSales.push(TimeAndSale.fromTimeAndSaleMessage(company, message,this.marketsManager.getMarketBySymbol(message.symbol).isRealTime));
            }
        });
        return timeAndSales;
    }

}
