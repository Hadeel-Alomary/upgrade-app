import {Injectable} from '@angular/core';
import {MarketDepthMessage, Streamer} from '../../streaming/index';
import {MarketDepth, MarketDepths} from './market-depth';
import {Tc} from '../../../utils/index';
import {BehaviorSubject, Subject} from 'rxjs';
import {Loader, Market} from '../../loader/index';
import {AppModeAuthorizationService, AuthorizationService} from '../../auhtorization';
import {AppModeFeatureType} from '../../auhtorization/app-mode-authorization';

@Injectable()
export class MarketDepthByOrderService {

    protected messages:MarketDepths = {};

    protected subscribedSymbol: {[symbol:string]: number}  = {};


    protected marketDepthStream:Subject<MarketDepth>;

    constructor(protected streamer:Streamer, private appModeAuthorizationService:AppModeAuthorizationService, private loader:Loader, private authorizationService:AuthorizationService) {

        this.marketDepthStream = new BehaviorSubject<MarketDepth>(null);

        this.loader.getMarketStream()
            .subscribe((market:Market) => {
                if (this.authorizationService.isSubscriber() && market.isRealTime){
                    this.streamer.getMarketDepthByOrderStream(market.abbreviation).subscribe((message:MarketDepthMessage) => this.receivingMarketDepthByOrderMessage(message, market.marketDepthByPriceTopic),
                        (error:string | Error) => Tc.error(error));
                }
            });
    }

    getMarketDepthStream():Subject<MarketDepth> {
        return this.marketDepthStream;
    }

    subscribe(symbol: string) {
        if (Object.keys(this.subscribedSymbol).includes(symbol)) {
            this.subscribedSymbol[symbol]++;
            this.marketDepthStream.next(this.messages[symbol]);
        } else {
            this.subscribedSymbol[symbol] = 1;
            this.streamer.subscribeMarketDepthByOrder(symbol);
        }
    }

    unSubscribe(symbol: string) {
        if (Object.keys(this.subscribedSymbol).includes(symbol)) {
            this.subscribedSymbol[symbol]--;
        }
        if (this.subscribedSymbol[symbol] == 0) {
            this.streamer.unSubscribeMarketDepthByOrder(symbol);
            delete this.messages[symbol];
            delete this.subscribedSymbol[symbol];
        }
    }

    protected shouldProcessMessage(message:MarketDepthMessage):boolean {
        return !message.groupedByPrice;
    }

    private receivingMarketDepthByOrderMessage(message:MarketDepthMessage, marketDepthByPriceTopic: string) {

        if(!this.shouldProcessMessage(message)){
            return;
        }

        let maxDepthRows = marketDepthByPriceTopic || this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.MAX_DEPTH_ROWS) ? 20 : 1;

        if(message.issnapshot && (message.issnapshot == 'yes')) {
            this.messages[message.symbol] = MarketDepth.fromMarketDepthMessage(message, maxDepthRows);
            this.marketDepthStream.next(this.messages[message.symbol]);
        } else {
            if(this.messages[message.symbol]){
                MarketDepth.update(this.messages[message.symbol], message, maxDepthRows);
                this.marketDepthStream.next(this.messages[message.symbol]);
            } else {
                Tc.info("ignore market depth by order message without snapshot");
            }
        }

    }

}
