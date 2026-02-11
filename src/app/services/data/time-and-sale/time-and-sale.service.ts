import {Injectable} from "@angular/core";
import {Streamer, TimeAndSaleMessage} from "../../streaming/index";
import {Observable, Subject} from "rxjs";
import {map} from 'rxjs/operators';
import {Loader, Company, Market, PriceLoader, PriceData, MarketsManager} from "../../loader/index";
import {TimeAndSale} from "./time-and-sale";
import {Tc} from "../../../utils/index";
import {AuthorizationService} from '../../auhtorization';


@Injectable()
export class TimeAndSaleService {

    private subscribedSymbol: {[symbol:string]: number}  = {};
    private timeAndSaleStream:Subject<TimeAndSale>;

    constructor(private loader:Loader, private streamer:Streamer, private priceLoader:PriceLoader, private marketsManager:MarketsManager) {
        this.timeAndSaleStream = new Subject<TimeAndSale>();

        this.loader.getMarketStream().subscribe(response => this.onMarketData(response),
            error => Tc.error(error));
    }

    private onMarketData(market:Market) {
        this.streamer.getTimeAndSaleMessageStream(market.abbreviation)
            .subscribe(message => this.onTimeAndSaleMessage(message),
                error => Tc.error(error));
    }

    getTimeAndSaleStream():Subject<TimeAndSale> {
        return this.timeAndSaleStream;
    }

    loadTimeAndSaleHistory(symbol:string, date:string):Observable<TimeAndSale[]> {
        let url = this.marketsManager.getMarketBySymbol(symbol).historicalPricesUrl;
        return this.priceLoader.loadTimeAndSale(url, symbol, '1day', date)
            .pipe(map(prices => this.priceDataToTimeAndSale(symbol, prices)));
    }

    private priceDataToTimeAndSale(symbol:string, prices:PriceData[]):TimeAndSale[] {

        let timeAndSales:TimeAndSale[] = [];
        let company:Company = this.marketsManager.getCompanyBySymbol(symbol);
        let isRealTimeMarket: boolean = this.marketsManager.getMarketBySymbol(symbol).isRealTime;


        prices.forEach(price => {
            timeAndSales.push(new TimeAndSale(
                price.id.toString(), //id
                company.name, //name
                symbol, //symbol
                price.time.split(' ')[0], //date
                price.time.split(' ')[1], //time
                price.close, //price
                price.volume, //volume
                price.amount, //amount
                price.direction, //direction
                price.contracts, //contracts
                price.specialTrade, //specialTrade
                price.state, //state,
                isRealTimeMarket
            ));
        });

        return timeAndSales;
    }

    subscribeSymbol(symbol: string) {
        if (Object.keys(this.subscribedSymbol).includes(symbol)) {
            this.subscribedSymbol[symbol]++;
        } else {
            this.subscribedSymbol[symbol] = 1;
        }

        if (this.subscribedSymbol[symbol] == 1) {
            this.streamer.subscribeTimeAndSale(symbol);
        }
    }

    unSubscribeSymbol(symbol: string) {
        if (Object.keys(this.subscribedSymbol).includes(symbol)) {
            this.subscribedSymbol[symbol]--;
        }

        if (this.subscribedSymbol[symbol] == 0) {
            this.streamer.unSubscribeTimeAndSale(symbol);
        }
    }

    subscribeSymbols(symbols:string[]) {
        (symbols).forEach(symbol => {
            this.subscribeSymbol(symbol);
        });
    }

    unSubscribeSymbols(symbols:string[]) {
        (symbols).forEach(symbol => {
            this.unSubscribeSymbol(symbol);
        });
    }

    private onTimeAndSaleMessage(message:TimeAndSaleMessage){
        let company:Company  = this.marketsManager.getCompanyBySymbol(message.symbol);
        let isRealTimeMarket: boolean = this.marketsManager.getMarketBySymbol(message.symbol).isRealTime;

        if(!company) {//Ehab: When company is deleted or ignored like Nomu, we will get no company --> so ignore the message
            return;
        }
        let timeAndSale = TimeAndSale.fromTimeAndSaleMessage(company, message, isRealTimeMarket);
        this.timeAndSaleStream.next(timeAndSale);
    }
}
