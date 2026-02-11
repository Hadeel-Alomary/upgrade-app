import {Injectable} from "@angular/core";
import {Streamer, QuoteMessage} from "../../../streaming/index";
import {Quote, Quotes} from "../quote";
import {Loader, LoaderConfig, Market} from '../../../loader/index';
import {Tc} from '../../../../utils/index';
import {QuoteUpdater} from './quote-updater';

@Injectable()
export class StreamerQuoteUpdater extends QuoteUpdater {

    private loaderConfig : LoaderConfig;

    constructor(private loader:Loader, private streamer:Streamer) {
        super();
        this.loader.getMarketStream().subscribe(response => {
                this.onMarketData(response);
                this.loaderConfig = this.loader.getConfig();
            },
            error => Tc.error(error));
    }

    private onMarketData(market:Market) {
        this.streamer.getQuoteMessageStream(market.abbreviation)
            .subscribe((message:QuoteMessage) => this.onReceivingQuoteMessage(message),
                (error:string | Error) => Tc.error(error));
    }

    private onReceivingQuoteMessage(message:QuoteMessage) {
        this.updateQuote(message);
        this.pushQuoteUpdate(message.symbol);
    }

    private updateQuote(message:QuoteMessage){
        let quote = Quotes.quotes.data[message.symbol];
        if (!quote) {
            return;
        }
        Quote.update(quote, message, this.loaderConfig);
    }

}
