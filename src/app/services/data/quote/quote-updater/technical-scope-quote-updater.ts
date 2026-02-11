import {QuoteUpdater} from './quote-updater';
import {Loader} from '../../../loader/loader';
import {TechnicalScopeQuoteService} from '../../technical-indicator';
import {TechnicalScopeMessage} from '../../../streaming/shared';
import {Quote, Quotes} from '../quote';

export class TechnicalScopeQuoteUpdater extends QuoteUpdater{

    constructor(private loader: Loader, private technicalScopeQuoteService: TechnicalScopeQuoteService) {
        super();
        this.loader.isLoadingDoneStream().subscribe((isLoadingDone: boolean) => {
            if (isLoadingDone) {
                this.technicalScopeQuoteService.getTechnicalScopeQuoteStream().subscribe(message => {
                    if (message) {
                        this.onReceivingTechnicalScopeQuoteStream(message);
                    }
                });
            }
        });
    }

    private onReceivingTechnicalScopeQuoteStream(message: TechnicalScopeMessage) {
        let quote = Quotes.quotes.data[message.symbol];
        if(quote){
            Quote.updateMarketWatchTechnicalScope(quote,message.signal, message.value);
            this.pushQuoteUpdate(message.symbol)
        }
    }
}
