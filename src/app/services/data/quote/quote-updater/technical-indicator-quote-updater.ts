import {QuoteUpdater} from './quote-updater';
import {Loader} from '../../../loader/loader';
import {Quote, Quotes} from '../quote';
import {TechnicalIndicatorColumns, TechnicalIndicatorQuoteService} from '../../technical-indicator';

export class TechnicalIndicatorQuoteUpdater extends QuoteUpdater {

    constructor(private loader: Loader, private technicalIndicatorQuoteService: TechnicalIndicatorQuoteService) {
        super();
        this.loader.isLoadingDoneStream().subscribe((isLoadingDone: boolean) =>{
            if(isLoadingDone){
                this.technicalIndicatorQuoteService.getTechnicalIndicatorUpdateStream().subscribe(messages => {
                    if (messages) {
                        this.onReceivingTechnicalIndicatorData(messages);
                    }
                });
            }
        })
    }

    private onReceivingTechnicalIndicatorData(messages: Object) {
        let splitTopic = messages['topic'].split('.');
        let topic: string = splitTopic[1];
        let marketAbbreviation: string = splitTopic[2];
        if (topic) {
            let colName = TechnicalIndicatorColumns.getColNameByTopic(topic);
            for (let key of Object.keys(messages)) {
                if (key != 'topic') {
                    let symbol = key + '.' + marketAbbreviation;
                    let quote = Quotes.quotes.data[symbol];
                    let value = messages[key];
                    if (quote) {
                        Quote.updateTechnicalIndicator(quote, colName, value);
                        this.pushQuoteUpdate(symbol);
                    }
                }
            }
        }

    }
}
