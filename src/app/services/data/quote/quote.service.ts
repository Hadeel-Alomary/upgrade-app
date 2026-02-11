import {Injectable} from "@angular/core";
import {Loader, Company, CompanyFlag, Market, MarketsManager, Sector} from '../../loader/index';
import {Quote, Quotes} from "./quote";
import {BehaviorSubject, Subject} from "rxjs";
import {Tc, MarketUtils} from '../../../utils/index';
import {AlertService} from "../alert/index";
import {NewsService} from '../news/index';
import {AnalysisCenterService} from '../analysis-center/index';
import {Streamer} from "../../streaming/index";
import {StreamerQuoteUpdater, NewsQuoteUpdater, AlertQuoteUpdater, AnalysisQuoteUpdater, TechnicalIndicatorQuoteUpdater, TechnicalScopeQuoteUpdater} from './quote-updater/index';
// import {MessageBoxRequest} from '../../../components/modals/popup/message-box';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {LanguageService} from '../../state/language';
import {TechnicalScopeQuoteService, TechnicalIndicatorQuoteService} from '../technical-indicator';
import {AuthorizationService} from "../../auhtorization/authorization.service";


@Injectable()
export class QuoteService {

    private snapshotStream:Subject<Quotes>;
    private updateStream:Subject<string>;

    private snapshotReceived:boolean = false;
    private snapshotTimerStarted:boolean = false;

    private static SNAPSHOT_WAIT_TIME_PER_MARKET:number = 500;

    constructor(
        private loader:Loader,
        private alertService:AlertService,
        private newsService:NewsService,
        private technicalIndicatorQuoteService: TechnicalIndicatorQuoteService,
        private technicalScopeQuoteService: TechnicalScopeQuoteService,
        private streamer:Streamer,
        private marketsManager:MarketsManager,
        private analysisCenterService:AnalysisCenterService,
        private languageService:LanguageService,
        private authorizationService: AuthorizationService,
        private sharedChannel:SharedChannel) {

        this.snapshotStream = new BehaviorSubject<Quotes>(null);
        this.updateStream = new Subject<string>();
        Quotes.quotes = new Quotes();

        // create updaters
        let streamerUpdater:StreamerQuoteUpdater = new StreamerQuoteUpdater(loader, streamer);
        let newsUpdater:NewsQuoteUpdater = new NewsQuoteUpdater(loader, newsService);
        let alertUpdater:AlertQuoteUpdater = new AlertQuoteUpdater(loader, alertService);
        let analysisUpdater:AnalysisQuoteUpdater = new AnalysisQuoteUpdater(loader, analysisCenterService);
        let technicalIndicatorQuoteUpdater: TechnicalIndicatorQuoteUpdater = new TechnicalIndicatorQuoteUpdater(loader, technicalIndicatorQuoteService);
        let technicalScopeQuoteUpdater: TechnicalScopeQuoteUpdater = new TechnicalScopeQuoteUpdater(loader, technicalScopeQuoteService)

        this.subscribeOnUpdaters(streamerUpdater, newsUpdater, alertUpdater, analysisUpdater, technicalIndicatorQuoteUpdater, technicalScopeQuoteUpdater);

        this.loader.getMarketStream().
            subscribe(response => this.createQuotes(response),
                      error => Tc.error(error));

    }

    getSnapshotStream():Subject<Quotes> {
        return this.snapshotStream;
    }

    getUpdateStream():Subject<string> {
        return this.updateStream;
    }

    getQuotes():Quotes{
        return Quotes.quotes;
    }

    private subscribeOnUpdaters(streamerUpdater:StreamerQuoteUpdater, newsUpdater:NewsQuoteUpdater, alertUpdater:AlertQuoteUpdater, analysisUpdater:AnalysisQuoteUpdater, technicalIndicatorQuoteUpdater: TechnicalIndicatorQuoteUpdater, technicalScopeQuoteUpdater: TechnicalScopeQuoteUpdater):void {
        streamerUpdater.getQuoteUpdaterStream()
            .subscribe((symbol: string) => {
                this.pushQuoteUpdate(symbol);
            });

        newsUpdater.getQuoteUpdaterStream()
            .subscribe((symbol: string) => {
                this.pushQuoteUpdate(symbol);
            });

        alertUpdater.getQuoteUpdaterStream()
            .subscribe((symbol: string) => {
                this.pushQuoteUpdate(symbol);
            });

        analysisUpdater.getQuoteUpdaterStream()
            .subscribe((symbol: string) => {
                this.pushQuoteUpdate(symbol);
            });

        technicalIndicatorQuoteUpdater.getQuoteUpdaterStream()
            .subscribe((symbol: string) => {
                this.pushQuoteUpdate(symbol);
            });

        technicalScopeQuoteUpdater.getQuoteUpdaterStream()
            .subscribe((symbol: string) =>{
                this.pushQuoteUpdate(symbol);
            })
    }

    private pushQuoteUpdate(symbol:string) {
        if(this.snapshotReceived){
            this.updateStream.next(symbol);
        }else if(!this.snapshotTimerStarted){
            this.startSnapshotTimer();
        }
    }

