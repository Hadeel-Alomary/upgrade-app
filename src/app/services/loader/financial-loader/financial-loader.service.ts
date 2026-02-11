import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CredentialsStateService} from '../../state';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {ProxyService} from '../loader/proxy.service';
import {Loader, LoaderConfig, LoaderUrlType} from '../loader';

@Injectable()
export class FinancialLoaderService extends ProxiedUrlLoader{
    private basicUrl: string = '';
    private financialData:{[key:string]: FinancialDataResponse} = {};


    constructor(private http: HttpClient, public proxyService: ProxyService, private loader: Loader) {
      super(proxyService)

      this.loader.getConfigStream()
          .subscribe((loaderConfig:LoaderConfig) => {
              if(loaderConfig){
                  this.onLoaderConfig(loaderConfig);
              }
          });
      }

    private onLoaderConfig(loaderConfig:LoaderConfig){
        this.basicUrl = LoaderConfig.url(loaderConfig, LoaderUrlType.FinancialBaseUrl);
    }

    public loadFinancialIndicatorData(companyId: number, fieldId: string, periodType: string): Observable<Object> {
        let url = `${this.basicUrl}/financial-field/company/${companyId}?period-type=${periodType}&field=${fieldId}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe(map(response => {
            return response;
        }));
    }

    public loadFinancialData(marketAbbr: string, selectedYear: number): Observable<{[key:string]: FinancialDataResponse}> {
      let url = `${this.basicUrl}/market-financials/market/${marketAbbr}?year=${selectedYear}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe(map((response: {[key:string]: FinancialDataResponse}) => {
            return response;
        }));
    }

    public loadFinancialPointOverViewForCompany(companyId: string,selectedYear: number, periodType: string ,point?: number): Observable<FinancialDataOverviewResponse[]> {
        let url = `${this.basicUrl}/financial-point-overview/company/${companyId}?period-type=${periodType}&year=${selectedYear}`;
            url += point ? `&point=${point}`:''
        return this.http.get(this.getProxyAppliedUrl(url)).pipe(map((response: FinancialDataOverviewResponse[]) => {
            return response;
        }));
    }

    public loadFinancialOverViewForCharts(companyId: number, financialStatement: string, periodType: string): Observable<FinancialDataOverviewResponse[]> {
        let url: string = `${this.basicUrl}/financial-overview/company/${companyId}?statement=${financialStatement}&period-type=${periodType}&period=5`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe(map((response: FinancialDataOverviewResponse[]) => {
            return response;
        }));

    }

    public loadOverViewAndCorporateActions(companyId: string): Observable<CompanyFinancialStatementsResponse[]>{
        let url: string = `${this.basicUrl}/corporate-actions/company/${companyId}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe((response: Observable<CompanyFinancialStatementsResponse[]>) => response)
    }

    public loadingFinancialBalanceModel(companyId: string): Observable<FinancialBalanceModelResponse[]> {
        let url: string = `${this.basicUrl}/financial-balance-model/company/${companyId}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe((response: Observable<FinancialBalanceModelResponse[]>) => response)
    }

    public loadingFinancialStatements(reportType: string, companyId: string, reportRange: string, reportPeriod: string, growthState: boolean): Observable<FinancialStatementsResponse[]> {
        let url: string = `${this.basicUrl}/financial-statements/company/${companyId}?statement=${reportType}&period-type=${reportRange}&period=${reportPeriod}&growth=${growthState}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe((response: Observable<FinancialStatementsResponse[]>) => response)
    }
    public loadingStatisticDataForCompany(companyId: string, reportRange: string, reportPeriod: string): Observable<FinancialStatementsResponse[]> {
        let url: string = `${this.basicUrl}/financial-ratios/company/${companyId}?period-type=${reportRange}&period=${reportPeriod}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe((response: Observable<FinancialStatementsResponse[]>) => response)
    }

    public loadingBoardOFDirectorsAndSeniorExecutives(companyId: string) {
        let url: string = `${this.basicUrl}/board/company/${companyId}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe((response: Observable<BoardOFDirectorsAndSeniorExecutives[]>) => response)
    }

    public loadingSeniorExecutive(companyId: string) {
        let url: string = `${this.basicUrl}/management/company/${companyId}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe((response: Observable<BoardOFDirectorsAndSeniorExecutives[]>) => response)
    }
    public loadBoardOfDirectorsInfo(id: string): Observable<BoardOfDirectorsInfoResponse> {
        let url: string = `${this.basicUrl}/person/${id}`;
        return this.http.get(this.getProxyAppliedUrl(url)).pipe((response: Observable<BoardOfDirectorsInfoResponse>) => response)
    }
}

export interface FinancialDataResponse {
    Q1: FinancialStatementResponse,
    Q2: FinancialStatementResponse,
    Q3: FinancialStatementResponse,
    Q4: FinancialStatementResponse,
    annual: FinancialStatementResponse,
}

export interface  FinancialStatementResponse {
    BS: boolean
    CF: boolean
    IS: boolean
}

export interface FinancialDataOverviewResponse {
    date: string,
    description: string,
    preliminary: boolean,
    fields: FinancialDataOverviewFieldsResponse
}
export interface FinancialDataOverviewFieldsResponse {
    price_to_earnings?: number;
    ff_free_ps_cf?: number;
    ff_oper_ps_net_cf?: number;
    ff_bps_tang?: number;
    ff_eps_dil_bef_unusual?: number;
    ff_sales_ps?: number;
    ff_assets?: number,
    ff_bps?: number,
    ff_chg_cash_cf: number,
    ff_div_yld?: number,
    ff_dps?: number,
    ff_eps_basic: number,
    ff_eq_tot?: number,
    ff_fin_cf?: number,
    ff_invest_cf?: number,
    ff_liabs?: number,
    ff_net_inc?: number,
    ff_oper_cf?: number,
    ff_pay_out_ratio?: number,
    ff_sales?: number,
    ff_shldrs_eq?: number,
}

export interface CompanyFinancialStatementsResponse {
    date: string,
    amount: string,
    pay_date: string,
    record_date: string,
    announcement_date: string,
    description: string,
    ar_description: string,
    ar_category: string,
    category: string
}

export interface FinancialBalanceModelResponse {
    ar_description: string,
    category: string,
    description: string,
    has_children: boolean,
    id: string,
    ordinal: number,
    parent: string,
    unit_factor: number
}

export interface FinancialStatementsResponse {
    id: string,
    description: string,
    restated: boolean,
    preliminary: boolean,
    date: string,
    fields: FinancialStatementFieldData[]
}

export interface FinancialStatementFieldData {
    [key: string]: {
        value: string,
        pct?: string
    };
}
export interface BoardOFDirectorsAndSeniorExecutives {
    age: string,
    id: string,
    name: string,
    position: string
}

export interface BoardOfDirectorsInfoResponse {
    bio: string,
    experiences: BoardOfDirectorsExperienceResponse[],
    name?: string
}

export interface BoardOfDirectorsExperienceResponse {
    end_date: string,
    start_date: string,
    title: string
}
