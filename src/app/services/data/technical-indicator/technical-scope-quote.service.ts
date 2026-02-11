import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Loader, Market, MarketsManager} from '../../loader/loader';
import {Streamer} from '../../streaming/streamer';
import {MarketUtils} from '../../../utils';
import {TechnicalScopeMessage} from '../../streaming/shared';
import {AuthorizationService} from '../../auhtorization';

@Injectable()
export class TechnicalScopeQuoteService {

    private technicalScopeMessage: Subject<TechnicalScopeMessage>;
    private subscribedTopics: { [topic: string]: number } = {};


    constructor(private loader: Loader, private streamer: Streamer, private authorizationService: AuthorizationService,
                private marketsManager: MarketsManager) {
        this.technicalScopeMessage = new BehaviorSubject<TechnicalScopeMessage>(null);
        this.streamer.getGeneralPurposeStreamer().getTechnicalScopeQuoteStreamer()
            .subscribe((message: TechnicalScopeMessage) => this.onStreamingMessage(message));
    }

    public getTechnicalScopeQuoteStream(): Subject<TechnicalScopeMessage> {
        return this.technicalScopeMessage;
    }

    private onStreamingMessage(message: TechnicalScopeMessage) {
        this.technicalScopeMessage.next(message);
    }

    public subscribeTopic(symbols: string[]){
        if (!this.authorizationService.isSubscriber()) {return}
        let newTopics: string[] = [];
        symbols.forEach(symbol => {
            let market: Market = this.marketsManager.getMarketBySymbol(symbol);
            if(market.isRealTime) {
                //Ehab: Technical scope is only available for RealTime markets
                let topicSegments: string[] = MarketUtils.splitTopic(symbol);
                let symbolWithoutMarket = topicSegments[0];
                let marketAbbr = topicSegments[2];
                let topic = `NA.${symbolWithoutMarket}_1day.${marketAbbr}`;
                if (Object.keys(this.subscribedTopics).includes(topic)) {
                    this.subscribedTopics[topic]++;
                } else {
                    this.subscribedTopics[topic] = 1;
                }
                if (this.subscribedTopics[topic] == 1) {
                    newTopics.push(topic);
                }
            }
        });

        if(newTopics.length > 0) {
            this.streamer.getGeneralPurposeStreamer().subscribeTechnicalScopeQuote(newTopics);
        }
    }

    public unSubscribeTopic(symbols: string[]) {
        let newTopics: string[] = [];
        symbols.forEach(symbol => {
            let topicSegments:string[] = MarketUtils.splitTopic(symbol);
            let symbolWithoutMarket = topicSegments[0];
            let marketAbbr = topicSegments[2];
            let topic = `NA.${symbolWithoutMarket}_1day.${marketAbbr}`;
            if (Object.keys(this.subscribedTopics).includes(topic)) {
                this.subscribedTopics[topic]--;
            }
            if (this.subscribedTopics[topic] == 0) {
                newTopics.push(topic);
                delete this.subscribedTopics[topic];
            }
        });

        if(newTopics.length > 0) {
            this.streamer.getGeneralPurposeStreamer().unSubscribeTechnicalScopeQuote(newTopics);
        }
    }
}
