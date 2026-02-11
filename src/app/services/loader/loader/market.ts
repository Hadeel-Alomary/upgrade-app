import {Tc} from '../../../utils/index';


import find from 'lodash/find';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

export interface Company {
    id: number,
    symbol:string,
    index: boolean,
    categoryId: number,
    english:string,
    arabic:string,
    name:string,
    generalIndex:boolean,
    tags:CompanyTag[]
}

export enum  CompanyTag {
    NONE,
    USA_SUPPORTED,
    USA_DOWJONES
}

export interface Sector {
    id:number,
    english:string,
    arabic:string,
}

export class Market {

    private companiesHash: {[key:string]:Company} = {};
    sortedCompanies: Company[];

    constructor (
        public id: number,
        public abbreviation: string,
        public arabic: string,
        public english: string,
        public name:string,
        public shortArabic: string,
        public shortEnglish: string,
        public shortName:string,
        public historicalPricesUrl: string,
        public streamerUrl: string,
        public technicalReportStreamingUrl:string,
        public startTime: string,
        public endTime: string,
        public marketDepthByPriceTopic: string,
        public marketDepthByOrderTopic: string,
        public sectors: Sector[],
        public companies: Company[],
        public companyFlags: CompanyFlag[],
        public alertsHistoryUrl:string,
        public liquidityHistoryUrl:string,
        public technicalScopeUrl:string,
        public technicalIndicatorStreamUrl: string,
        public isRealTime: boolean){
        this.companies.forEach(company => this.companiesHash[company.symbol] = company);
        this.sortCompanies();
    }

    public getGeneralIndex():Company {
        if(this.abbreviation == 'FRX') {
            return find(this.companies, (company: Company) => company.symbol == 'EURUSD.FRX');
        }
        return find(this.companies, (company: Company) => company.categoryId == 5);
    }

    public getCompany(symbol:string):Company {
        return this.companiesHash[symbol];
    }

    public getCompanyById(id:number):Company{
        return find(this.companies, (company: Company) => company.id == id);
    }

    public getFirstSortedCompany():Company {
        for(let i = 0; i < this.sortedCompanies.length; ++i){
            if(!this.sortedCompanies[i].index){
                return this.sortedCompanies[i];
            }
        }
        Tc.error("fail to find first sorted company");
    }

    public getAllSymbols():string[]{
        return map(this.companies, (company: Company) => company.symbol);
    }

    private sortCompanies() {

        this.sortedCompanies = [];

        let indices:Company[] = this.companies.filter(company => company.index);
        let companies:Company[] = this.companies.filter(company => !company.index);

        indices = sortBy(indices, (index: Company) => index.categoryId);
        companies = sortBy(companies, (company: Company) => company.symbol);

        indices.forEach(index => {
            this.sortedCompanies.push(index); // add index
            companies.forEach(company => {
                if(company.categoryId == index.categoryId){
                    this.sortedCompanies.push(company); // add company
                }
            });
        });
        companies.forEach(company => {
            if(!this.sortedCompanies.includes(company)) {
                this.sortedCompanies.push(company); // add companies with no index (tradeable rights and such)
            }
        });

    }

}

export interface CompanyFlag {
    symbol:string,
    flag:string,
    announcement:string
}


