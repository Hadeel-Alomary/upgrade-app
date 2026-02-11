import {Injectable} from '@angular/core';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {HttpClient} from '@angular/common/http';
import {Loader, LoaderConfig, LoaderUrlType,MarketsManager} from '../loader';
import {ProxyService} from '../loader/proxy.service';
import {Observable} from 'rxjs';
import {Tc} from '../../../utils';
import {map} from 'rxjs/operators';
import {LanguageService} from '../../state/language';
import {ShareholderChangeDetails, ShareholderCompanyDetails, ShareholdersListDetails, CompanyShareholdersDetails} from '../../data/shareholders/shareholders';

// const find = require("lodash/find");
import find from 'lodash/find';
@Injectable()
export class ShareholdersLoaderService extends ProxiedUrlLoader {
    private baseUrl: string;

    constructor(private http: HttpClient,private marketsManager:MarketsManager, private loader: Loader, private proxyService: ProxyService , private languageService: LanguageService) {
        super(proxyService);

        this.loader.getConfigStream()
            .subscribe((loaderConfig:LoaderConfig) => {
                if(loaderConfig){
                    this.onLoaderConfig(loaderConfig);
                }
            });
    }

    private onLoaderConfig(loaderConfig:LoaderConfig) {
        this.baseUrl = LoaderConfig.url(loaderConfig, LoaderUrlType.Shareholders);
    }