    private createQuotes(market:Market) {
        market.companies.forEach(company => this.createQuote(market, company));
    }

    private createQuote(market:Market, company:Company) {
        let companyFlag:CompanyFlag = market.companyFlags.find(companyFlag => companyFlag.symbol == company.symbol);
        let sector: Sector = market.sectors.find(sector => sector.id == company.categoryId);
        let quote = new Quote(company, market.abbreviation, market.isRealTime, companyFlag, sector, this.authorizationService.isSubscriber());
        Tc.assert(!(company.symbol in Quotes.quotes.data), "attempt to insert duplicates of symbol: " + company.symbol)
        Quotes.quotes.data[company.symbol] = quote;
        Quotes.quotes.list.push(quote);
    }

    private startSnapshotTimer() {
        // MA after start receiving snapshot, then wait for SNAPSHOT_WAIT_TIME * number of markets before
        // declaring that snapshot is "received" and start pushing it around.
        // Reason to do that is to limit the number of "updates" that are sent during the snapshot loading,
        // which caused the marketwatch to be very slow for multi-markets (specially if there are
        // many marketwatches open)
        this.snapshotTimerStarted = true;
        setTimeout(() => {
            this.snapshotReceived = true;
            this.snapshotStream.next(Quotes.quotes);
        }, QuoteService.SNAPSHOT_WAIT_TIME_PER_MARKET * this.marketsManager.getAllMarkets().length);
    }

    /* Subscription */
    private subscribedSymbol: { [symbol: string]: number } = {};

    subscribeQuote(symbol: string): void {
        if(symbol) {
            this.subscribeQuotes([symbol]);
        }
    }

    subscribeQuotes(symbols: string[]): void {
        let newSymbols: string[] = [];
        symbols.forEach(symbol => {
            if (this.subscribedSymbol.hasOwnProperty(symbol)) {
                this.subscribedSymbol[symbol]++;
            } else {
                newSymbols.push(symbol);
            }
        });
        if(newSymbols.length > 0) {
            let needToSubscribe = this.groupSymbolsByMarket(newSymbols);
            let subscribedSymbolsMarket = this.groupSymbolsByMarket(Object.keys(this.subscribedSymbol));
            Object.keys(needToSubscribe).forEach(marketAbrv => {
                let subscriptionCount = subscribedSymbolsMarket[marketAbrv] ? subscribedSymbolsMarket[marketAbrv].length + needToSubscribe[marketAbrv].length : 0;
                if ( subscriptionCount  > 700) { // check if reached the subscribed quotes per market
                    this.showExceedMessage(this.marketsManager.getMarketByAbbreviation(marketAbrv).name);
                    return; // Abu5, no need to continue subscription
                } else {
                    needToSubscribe[marketAbrv].forEach(symbol => this.subscribedSymbol[symbol] = 1);
                    this.streamer.subscribeQuotes(marketAbrv, needToSubscribe[marketAbrv]);
                }
            });
        }
    }

    unSubscribeQuote(symbol: string): void {
        if(symbol) {
            this.unSubscribeQuotes([symbol]);
        }
    }

    unSubscribeQuotes(symbols: string[]): void {
        let newSymbols: string[] = [];
        symbols.forEach(symbol => {
            if (!symbol) return;
            if (this.subscribedSymbol.hasOwnProperty(symbol)) {
                this.subscribedSymbol[symbol]--;
                if (this.subscribedSymbol[symbol] == 0) {
                    delete this.subscribedSymbol[symbol];
                    newSymbols.push(symbol);
                }
           }
        });

        if(newSymbols.length > 0) {
            let needToUnSubscribe = this.groupSymbolsByMarket(newSymbols);
            Object.keys(needToUnSubscribe).forEach(marketAbrv => {
                this.streamer.unSubscribeQuotes(marketAbrv, needToUnSubscribe[marketAbrv]);
            });
        }
    }

    private groupSymbolsByMarket(symbols: string[]) : { [marketAbbr: string]:  string[]  } {
        let symbolsByMarket: { [marketAbbr: string]:  string[]  } = {};
        symbols.forEach(symbol => {
            let marketAbbr = MarketUtils.marketAbbr(symbol);
            if (!Object.keys(symbolsByMarket).includes(marketAbbr)) {
                symbolsByMarket[marketAbbr] = [symbol];
            } else {
                symbolsByMarket[marketAbbr].push(symbol);
            }
        });
        return symbolsByMarket;
    }

    private showExceedMessage(marketName:string): void {
        let message: string = this.languageService.translate('اشتراكك الحالي يدعم متابعة (700) شركة في') + ' ' + marketName;
        let message2:string = this.languageService.translate('الرجاء حذف بعض الشركات الحالية لتتمكن من متابعة شركات أخرى .');
        // let request: MessageBoxRequest = {type: ChannelRequestType.MessageBox, messageLine: message,messageLine2: message2};
        // this.sharedChannel.request(request);
    }
}
