import {TimeAndSaleMessage} from '../../streaming/shared';
import {Tc} from '../../../utils';

const round = require('lodash/round');

export class TradesSummary {
    constructor(
        public id: string,
        public symbol: string,
        public price: number,
        public trades: number,
        public buyTrades: number,
        public sellTrades: number,
        public volume: number,
        public buyVolume: number,
        public sellVolume: number,
        public value: number,
        public buyValue: number,
        public sellValue: number,
    ) {
    }

    static formatTradesSummaryMessage(message: TimeAndSaleMessage): TradesSummary {
        let price: string = round(message.last , 3)
        let trades: number = +(message.split);
        let volume: number = +(message.lastvolume);
        let value: number = Tc._2digits(+price * volume);

        return {
            id: price,
            symbol: message.symbol,
            price: +price,

            trades: trades,
            buyTrades: message.tradestate == 'buy' ? trades : 0,
            sellTrades: message.tradestate == 'sell' ? trades : 0,

            volume: volume,
            buyVolume: message.tradestate == 'buy' ? volume : 0,
            sellVolume: message.tradestate == 'sell' ? volume : 0,

            value: value,
            buyValue: message.tradestate == 'buy' ? value : 0,
            sellValue: message.tradestate == 'sell' ? value : 0,
        };
    }

    static groupByPrice(groupedTradeSummaries: TradesSummary[], newTradeSummary: TradesSummary): void {
        //Grouping trades summary data by price
        let tradeSummary = groupedTradeSummaries.find(trade => trade.id == newTradeSummary.id);
        if (tradeSummary) {
            tradeSummary.trades += newTradeSummary.trades;
            tradeSummary.buyTrades += newTradeSummary.buyTrades;
            tradeSummary.sellTrades += newTradeSummary.sellTrades;

            tradeSummary.volume += newTradeSummary.volume;
            tradeSummary.buyVolume += newTradeSummary.buyVolume;
            tradeSummary.sellVolume += newTradeSummary.sellVolume;

            tradeSummary.value += newTradeSummary.value;
            tradeSummary.buyValue += newTradeSummary.buyValue;
            tradeSummary.sellValue += newTradeSummary.sellValue;
        } else {
            groupedTradeSummaries.push(newTradeSummary);
        }
    }
}
