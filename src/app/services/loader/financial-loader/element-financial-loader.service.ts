import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProxyService} from '../loader/proxy.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProxiedUrlLoader} from '../proxied-url-loader';

@Injectable()

export class ElementFinancialLoaderService extends ProxiedUrlLoader{

  constructor(private http: HttpClient, public proxyService: ProxyService) {
      super(proxyService)
  }

    public loadFinancialIndicatorData(basicUrl: string, companyId: number, fieldId: string, periodType: string): Observable<Object> {
        let url = `${basicUrl}/financial-field/company/${companyId}?period-type=${periodType}&field=${fieldId}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe(map(response => {
            return response;
        }));
    }
}
