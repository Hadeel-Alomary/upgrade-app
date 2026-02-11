import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Tc, AppTcTracker} from '../../../utils/index';
import {Watchlist, WatchlistType} from '../../settings/watchlist/watchlist';
import {MarketsManager} from '../loader/markets-manager';
import {Loader} from '../loader';
import {TcAuthenticatedHttpClient} from "../../../utils/app.tc-authenticated-http-client.service";

@Injectable()
export class WatchlistLoader {

    constructor(private tcAuthenticatedHttpClient: TcAuthenticatedHttpClient,private marketsManager:MarketsManager, private loader:Loader){}

    saveWatchlist(watchlist:Watchlist):void {
        AppTcTracker.trackCreateOrUpdateCloudWatchlist();
        let data:WatchlistData = {
            identifier: watchlist.id,
            companies: this.fromSymbolsToCompanyIds(watchlist.symbols),
            name: watchlist.name
        }

        this.tcAuthenticatedHttpClient.postWithAuth(Tc.url('https://www.tickerchart.com/m/watchlist/replace'), data)
            .pipe(map( (jsonResponse:GenericResponse) => {
                Tc.assert(jsonResponse.success, "fail to save watchlist");
                return null;
            })).subscribe();
    }

    deleteWatchlist(watchlist:Watchlist):void {
        AppTcTracker.trackDeleteCloudWatchlist();
        this.tcAuthenticatedHttpClient.getWithAuth(Tc.url(`https://www.tickerchart.com/m/watchlist/${watchlist.id}/delete`))
            .pipe(map( (jsonResponse:GenericResponse) => {
                Tc.assert(jsonResponse.success, "fail to delete watchlist");
                return null;
            })).subscribe();
    }

    loadWatchlists():Observable<{deleted: string[], active: Watchlist[]}> {
        return this.tcAuthenticatedHttpClient.getWithAuth(Tc.url('https://www.tickerchart.com/m/watchlist/list'))
            .pipe(map( (jsonResponse:WatchlistListResponse) => {
                let result:{deleted: string[], active: Watchlist[]} = {deleted: [], active: []};
                Tc.assert(jsonResponse.success, "fail to load watchlists");
                jsonResponse.response.watchlists.forEach(jsonWatchlist => {
                    if(jsonWatchlist.deleted == "0") {
                        result.active.push({
                            type: WatchlistType.UserDefined,
                            name: jsonWatchlist.name,
                            id: jsonWatchlist.identifier,
                            symbols:this.fromCompanyIdsToSymbols(jsonWatchlist.companies)
                        });
                    } else {
                        result.deleted.push(jsonWatchlist.identifier);
                    }
                })
                return result;
            }));
    }

    private fromCompanyIdsToSymbols(companyIds: string[]):{[symbol:string]:string} {
        let symbols:{[symbol:string]:string} = {};
        companyIds.forEach(companyId => {
            let company = this.marketsManager.getCompanyById(+companyId);
            if(company) {
                symbols[company.symbol] = company.symbol;
            }
        })
        return symbols;
    }

    private fromSymbolsToCompanyIds(symbols: { [symbol: string]: string }):string[] {
        let companyIds:string[] = [];
        Object.values(symbols).forEach(symbol => {
            let company = this.marketsManager.getCompanyBySymbol(symbol);
            if(company) {
                companyIds.push(company.id.toString());
            }
        });
        return companyIds;
    }

}

interface WatchlistData {
    name: string,
    identifier:string,
    deleted?:string,
    companies:string[]
}

interface GenericResponse {
    success:boolean;
}

interface WatchlistListResponse extends GenericResponse {
    response: {
        watchlists : WatchlistData[]
    }
}
