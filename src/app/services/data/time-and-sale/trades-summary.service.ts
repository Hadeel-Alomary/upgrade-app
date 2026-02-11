import {Injectable} from '@angular/core';
import {Loader, Market, MarketsManager} from '../../loader/loader';
import {PriceData, PriceLoader} from '../../loader';
import {map} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {Streamer} from '../../streaming/streamer';
import {Tc} from '../../../utils';
import {TimeAndSaleMessage} from '../../streaming/shared';
import {TradesSummary} from './trades-summary';

const round = require('lodash/round');

@Injectable()
export class TradesSummaryService {

    private tradesSummaryStream: Subject<TradesSummary>;

    constructor(private loader: Loader, private streamer: Streamer, public marketsManager: MarketsManager, private priceLoader:PriceLoader) {
        this.tradesSummaryStream = new Subject<TradesSummary>();
        this.loader.getMarketStream().subscribe(response => this.onMarketData(response),
            error => Tc.error(error));
    }

    private onMarketData(market: Market): void {
        this.streamer.getTimeAndSaleMessageStream(market.abbreviation)
            .subscribe(message => this.onTimeAndSaleMessage(message),
                error => Tc.error(error));
    }

    public getTradesSummaryStream(): Subject<TradesSummary> {
        return this.tradesSummaryStream;
    }

    private onTimeAndSaleMessage(message: TimeAndSaleMessage): void {
        this.tradesSummaryStream.next(TradesSummary.formatTradesSummaryMessage(message));
    }

    public loadHistoricalData(symbol: string, date: string): Observable<TradesSummary[]> {
        return this.priceLoader.loadTimeAndSale(this.marketsManager.getMarketBySymbol(symbol).historicalPricesUrl, symbol, '1day', date)
            .pipe(map(prices => this.onHistoricalData(symbol, prices)));
    }

    private onHistoricalData(symbol: string, priceData: PriceData[]): TradesSummary[] {
        let historicalTradesSummaries: TradesSummary[] = [];
        let priceDecimals: number = (this.marketsManager.getMarketBySymbol(symbol).abbreviation == 'USA') ? 2 : 3;
        priceData.forEach(priceData => {
            let price = round(priceData.close, priceDecimals);
            historicalTradesSummaries.push(new TradesSummary(
                price, //id
                symbol, //symbol
                +price, //price
                priceData.contracts, //trades
                priceData.state == 'buy' ? priceData.contracts : 0, //buyTrades
                priceData.state == 'sell' ? priceData.contracts : 0, //sellTrades
                priceData.volume, //volume
                priceData.state == 'buy' ? priceData.volume : 0, //buyVolume
                priceData.state == 'sell' ? priceData.volume : 0, //sellVolume
                priceData.amount, //value
                priceData.state == 'buy' ? priceData.amount : 0, //buyValue
                priceData.state == 'sell' ? priceData.amount : 0, //sellValue
            ));
        });
        return  historicalTradesSummaries;
    }

    public groupTradesSummaryData(groupedTradeSummaries: TradesSummary[], newTradesSummary: TradesSummary[], ): void {
        newTradesSummary.forEach(tradeSummary => {
            TradesSummary.groupByPrice(groupedTradeSummaries, tradeSummary);
        });
    }

}
