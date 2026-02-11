import {Injectable} from '@angular/core';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {HttpClient} from '@angular/common/http';
import {CredentialsStateService, LanguageService} from '../../state';
import {Loader, LoaderConfig, LoaderUrlType, MarketsManager} from '../loader';
import {ProxyService} from '../loader/proxy.service';
import {Observable} from 'rxjs';
import {TechnicalScopeMessage} from '../../streaming/shared';
import {Tc} from '../../../utils';
import {map} from 'rxjs/operators';

@Injectable()
export class TechnicalScopeLoader extends ProxiedUrlLoader{

    constructor(private http: HttpClient,
              private credentialsService:CredentialsStateService,
              private marketsManager:MarketsManager,
              private loader: Loader,
              private proxyService: ProxyService,
              private languageService: LanguageService)
    {
      super(proxyService);
    }

    loadTechnicalScopeHistoricalData(interval: string, marketAbbr: string): Observable<TechnicalScopeMessage[]> {
        let market = this.marketsManager.getMarketByAbbreviation(marketAbbr);
        let baseUrl: string =  market.technicalScopeUrl,
            language: string = this.languageService.arabic ? 'ARABIC' : 'ENGLISH',
            url: string = baseUrl + '?' + `language=${language}&interval=${interval}&market=${marketAbbr}`;

        Tc.info('request TechnicalScope history: ' + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: string[]) => this.processTechnicalScopeData(response, marketAbbr)));
    }

    private processTechnicalScopeData(response: string[], marketAbbr: string): TechnicalScopeMessage[] {

        let messages: TechnicalScopeMessage[] = [];
        if (response == null) {
            return [];
        }

        response.forEach((line, index) => {
            let data: string[] = line.split(',');
            messages.push({
                topic: data[0] + '.num-alerts.' + marketAbbr,
                date: data[1],
                symbol: data[2] + '.' + marketAbbr,
                signal: data[3],
                value: data[4],
            });
        });

        return messages;
    }
}
