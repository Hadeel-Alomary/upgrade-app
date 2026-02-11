import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ShareholdersLoaderService} from '../../loader';
import {CompanyShareholdersDetails, ShareholderChangeDetails, ShareholderCompanyDetails, ShareholdersListDetails} from './shareholders';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ShareholdersService {

    private shareholdersList: ShareholdersListDetails[];
    private companiesList: ShareholdersListDetails[];

    constructor(private shareholdersLoaderService: ShareholdersLoaderService) { }

    getAllShareholdersList(): Observable<ShareholdersListDetails[]> {
        if (this.shareholdersList) {
            return of(this.shareholdersList);
        }

        return this.shareholdersLoaderService.loadAllShareholdersList().pipe(
            map((shareholders: ShareholdersListDetails[]) => {
                this.shareholdersList = shareholders;
                return this.shareholdersList;
            }));
    }

    getAllCompaniesList(): Observable<ShareholdersListDetails[]>{
        if (this.companiesList) {
            return of(this.companiesList);
        }

        return this.shareholdersLoaderService.loadAllCompaniesList().pipe(
            map((companies: ShareholdersListDetails[]) => {
                this.companiesList = companies;
                return this.companiesList;
            }));
    }

    getAllChanges(): Observable<ShareholderChangeDetails[]>{
        return this.shareholdersLoaderService.loadAllShareholdersChanges();
    }

    getShareholderCompanies(id: string): Observable<ShareholderCompanyDetails[]>{
        return this.shareholdersLoaderService.loadShareholderCompanies(id);
    }

    getShareholderChanges(id: string): Observable<ShareholderChangeDetails[]>{
        return this.shareholdersLoaderService.loadShareholderChanges(id);
    }

    getCompanyShareholders(id: string): Observable<CompanyShareholdersDetails[]>{
        return  this.shareholdersLoaderService.loadCompanyShareholders(id, this.shareholdersList);
    }

    getCompanyChanges(id:string): Observable<ShareholderChangeDetails[]>{
        return this.shareholdersLoaderService.loadCompanyChanges(id);
    }
}
