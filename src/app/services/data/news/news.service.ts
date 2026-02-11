import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {NewsMessage, Streamer} from '../../streaming/index';
import {Loader, MarketsManager, NewsLoader} from '../../loader/index';
import {MarketSummaryService, MarketSummary, MarketSummaryStatus} from '../market-summary/index';
import {News} from './news';
import {MiscStateService} from '../../state/index';
import {CategoryNews} from './category-news';
import {Observable} from 'rxjs';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';

import remove from 'lodash/remove';
// const remove = require("lodash/remove");

@Injectable()
export class NewsService {

    private newsStreamer:Subject<News>;
    private newsCache:News[];

    private marketCategoryNews: {[id: string]: CategoryNews[]} = {};
    private newsTitles: {[id: number]: string} = {};
    private loadNewsTitleStream:Subject<string>;

    constructor(private stateService:MiscStateService,
                private marketSummaryService:MarketSummaryService,
                private marketsManager:MarketsManager,
                private newsLoader: NewsLoader,
                loader:Loader,
                streamer:Streamer) {

        this.loadNewsTitleStream = new Subject();
        this.newsStreamer = new Subject();
        this.newsCache = [];

        loader.isLoadingDoneStream().subscribe(loadingDone => {
            if(loadingDone) {
                this.marketsManager.getAllMarkets().forEach(market => {
                    streamer.getGeneralPurposeStreamer().subscribeNews(market.abbreviation);
                    streamer.getGeneralPurposeStreamer().getNewsStreamer().subscribe(message => this.onStreamerMessage(message));
                })
            }
        });

        marketSummaryService.getMarketStatusChangeStream().subscribe(status => this.onMarketStatusChange(status));

    }

    public getNewsStreamer():Subject<News> {
        return this.newsStreamer;
    }

    public getLoadNewsTitleStream() {
        return this.loadNewsTitleStream;
    }

    public loadNewsTitle(newsId: number) {
        let title = this.getNewsTitle(newsId);
        if(title) {
            this.loadNewsTitleStream.next(title);
            return;
        }
        this.newsLoader.loadNewsTitle(newsId).subscribe(title =>{
            this.newsTitles[newsId] = title;
            this.loadNewsTitleStream.next(this.newsTitles[newsId]);
        })
    }

    public getNewsTitle(newsId: number): string {
        return this.newsTitles[newsId];
    }

    public getCategoryNews(marketId: number, category: number): Observable<CategoryNews[]> {
        let key = `${marketId}.${category}`;
        if(Object.keys(this.marketCategoryNews).indexOf(key) > -1) {
            return of(this.marketCategoryNews[key]);
        }

        return this.newsLoader.loadCategoryNews(marketId, category).pipe(
            tap((categoryNews: CategoryNews[]) => {
                this.marketCategoryNews[key] = categoryNews;
            })
        );
    }

    public markAsViewed(news:News) {
        if(!news.viewed) {
            news.viewed = true;
            this.stateService.addViewedNews(news.id);
            this.newsStreamer.next(news);
        }
    }

    private onStreamerMessage(message:NewsMessage){

        let market = this.marketsManager.getMarketByAbbreviation(message.MARKET_ABRV);
        let news = News.fromStreamer(message, market);

        if(news.deleted){
            remove(this.newsCache, (n: News) => n.id == news.id);
            this.newsStreamer.next(news);
            return;
        }

        if(this.stateService.isViewedNews(news.id)){
            news.viewed = true; // news already viewed by user
        }

        this.newsCache.push(news);
        this.newsStreamer.next(news);

    }

    private onMarketStatusChange(marketSummary:MarketSummary) {

        // MA when receiving market status, ensure to delete any news belong to previous date
        let deletedNews = remove(this.newsCache, (news: News) => news.date != marketSummary.date);

        deletedNews.forEach((news: News) => {
            news.deleted = true;
            this.newsStreamer.next(news);
        });

        // MA house keeping, on "open" of market, flush viewedNews state (to reduce its size)
        // note that functionality doesn't depend on flushing this
        if(marketSummary.status == MarketSummaryStatus.OPEN) {
            this.stateService.resetViewedNews();
        }

    }

}

