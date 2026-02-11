import {Injectable} from '@angular/core';
import {MarketAlertMessage, Streamer} from '../../streaming/index';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {MarketAlert} from './market-alert';
import {Tc} from '../../../utils/index';
import {Company, Loader, Market, MarketAlertConfig, MarketAlertLoader, MarketAlertsConfig, MarketsManager} from '../../loader/index';

@Injectable()
export class MarketAlertService {

    private marketAlertsConfig:MarketAlertsConfig;

    private marketAlertStream:Subject<MarketAlert>;

    constructor(private streamer:Streamer, private loader:Loader, private marketAlertsLoader:MarketAlertLoader, private marketsManager:MarketsManager){

        this.marketAlertStream = new Subject();

        this.loader.getConfigStream()
            .subscribe(loaderConfig => { if(loaderConfig){ this.marketAlertsConfig = loaderConfig.marketAlerts; } } );

        this.loader.getMarketStream()
            .subscribe((market:Market) => { this.subscribeForMarketAlertsStream(market); });
    }

    getMarketAlertStream():Subject<MarketAlert>{
        return this.marketAlertStream;
    }

    loadMarketAlertHistory(market:Market):Observable<MarketAlert[]> {
        return this.marketAlertsLoader.loadMarketAlerts(market.abbreviation)
            .pipe(map(messages => this.mapHistoryDataToMarketAlerts(messages)));
    }

    private subscribeForMarketAlertsStream(market:Market):void {
        this.streamer.subscribeMarketAlerts(market.abbreviation);
        this.streamer.getMarketAlertStream(market.abbreviation)
            .subscribe(message => this.receivingMarketAlertMessage(message),
                error => Tc.error(error));
    }

    private mapHistoryDataToMarketAlerts(messages:MarketAlertMessage[]):MarketAlert[]{
        let marketAlerts:MarketAlert[] = [];
        messages.forEach(message => {
            if(this.marketsManager.hasCompany(message.symbol)) {
                let marketAlert: MarketAlert = this.streamingMessageToMarketAlert(message);
                if(marketAlert) {
                    marketAlerts.push(marketAlert);
                }
            }
        });
        return marketAlerts;
    }

    private streamingMessageToMarketAlert(message:MarketAlertMessage){
        let config:MarketAlertConfig = this.marketAlertsConfig[message.Type.toLowerCase()];
        let company:Company = this.marketsManager.getCompanyBySymbol(message.symbol);
        return company ? MarketAlert.fromMarketAlertMessage(company, config, message, this.marketsManager.getMarketBySymbol(message.symbol).isRealTime) : null; //Ehab: When company is deleted or ignored like Nomu, we will get no company --> so ignore the message
    }

    private receivingMarketAlertMessage(message:MarketAlertMessage) {
        let marketAlert: MarketAlert = this.streamingMessageToMarketAlert(message);
        if(marketAlert) {
            this.marketAlertStream.next(marketAlert);
        }
    }

}