    public loadAllShareholdersList(): Observable<ShareholdersListDetails[]> {
        let url: string = this.baseUrl + 'shareholders/list';
        Tc.info("request shareholders: " + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response :ShareholderResponse[] ) => this.processShareholdersList(response))
         )
    }

    private processShareholdersList(shareholdersResponse: ShareholderResponse[]): ShareholdersListDetails[] {
        let shareholders : ShareholdersListDetails[] = [];

        for( let shareholder of shareholdersResponse){
            if(shareholder.count != 0){
                let shareholderDetails: ShareholdersListDetails = {
                    id: shareholder.id,
                    symbol: '',
                    name: shareholder.holder_name,
                    count: shareholder.count
                }
                shareholders.push(shareholderDetails);
            }
        }

        shareholders.unshift({
                id:'all',
                symbol:'',
                name: this.languageService.translate('جميع كبار الملاك'),
                count: shareholders.length
            }
        );

        return shareholders;
    }

    public loadAllCompaniesList(): Observable<ShareholdersListDetails[]> {
        let url: string = this.baseUrl + 'companies/list';

        Tc.info("all companies  url: " + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: CompaniesListResponse[]) =>  this.processAllCompaniesList(response)));
    }

    private processAllCompaniesList(companiesListResponse: CompaniesListResponse[]):ShareholdersListDetails[] {
        let companiesList: ShareholdersListDetails[] = [];

        for(let companyResponse of companiesListResponse){
            let companySymbol: string = this.getCompanySymbolById(companyResponse.id);
            if(companyResponse.count != 0 && companySymbol){//Ehab: When company is deleted or ignored like Nomu --> ignore it.
                let company: ShareholdersListDetails = {
                    id: companyResponse.id,
                    symbol: companySymbol,
                    name: this.getCompanyNameById(companyResponse.id),
                    count: companyResponse.count,
                }
                companiesList.push(company);
            }
        }

        companiesList.unshift({
            id: 'all',
            symbol: '',
            name: this.languageService.translate('جميع الشركات'),
            count: companiesList.length
        })

        return companiesList;
    }

    public loadAllShareholdersChanges(): Observable<ShareholderChangeDetails[]> {
        let currentDate: string = moment(new Date()).format('YYYY-MM-DD');
        let previousDate: string = moment(new Date()).subtract(1 , 'months').add(1 , 'day').format('YYYY-MM-DD');
        let url: string = this.baseUrl + `change/from/${previousDate}/to/${currentDate}`;

        Tc.info("shareholders all changes url: " + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response : ShareholdersChangesResponse[]) => this.getShareholdersChangesDetails(response)));
    }

    private getShareholdersChangesDetails(shareholderChangesResponse: ShareholdersChangesResponse[]):  ShareholderChangeDetails[] {
        let shareholdersChanges: ShareholderChangeDetails[] = [];

        let message = this.languageService.translate('أقل من 5%');

        for(let shareholder of  shareholderChangesResponse){
            let companyName: string = this.getCompanyNameById(shareholder.company_id);
            if(!companyName){
                continue;//Ehab: When company is deleted or ignored like Nomu --> ignore it.
            }
            let previous = (+shareholder.from) <= 0 ? message: shareholder.from ,
                current = (+shareholder.to) <= 0 ? message: shareholder.to,
                change =  ((+shareholder.to) == 0 || (+shareholder.from) == 0) ? '' : ((+shareholder.to) - (+shareholder.from)).toFixed(2),

                shareholderChange: ShareholderChangeDetails = {
                    id: shareholder.company_id,
                    date: shareholder.date,
                    holderName: shareholder.holder_name,
                    companyName: companyName,
                    previousChange: previous,
                    currentChange: current,
                    status: shareholder.status,
                    change: change
                }

            shareholdersChanges.push(shareholderChange);
        }

        return shareholdersChanges;
    }

    public loadShareholderCompanies(id: string): Observable<ShareholderCompanyDetails[]> {
        let currentDate: string = moment(new Date()).format('YYYY-MM-DD');
        let url: string = this.baseUrl + `shareholder/${id}/date/${currentDate}`;

        Tc.info('shareholders list changes by holder id url: ' + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: ShareholderCompaniesResponse[]) => this.processShareholderCompanies(response , currentDate)));
    }

    private processShareholderCompanies(companies: ShareholderCompaniesResponse[] , currentDate: string): ShareholderCompanyDetails[] {
        let shareholderCompanies: ShareholderCompanyDetails[] = [];

        for(let company of companies){
            let  shareholderCompany: ShareholderCompanyDetails ={
                id: company.company_id,
                date: currentDate,
                companyName: this.getCompanyNameById(company.company_id),
                holderPercent: company.holder_percent
            }

            shareholderCompanies.push(shareholderCompany);
        }

        return  shareholderCompanies;
    }

    public loadShareholderChanges(id: string): Observable<ShareholderChangeDetails[]> {
        let currentDate: string = moment(new Date()).format('YYYY-MM-DD');
        let previousDate: string = moment(new Date()).subtract(10 , 'years').format('YYYY-01-01');
        let url: string = this.baseUrl+`shareholder/${id}/from/${previousDate}/to/${currentDate}`;

        Tc.info('shareholders changes by holder id url: ' + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: ShareholdersChangesResponse[]) => this.getShareholdersChangesDetails(response))
        );
    }

    public loadCompanyShareholders(id: string, shareholdersList: ShareholdersListDetails[]): Observable<CompanyShareholdersDetails[]> {
        let currentDate: string = moment(new Date()).format('YYYY-MM-DD');
        let url: string = this.baseUrl + `company/${id}/date/${currentDate}`;

        Tc.info('shareholders of company url: ' + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: CompanyShareholdersResponse[]) => this.processCompanyShareholders(response , currentDate, shareholdersList))
        );
    }

    private processCompanyShareholders(shareholderResponse: CompanyShareholdersResponse[] , currentDate: string, shareholdersList: ShareholdersListDetails[]): CompanyShareholdersDetails[] {
        let shareholdersOfCompany: CompanyShareholdersDetails[] = [];

        for(let shareholder of  shareholderResponse){
            let shareholderCompany: CompanyShareholdersDetails = {
                id: this.getShareholderId(shareholder.holder_name, shareholdersList),
                date: currentDate,
                holderName: shareholder.holder_name,
                holderPercent: shareholder.holder_percent,
            }
            shareholdersOfCompany.push(shareholderCompany);
        }

        return  shareholdersOfCompany;
    }

    public loadCompanyChanges(id: string) : Observable<ShareholderChangeDetails[]> {
        let currentDate: string = moment(new Date()).format('YYYY-MM-DD');
        let previousDate: string = moment(new Date()).subtract(10 , 'years').format('YYYY-01-01');
        let url: string = this.baseUrl+`company/${id}/from/${previousDate}/to/${currentDate}`;

        Tc.info("shareholders companies list url: " + url);

        return this.http.get(this.getProxyAppliedUrl(url))
            .pipe(map((response: ShareholdersChangesResponse[]) => this.getShareholdersChangesDetails(response)));
    }

    private getCompanyNameById(companyId: string):string {
        let company = this.marketsManager.getCompanyById(+companyId);
        if(company){
            return company.name;
        }
        return '';
    }

    private getCompanySymbolById(companyId: string): string{
        let company =  this.marketsManager.getCompanyById(+companyId);
        return company ? company.symbol : '';
    }

    private  getShareholderId(name: string, shareholdersList: ShareholdersListDetails[] ): string{
        return find(shareholdersList, (shareholders: ShareholdersListDetails) => shareholders.name == name).id ;
    }
}

interface ShareholderResponse {
    count: number;
    holder_name: string;
    id: string
}

interface ShareholderCompaniesResponse {
    company_id: string;
    holder_percent: string
}

interface CompanyShareholdersResponse {
    holder_name: string;
    holder_percent: string
}

interface ShareholdersChangesResponse {
    date: string;
    company_id: string;
    holder_name: string;
    status: string;
    from: string;
    to : string
}

interface CompaniesListResponse {
    id: string;
    company_name: string;
    count:number;
    ticker: string
}
