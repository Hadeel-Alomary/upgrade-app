import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Tc} from '../../../utils/index';
import {Loader, LoaderConfig, LoaderUrlType, MarketsManager} from '../loader/index';
import {News} from '../../data/news/news';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CategoryNews} from '../../data/news/category-news';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {ProxyService} from '../loader/proxy.service';

@Injectable()
export class NewsLoader extends ProxiedUrlLoader {

    constructor(private http:HttpClient, private loader:Loader, private marketsManager:MarketsManager, private proxyService: ProxyService){
        super(proxyService);
    }

    loadMarketNews(market:string):Observable<News[]> {

        let today:string = moment().format('YYYY-MM-DD');
        let lastWeek:string = moment().subtract(1, 'weeks').format('YYYY-MM-DD');

        let baseUrl:string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.AnnouncementSearch);
        baseUrl = baseUrl.replace('{0}', market);

        let url:string = baseUrl + `?from_date=${lastWeek}&to_date=${today}&keyword=&symbol=`;

        Tc.info("market news url:" + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: NewsResponse) => this.onData(response)));
    }

    loadCompanyNews(symbol:string):Observable<News[]>{
        let companyId = this.marketsManager.getCompanyBySymbol(symbol).id
        let marketId = this.marketsManager.getMarketBySymbol(symbol).id;

        let baseUrl:string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.AnnouncementLatest);
        let url:string = baseUrl + `?market_id=${marketId}&page=1&company_id=${companyId}`;

        Tc.info("news url:" + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: NewsResponse) => this.onCompanyNewsData(response)));
    }

    loadCategoryNews(marketId: number, category: number): Observable<CategoryNews[]>{
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.AnnouncementCategory);
        url = url.replace('{0}', `${marketId}`);
        url = url.replace('{1}', `${category}`);

        Tc.info("news url:" + url);

        return this.http.get(this.getProxyAppliedUrl(url)).pipe(
            map((response: CategoryNewsResponse[]) => {
                return CategoryNews.fromLoaderData(response);
            })
        );
    }

    loadNewsTitle(newsId: number): Observable<string>{
        let url: string = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.NewsTitle);
        url = url.replace('{0}', `${newsId}`);

        Tc.info("news url:" + url);

        return this.http.get(this.getProxyAppliedUrl(url)).pipe(
            map((response: NewsTitleResponse) => {
                return response.title;
            })
        );
    }

    private onData(json: NewsResponse):News[] {

        let news:News[] = [];

        // MA empty result
        if(!json.values.forEach){ return news; }

        // NK json contains: columns, values
        // NK news columns: "news_id", "daily_date", "title", "symbol", "market_abbr"
        json.values.forEach((announcement: string[]) => {
            let market = this.marketsManager.getMarketByAbbreviation(announcement[4]);
            news.push(News.fromLoader(announcement, market));
        });

        return news;
    }

    private onCompanyNewsData(response: NewsResponse): News[] {
        return response.values.map(row => ({
            id: row[response.columns.indexOf('id')],
            date: row[response.columns.indexOf('daily_date')],
            market: false,
            symbol: row[response.columns.indexOf('company_id')],
            name: '',
            header: row[response.columns.indexOf('title')],
            url: row[response.columns.indexOf('link')],
            deleted: false,
            viewed: false,
        }));
    }

}

export interface CategoryNewsResponse {
    news_id: number,
    daily_date: string,
    company_id: number
}

export interface NewsTitleResponse {
    title: string
}

export interface NewsResponse {
    columns: string[],
    values: string[][]
}
