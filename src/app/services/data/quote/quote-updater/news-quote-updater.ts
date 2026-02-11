import {Injectable} from "@angular/core";
import {NewsService, News} from '../../news/index';
import {Quote, Quotes} from "../quote";
import {Loader} from "../../../loader/index";
import {Tc} from "../../../../utils/index";
import {QuoteUpdater} from './quote-updater';

@Injectable()
export class NewsQuoteUpdater extends QuoteUpdater{
    
    constructor(private loader:Loader, private newsService:NewsService) {
        super();
        this.loader.isLoadingDoneStream().subscribe(loadingDone => {
                if (loadingDone) {
                    this.onLoaderDone();
                }
            },
            error => Tc.error(error));
    }
        
    private onLoaderDone() {
        this.newsService.getNewsStreamer().subscribe(news => this.onNews(news));
    }

    private onNews(news:News){
        let quote = Quotes.quotes.data[news.symbol];
        if(news.deleted){
            Quote.updateNews(quote, null);
        } else {
            Quote.updateNews(quote, news);
        }
        this.pushQuoteUpdate(news.symbol);
    }
        
}
