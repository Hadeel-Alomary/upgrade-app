import {Subject,Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {Tc, AppTcTracker} from '../../../utils/index';
import {Loader, StreamerLoader, Market, MarketsManager} from '../../loader/index';
import {HeartbeatManager} from "./heartbeat-manager";
import {SharedChannel, ChannelRequestType} from "../../shared-channel/index";
import {QuoteMessage, TimeAndSaleMessage, MarketSummaryMessage, MarketDepthMessage, MarketAlertMessage} from '../shared/index';
import {LogoutService} from "../../logout/logout.service";
import {MarketStreamer} from './market-streamer';
import {GeneralPurposeStreamer} from "./general-purpose-streamer.service";
import {DebugModeService} from '../../debug-mode/index';
import {ForceScreenReloadRequest} from '../../shared-channel/channel-request';
import {TechnicalReportsStreamer} from './technical-reports-streamer.service';
// import {RealTimeChartUpdaterMessage} from 'tc-web-chart-lib';
import {AuthorizationService} from '../../auhtorization';
import {TechnicalIndicatorStreamer} from './technical-indicator-streamer';
import {FinancialStreamer} from './financial-streamer';
import {StreamerType} from '../shared/streamerType';

@Injectable()
export class Streamer {
    private heartbeatManager:HeartbeatManager;
    private marketStreamers:{[marketAbbreviation:string]:MarketStreamer} = {};
    private generalPurposeStreamer:GeneralPurposeStreamer;
    private financialStreamer: FinancialStreamer;

    private technicalIndicatorStreamer: {[marketAbbreviation: string]: TechnicalIndicatorStreamer} = {};
    private technicalReportsStreamer:{[marketAbbreviation:string]:TechnicalReportsStreamer} = {};

    private static SYNC_TIMEOUT: number = 30*1000; // In milliseconds
    private lastSyncDate: number;
    private syncRequestPending = false;
    private syncRequestsQueue: string[] = [];
    private streamingServersUrlsHistory: StreamingServersUrls;

    constructor(private loader:Loader,
                private streamerLoader:StreamerLoader,
                private sharedChannel:SharedChannel,
                private logoutService:LogoutService,
                private marketsManager:MarketsManager,
                private debugModeService: DebugModeService,
                private authorizationService:AuthorizationService) {

        this.heartbeatManager = new HeartbeatManager(this, this.logoutService);
        this.loader.getMarketStream().subscribe((market:Market) => {
            this.marketStreamers[market.abbreviation] = new MarketStreamer(this.heartbeatManager, market, this.debugModeService, this.authorizationService);
            this.technicalReportsStreamer['TECHNICAL_REPORTS_' + market.abbreviation] = new TechnicalReportsStreamer(this.heartbeatManager, market, this.debugModeService);

            if(this.authorizationService.isSubscriber() && market.isRealTime){//Indicator Streamer is only available for subscribed markets
                this.technicalIndicatorStreamer['I_' + market.abbreviation] = new TechnicalIndicatorStreamer(this.heartbeatManager, market, this.debugModeService, this.authorizationService);
            }
        });

        this.generalPurposeStreamer = new GeneralPurposeStreamer(this.heartbeatManager);
        this.financialStreamer = new FinancialStreamer(this.heartbeatManager);

        this.loader.isLoadingDoneStream().subscribe(loadingDone => {
            if(loadingDone) {
                this.generalPurposeStreamer.initChannel(loader.getGeneralPurposeStreamerUrl(), true);
                this.financialStreamer.initChannel(loader.getFinancialStreamerUrl(), false);
            }
        });
    }

    onDestroy() {
        this.heartbeatManager.disconnect();
        Object.values(this.marketStreamers).forEach((marketStreamer:MarketStreamer) => {
            marketStreamer.onDestroy();
        });

        Object.values(this.technicalIndicatorStreamer).forEach((technicalIndicatorStream: TechnicalIndicatorStreamer) => {
            technicalIndicatorStream.onDestroy();
        })

        Object.values(this.technicalReportsStreamer).forEach((technicalReportsStreamer: TechnicalReportsStreamer) => {
            technicalReportsStreamer.onDestroy();
        })

        this.generalPurposeStreamer.onDestroy();
    }

    getGeneralPurposeStreamer():GeneralPurposeStreamer {
        return this.generalPurposeStreamer;
    }

    getFinancialStreamer(): FinancialStreamer {
        return this.financialStreamer;
    }

    getTechnicalIndicatorStream(market: string): TechnicalIndicatorStreamer {
        let indicatorMarket = 'I_' + market;
        if(this.technicalIndicatorStreamer[indicatorMarket]){
            return this.technicalIndicatorStreamer[indicatorMarket]
        }
        return null;
    }

    subscribeQuotes(market:string , symbols:string[]){
        if(!this.marketStreamers || !this.marketStreamers[market]) {
            Tc.warn("Market streamer is not ready for " + market )
        }
        this.marketStreamers[market].subscribeQuotes(symbols);
    }

    unSubscribeQuote(market:string , symbol:string){
        this.marketStreamers[market].unSubscribeQuote(symbol);
    }

    unSubscribeQuotes(market:string , symbols:string[]) {
        this.marketStreamers[market].unSubscribeQuotes(symbols);
    }

    subscribeTimeAndSale(symbol:string){
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].subscribeTimeAndSale(symbol);
    }

    unSubscribeTimeAndSale(symbol:string){
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].unSubscribeTimeAndSale(symbol);
    }

    subscribeChartIntraday(symbol:string){
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].subscribeChartIntrday(symbol);
    }

    unSubscribeChartIntraday(symbol:string) {
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].unSubscribeChartIntrday(symbol);
    }

    subscribeChartDaily(symbol:string){
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].subscribeChartDaily(symbol);
    }

    unSubscribeChartDaily(symbol:string) {
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].unSubscribeChartDaily(symbol);
    }

    subscribeMarketSummary(market:string){
        this.marketStreamers[market].subscribeMarketSummary();
    }

    subscribeMarketDepthByOrder(symbol:string) {
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].subscribeMarketDepthByOrder(symbol);
    }

    subscribeMarketDepthByPrice(symbol:string) {
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].subscribeMarketDepthByPrice(symbol);
    }

    unSubscribeMarketDepthByOrder(symbol:string) {
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].unSubscribeMarketDepthByOrder(symbol);
    }

    unSubscribeMarketDepthByPrice(symbol:string) {
        let market:Market = this.marketsManager.getMarketBySymbol(symbol);
        this.marketStreamers[market.abbreviation].unSubscribeMarketDepthByPrice(symbol);
    }

    subscribeMarketAlerts(market:string) {
        this.marketStreamers[market].subscribeMarketAlerts();
    }

    subscribeBigTrade(market:string) {
        this.marketStreamers[market].subscribeBigTrade();
    }

    getLiquidityStream(market:string): TechnicalReportsStreamer {
        let LiquidityMarket = 'TECHNICAL_REPORTS_' + market;
        if(this.technicalReportsStreamer[LiquidityMarket]){
            return this.technicalReportsStreamer[LiquidityMarket]
        }
        return null;
    }

    getQuoteMessageStream(market:string):Subject<QuoteMessage> {
        return this.marketStreamers[market].getQuoteMessageStream();
    }

    getTimeAndSaleMessageStream(market:string):Subject<TimeAndSaleMessage> {
        return this.marketStreamers[market].getTimeAndSaleMessageStream();
    }

    // getChartIntradayMessageStream(market:string):Subject<RealTimeChartUpdaterMessage> {
    //     return this.marketStreamers[market].getChartIntradayMessageStream();
    // }
    //
    // getChartDailyMessageStream(market:string):Subject<RealTimeChartUpdaterMessage> {
    //     return this.marketStreamers[market].getChartDailyMessageStream();
    // }

    getMarketSummaryStream(market:string):Subject<MarketSummaryMessage> {
        return this.marketStreamers[market].getMarketSummaryStream();
    }

    getMarketDepthByOrderStream(market:string):Subject<MarketDepthMessage> {
        return this.marketStreamers[market].getMarketDepthByOrderStream();
    }

    getMarketAlertStream(market:string):Subject<MarketAlertMessage> {
        return this.marketStreamers[market].getMarketAlertStream();
    }

    getBigTradeStream(market:string):Subject<TimeAndSaleMessage> {
        return this.marketStreamers[market].getBigTradeStream();
    }

    // MA when heartbeat times out, we need to get a new url and re-subscribe our topics
    onHeartbeatTimeout(streamerType: string) {
        // first step, get host_port (new streamer url) to ensure that we are connected to
        // the internet (even though next logic is not using it and instead reload workspace).

        let canGetStreamerUrlFromHistory: boolean = this.lastSyncDate && this.lastSyncDate > Date.now() - Streamer.SYNC_TIMEOUT;
        // Check if stored URLs are available and not expired
        if (canGetStreamerUrlFromHistory) {
            this.syncRequestsQueue.push(streamerType);
            this.processRequestPendingQueue();
        } else {
            if(this.syncRequestPending){// Need one request per time
                this.syncRequestsQueue.push(streamerType);
                return;
            }
            // Start the request if no request is pending
            this.syncRequestPending = true;

            this.syncStreamingServersUrlsHistory().subscribe(isDone => {
                this.syncRequestPending = false;
                this.lastSyncDate = Date.now();
                this.syncRequestsQueue.push(streamerType);
                this.processRequestPendingQueue();
            }, error => {
                this.syncRequestPending = false;
            });
        }
    }

    public canReconnectStreamer(streamerType: string): boolean {
        //Ehab: only reconnect market data realtime streamer , so market technical streamer 'TECHNICAL_REPORTS_' or market indicator streamer 'I_' will not disconnect the app
        let market = this.marketsManager.getMarketByAbbreviation(streamerType);
        if(market && market.isRealTime){
            return true;//No reconnect for delayed market streamers
        }
        return false;
    }

    private processRequestPendingQueue() {
        // After processing, check if there are pending requests in the queue
        this.syncRequestsQueue.forEach(streamerType => {
            this.connectToStreamer(streamerType)
        });
    }

    private connectToStreamer(streamerType: string) {
        const url = this.getStreamerUrl(streamerType); // get locally stored URL.
        this.initStreamerChannel(streamerType, url);
        AppTcTracker.trackHeartbeatReloading(streamerType);

        const forceScreenReloadRequest: ForceScreenReloadRequest = {
            type: ChannelRequestType.ForceScreenReload,
            market: streamerType
        };
        this.sharedChannel.request(forceScreenReloadRequest);
    }

    private getStreamerUrl(streamerTypeString: string): string {
        let streamerType = this.getStreamerType(streamerTypeString);

        if(streamerType === StreamerType.GeneralPurpose)
            return this.streamingServersUrlsHistory.generalPurposeStreamer;
        else if(streamerType === StreamerType.TechnicalReports) {
            let marketAbbr = streamerTypeString.split('_')[2];
            return this.streamingServersUrlsHistory.technicalReportsStreamerV2[marketAbbr];
        } else if(streamerType === StreamerType.Financial)
            return this.streamingServersUrlsHistory.financialStreamer;
        else if(streamerType === StreamerType.Indicator)
            return this.streamingServersUrlsHistory.streamingIndicatorServer[streamerTypeString];
        else if(streamerType === StreamerType.Market)
            return this.streamingServersUrlsHistory.streamingServer[streamerTypeString];
    }

    private syncStreamingServersUrlsHistory() : Observable<boolean> {
        return this.streamerLoader.loadStreamerUrl(this.loader.getStreamersUrl()).pipe(map(streamersResponse => {
            this.streamingServersUrlsHistory = {
                streamingServer: {}, // Initialize as an empty object
                streamingIndicatorServer: {}, // Initialize as an empty object
                generalPurposeStreamer: `https://${streamersResponse.response.GENERAL_PURPOSE_STREAMER.DOMAIN_NAME}/streamhub/`,
                technicalReportsStreamerV2: {},
                financialStreamer: `https://${streamersResponse.response.FINANCIAL_STREAMER.DOMAIN_NAME}/streamhub/`,
            };

            // Fill streamingServer with domain names
            for (const marketId of Object.keys(streamersResponse.response.STREAMING_SERVER)) {
                const server = streamersResponse.response.STREAMING_SERVER[marketId];
                const streamerAbbr = server['ABB'];
                this.streamingServersUrlsHistory.streamingServer[streamerAbbr] = `https://${server.DOMAIN_NAME}/streamhub/`;
            }

            // Fill streamingServer with domain names
            for (const marketId of Object.keys(streamersResponse.response.TECHNICAL_REPORTS_STREAMER_V2)) {
                const server = streamersResponse.response.TECHNICAL_REPORTS_STREAMER_V2[marketId];
                const streamerAbbr = server['ABB'];
                this.streamingServersUrlsHistory.technicalReportsStreamerV2[streamerAbbr] = `https://${server.DOMAIN_NAME}/streamhub/`;
            }

            // Optionally, fill streamingIndicatorServer if it exists
            if (streamersResponse.response.STREAMING_INDICATOR_SERVER) {
                for (const marketId of Object.keys(streamersResponse.response.STREAMING_INDICATOR_SERVER)) {
                    const server = streamersResponse.response.STREAMING_INDICATOR_SERVER[marketId];
                    const streamerAbbr = "I_" + server['ABB'];
                    this.streamingServersUrlsHistory.streamingIndicatorServer[streamerAbbr] = `https://${server.DOMAIN_NAME}/streamhub/`;
                }
            }

            return true;
        }))
    }

    private initStreamerChannel(streamerTypeString: string, url: string) {
        let streamerType = this.getStreamerType(streamerTypeString);

        if(streamerType === StreamerType.GeneralPurpose)
            this.generalPurposeStreamer.reInitChannel(url);
        else if(streamerType === StreamerType.TechnicalReports) {
            this.technicalReportsStreamer[streamerTypeString].reInitChannel(url);
        } else if(streamerType === StreamerType.Indicator)
            this.technicalIndicatorStreamer[streamerTypeString].reInitChannel(url);
        else if(streamerType === StreamerType.Financial) {
            this.financialStreamer.reInitChannel(url);
        }
        else
            this.marketStreamers[streamerTypeString].reInitChannel(url);
    }

    public getStreamerType(streamerTypeString: string): StreamerType {
        if(streamerTypeString === StreamerType.GeneralPurpose)
            return StreamerType.GeneralPurpose;
        else if(streamerTypeString.startsWith('TECHNICAL_REPORTS_'))
            return StreamerType.TechnicalReports;
        else if(streamerTypeString === StreamerType.Financial)
            return StreamerType.Financial;
        else if(streamerTypeString.startsWith('I_'))
            return StreamerType.Indicator;
        else
            return StreamerType.Market;
    }
}

interface StreamingServersUrls {
    streamingServer: { [key: number]: string },
    streamingIndicatorServer?: { [key: number]: string }, // Optional for subscribers only
    generalPurposeStreamer: string,
    technicalReportsStreamerV2?: { [key: number]: string },
    financialStreamer: string,
}
