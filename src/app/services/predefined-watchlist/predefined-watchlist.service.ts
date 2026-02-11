import {Injectable} from '@angular/core';
import {MarketsManager} from '../loader/loader/markets-manager'; // Import can't be shortened to loader because it will cause circular dependency
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Watchlist, WatchlistType} from '../../services/settings/watchlist/watchlist'; // Import can't be shortened to settings because it will cause circular dependency
import {LanguageService} from '../state';
import {PredefinedFollowedWatchlistResponse, PredefinedWatchlistLoaderService, PredefinedWatchlistResponse, PredefinedWatchlistsResponse, SavePredefinedWatchListsResponse, WatchlistTemplatesResponse} from '../loader/predefined-watchlist-loader/predefined-watchlist-loader.service';
import {LoaderConfig, Market} from '../loader/loader';
import {AppModeAuthorizationService, AppModeFeatureType} from '../auhtorization/app-mode-authorization';

@Injectable()
export class PredefinedWatchlistService {

    private allPredefinedWatchlists: Watchlist[];
    private watchlistTemplate: WatchlistTemplatesResponse[];
    private followedWatchlistsIds: string[];
    private defaultWatchlist: string

    constructor(private predefinedWatchlistLoaderService: PredefinedWatchlistLoaderService, private languageService: LanguageService,
                private marketsManager: MarketsManager , private appModeAuthorizationService:AppModeAuthorizationService) {}

    public setLoaderConfig(loaderConfig: LoaderConfig) {
        //Ehab needs to solve circular dependency when needs loader config inside PredefinedWatchlistLoaderService
        this.predefinedWatchlistLoaderService.setLoaderConfig(loaderConfig);
    }

    public loadPredefinedFollowedWatchlists(): Observable<void> {
        return this.predefinedWatchlistLoaderService.loadPredefinedWatchlist().pipe(
            switchMap((predefinedWatchlistResponse: PredefinedWatchlistsResponse) => {
                return this.predefinedWatchlistLoaderService.loadPredefinedFollowedWatchlist().pipe(
                    map((followedWatchlistResponse: PredefinedFollowedWatchlistResponse) => {
                        this.allPredefinedWatchlists = this.mapWatchlists(predefinedWatchlistResponse.response.watchlists);
                        this.watchlistTemplate = predefinedWatchlistResponse.response.watchlists_templates;
                        this.defaultWatchlist = !this.appModeAllowedFeature(AppModeFeatureType.CUSTOM_PREDEFINED_WATCHLIST)? followedWatchlistResponse.response.default_watchlist:this.allPredefinedWatchlists.filter(watchlist => watchlist.id !== null)[0].id;
                        this.setPredefinedFollowedWatchlistsIds(followedWatchlistResponse.response.watchlists);
                    })
                )
            })
        );
    }

    public getGlobalPredefinedWatchlistId() : string { // get first watchlist as default watchlist
        return '6739c909-4c2a-46a5-b8d4-d981509e947b';
    }

    public getAllPredefinedWatchlists(): Watchlist[] {
        return this.allPredefinedWatchlists;
    }

    public getWatchListTemplate(): WatchlistTemplatesResponse[] {
        return this.watchlistTemplate;
    }

    public getPredefinedFollowedWatchlists(): Watchlist[] {
        return this.allPredefinedWatchlists.filter((watchlist) => this.getPredefinedFollowedWatchlistsIds().includes(watchlist.id));
    }

    public isFollowedWatchlist(id: string): boolean {
        return this.getPredefinedFollowedWatchlistsIds().includes(id);
    }

    public setPredefinedFollowedWatchlistsIds(watchlistIds: string[]): void {
        this.followedWatchlistsIds = watchlistIds;
    }

    private getBrokerModePredefinedFollowedWatchlistsIds() : string[] {
        let subscribedMarkets = this.marketsManager.getAllMarkets();
        let followedWatchlistsIds:string[] = [];

        subscribedMarkets.forEach(market => {
            switch (market.abbreviation) {
                case 'TAD':
                    followedWatchlistsIds = followedWatchlistsIds.concat([market.abbreviation, 'dec0ff8d-d700-433e-a5b1-da0217bce678', '6e088869-dfb8-4e84-b2fc-4f099a069d0c',
                        'd015736b-78ac-435c-a1a1-4730781646b7', '2e7e8e35-1bb9-487f-870f-9d76ce9d0f7a', 'db048e84-fff9-4941-98e0-2b2a6e978cce']);
                    break;
                case 'USA':
                    followedWatchlistsIds = followedWatchlistsIds.concat([market.abbreviation, '41364e90-5377-4968-bc12-43b8287e878f', 'cf1ac9b5-d017-4abf-8388-b2a3d0e9808d', '3d529c30-84eb-4b66-9874-0b4f30f97480'])
                    break;
                default:
                    followedWatchlistsIds = followedWatchlistsIds.concat(market.abbreviation);
            }
        })
        return followedWatchlistsIds;
    }

