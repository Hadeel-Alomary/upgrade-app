import {Injectable} from "@angular/core";
import {Streamer, MarketDepthMessage} from "../../streaming/index";
import {Loader} from '../../loader/index';
import {MarketDepthByOrderService} from "./market-depth-by-order.service";
import {AppModeAuthorizationService, AuthorizationService} from '../../auhtorization';

@Injectable()
export class MarketDepthByPriceService extends MarketDepthByOrderService {


    constructor(streamer:Streamer, appModeAuthorizationService:AppModeAuthorizationService, loader:Loader, authorizationService:AuthorizationService) {
        super(streamer, appModeAuthorizationService, loader, authorizationService);
    }

    protected shouldProcessMessage(message:MarketDepthMessage):boolean {
        return message.groupedByPrice;
    }

    subscribe(symbol: string) {
        if (Object.keys(this.subscribedSymbol).includes(symbol)) {
            this.subscribedSymbol[symbol]++;
            this.marketDepthStream.next(this.messages[symbol]);
        } else {
            this.subscribedSymbol[symbol] = 1;
            this.streamer.subscribeMarketDepthByPrice(symbol);
        }
    }

    unSubscribe(symbol: string) {
        if (Object.keys(this.subscribedSymbol).includes(symbol)) {
            this.subscribedSymbol[symbol]--;
        }
        if (this.subscribedSymbol[symbol] == 0) {
            this.streamer.unSubscribeMarketDepthByPrice(symbol);
            delete this.subscribedSymbol[symbol];
            delete this.messages[symbol]
        }
    }

}
