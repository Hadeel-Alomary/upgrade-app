import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Tc} from "../../../utils";
import {TcAuthenticatedHttpClient} from "../../../utils/app.tc-authenticated-http-client.service";
import {Observable} from 'rxjs';
import {LoaderConfig, LoaderUrlType} from "../loader/loader-config";

@Injectable()
export class PredefinedWatchlistLoaderService {
    loaderConfig: LoaderConfig;

    constructor(private http: HttpClient, private tcHttpClient:TcAuthenticatedHttpClient){}

    public setLoaderConfig(loaderConfig: LoaderConfig) {
        //Ehab needs to solve circular dependency when needs loader config
        this.loaderConfig = loaderConfig;
    }

    public loadPredefinedWatchlist () : Observable<PredefinedWatchlistsResponse>{
        let url =  LoaderConfig.url(this.loaderConfig, LoaderUrlType.PredefinedWatchlists);
        return this.tcHttpClient.getWithAuth(Tc.url(url)).pipe(map((response: PredefinedWatchlistsResponse)=> response));
    }

    public loadPredefinedFollowedWatchlist () : Observable<PredefinedFollowedWatchlistResponse>{
        let url =  LoaderConfig.url(this.loaderConfig, LoaderUrlType.FollowedPredefinedWatchlists);
        return this.tcHttpClient.getWithAuth(Tc.url(url)).pipe(map((response: PredefinedFollowedWatchlistResponse)=> response));
    }

    public savePredefinedFollowedWatchlists(identifiers: string[]): Observable<SavePredefinedWatchListsResponse> {
        const body = {
            watchlists: identifiers.join(',')
        };
        let url =  LoaderConfig.url(this.loaderConfig, LoaderUrlType.SaveFollowingWatchlists);
        return this.tcHttpClient.postWithAuth(
            Tc.url(url), body).pipe(
            map((response: PredefinedFollowedWatchlistResponse) => response)
        );
    }
}

export interface PredefinedWatchlistsResponse {
    success: boolean;
    response: {
        watchlists: PredefinedWatchlistResponse[],
        watchlists_templates: WatchlistTemplatesResponse[]
    }
}
export interface PredefinedWatchlistResponse {
    identifier: string;
    name: string;
    a_name: string;
    companies: string[];
    order: number;
    description: string;
    a_description: string;
}

export interface WatchlistTemplatesResponse {
    'watchlist-identifier': string,
    'sections': WatchlistSections[]
}

export interface WatchlistSections {
    id: string,
    name: string,
    companies: string[],
    aname: string
}

export interface PredefinedFollowedWatchlistResponse {
    success: boolean;
    response: {
        default_watchlist: string;
        watchlists: string[];
    }
}

export interface SavePredefinedWatchListsResponse {
    success: boolean;
}

