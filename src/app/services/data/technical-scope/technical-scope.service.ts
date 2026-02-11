import {Injectable} from '@angular/core';
import {Streamer} from '../../streaming/streamer';
import {Company, Loader, Market, MarketsManager} from '../../loader/loader';
import {Observable, Subject} from 'rxjs';
import {TechnicalScopeSignal} from './technical-scope-signal';
import {MarketAlertMessage, TechnicalScopeMessage} from '../../streaming/shared';
import {TechnicalScopeLoader} from '../../loader';
import {Interval} from 'tc-web-chart-lib';
import {map} from 'rxjs/operators';

@Injectable()
export class TechnicalScopeService {

    private streamerSubscription: Subject<TechnicalScopeSignal> = new Subject();
    private subscribedTopics: { [topic: string]: number } = {};

    constructor(private loader: Loader, private streamer: Streamer, private marketsManager: MarketsManager, private technicalScopeLoader: TechnicalScopeLoader) {
        this.subscribeToStreamerMessages();
    }

    public getOnStreamDataSubscription(): Subject<TechnicalScopeSignal> {
        return this.streamerSubscription;
    }

    public loadHistoricalData(interval: Interval, market: Market): Observable<TechnicalScopeSignal[]> {
        return this.technicalScopeLoader.loadTechnicalScopeHistoricalData(this.getServerInterval(interval), market.abbreviation)
            .pipe(map(message => this.processHistoricalData(message)));
    }

    private processHistoricalData(messages: TechnicalScopeMessage[]): TechnicalScopeSignal[] {
        let historicalData: TechnicalScopeSignal[] = [];
        messages.forEach(message => {
            let technicalScopeMessage = this.getTechnicalScopeMessage(message);
            if (technicalScopeMessage) {
                historicalData.push(technicalScopeMessage);
            }
        });
        return historicalData;
    }

    public getTechnicalScopeStrategies(){
        return TechnicalScopeSignal.getTechnicalScopeStrategies();
    }

    public subscribeTopic(interval: Interval, marketAbbr: string) {
        let topic = this.getTopic(interval , marketAbbr);
        if (Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]++;
        } else {
            this.subscribedTopics[topic] = 1;
        }
        if (this.subscribedTopics[topic] == 1) {
            this.streamer.getGeneralPurposeStreamer().subscribeTechnicalScope(this.getServerInterval(interval), marketAbbr);
        }
    }

    public unsubscribeTopic(interval: Interval, marketAbbr: string) {
        let topic = this.getTopic(interval , marketAbbr);
        if (Object.keys(this.subscribedTopics).includes(topic)) {
            this.subscribedTopics[topic]--;
        }
        if (this.subscribedTopics[topic] == 0) {
            this.streamer.getGeneralPurposeStreamer().unSubscribeTechnicalScope(this.getServerInterval(interval) , marketAbbr);
        }
    }

    public getTopic(interval: Interval , marketAbbr: string): string{
        return this.getServerInterval(interval) + '.num-alerts.' + marketAbbr;
    }

    public getServerInterval(interval: Interval): string{
        return Interval.toAlertServerInterval(interval.type);
    }

    private subscribeToStreamerMessages() {
        this.streamer.getGeneralPurposeStreamer().getTechnicalScopeStreamer()
            .subscribe((message: TechnicalScopeMessage) => this.onStreamerMessage(message));
    }

    private onStreamerMessage(message: TechnicalScopeMessage) {
        let technicalScopeMessage = this.getTechnicalScopeMessage(message);
        if (technicalScopeMessage) {
            this.streamerSubscription.next(technicalScopeMessage);
        }
    }

    private getTechnicalScopeMessage(message: TechnicalScopeMessage): TechnicalScopeSignal {
        let company: Company = this.marketsManager.getCompanyBySymbol(message.symbol);
        if(!company) {//Ehab: When company is deleted or ignored like Nomu, we will get no company --> so ignore the message
            return null;
        }

        let isRealTimeMarket: boolean = this.marketsManager.getMarketBySymbol(message.symbol).isRealTime;
        return TechnicalScopeSignal.formatTechnicalScopeSignal(company, message, isRealTimeMarket);
    }
}