    public getPredefinedFollowedWatchlistsIds(): string[] {
        return !this.appModeAllowedFeature(AppModeFeatureType.CUSTOM_PREDEFINED_WATCHLIST) ? this.followedWatchlistsIds: this.getBrokerModePredefinedFollowedWatchlistsIds();
    }

    private mapWatchlists(predefinedWatchlists: PredefinedWatchlist['watchlists'][]): Watchlist[] {
        // Sort the watchlists based on the "order" property
        let sortedWatchlists = predefinedWatchlists.sort((a, b) => +a.order < +b.order ? -1 : 1);

        return sortedWatchlists.map((predefinedWatchlist: PredefinedWatchlist['watchlists']) => ({
            type: WatchlistType.Predefined,
            name: this.languageService.arabic ? predefinedWatchlist.a_name : predefinedWatchlist.name,
            id: !this.appModeAllowedFeature(AppModeFeatureType.CUSTOM_PREDEFINED_WATCHLIST)? predefinedWatchlist.identifier : this.getPredefinedFollowedWatchlistsIds().includes(predefinedWatchlist.identifier) ? predefinedWatchlist.identifier : null ,
            order: predefinedWatchlist.order,
            symbols: this.fromCompanyIdsToSymbols(predefinedWatchlist.companies),
            description: this.languageService.arabic? predefinedWatchlist.a_description : predefinedWatchlist.description
        }));
    }

    private fromCompanyIdsToSymbols(companyIds: string[]): { [symbol: string]: string } {
        let symbols: { [symbol: string]: string } = {};
        companyIds.forEach((companyId) => {
            let company = this.marketsManager.getCompanyById(+companyId);
            if (company) {
                symbols[company.symbol] = company.symbol;
            }
        });
        return symbols;
    }

    public saveFollowedPredefinedWatchlists(followedWatchlistsIds: string[]): Observable<SavePredefinedWatchListsResponse> {
        return this.predefinedWatchlistLoaderService.savePredefinedFollowedWatchlists(followedWatchlistsIds);
    }

    public getOrderedFollowedMarkets(): Market[] {
        //Ehab we need to return markets in market-info link order
        let markets: Market[] = [];
        this.marketsManager.getAllMarkets().forEach(market => {
            if (this.getFollowedMarketsFromPredefinedWatchlistsSymbols().includes(market)) {
                markets.push(market);
            }
        });
        return markets;
    }

    private getFollowedMarketsFromPredefinedWatchlistsSymbols(): Market[] {
        let markets: Market[] = [];
        let predefinedWatchlists = this.getAllPredefinedWatchlists();
        for (let predefinedWatchlist of predefinedWatchlists) {
            let symbols = Object.keys(predefinedWatchlist.symbols);
            let isFollowed = this.isFollowedWatchlist(predefinedWatchlist.id);
            for (let symbol of symbols) {
                let company = this.marketsManager.getCompanyBySymbol(symbol);
                let isGeneralIndex = company.categoryId == 5;
                if (isFollowed && isGeneralIndex) {
                    let market = this.marketsManager.getMarketBySymbol(symbol);
                    let isExists = markets.find(m => m.id == market.id);
                    if (!isExists) {
                        markets.push(market);
                    }
                }
            }
        }
        return markets;
    }

    public getDefaultWatchlist(): string {
       return  this.defaultWatchlist;
    }

    public updatePredefinedWatchlists(): Observable<void> {
        return this.predefinedWatchlistLoaderService.loadPredefinedFollowedWatchlist()
            .pipe(map((watchlistResponse: PredefinedFollowedWatchlistResponse) => {
                this.setPredefinedFollowedWatchlistsIds(watchlistResponse.response.watchlists);
                this.defaultWatchlist = watchlistResponse.response.default_watchlist;
            }));
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }
}

export interface PredefinedWatchlist {
    watchlists: PredefinedWatchlistResponse
}
