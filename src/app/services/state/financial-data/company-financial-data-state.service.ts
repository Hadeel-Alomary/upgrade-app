import { Injectable } from '@angular/core';
import {FinancialStatementTypes} from '../../../components/financial-data-container/company-financial-statements/financial-statement';

@Injectable()
export class CompanyFinancialDataStateService {

    private static STORAGE_KEY:string = "TC_FINANCIAL_DATA_STATE";
    private storageData: CompanyFinancialDataType;


    constructor() {
        if(localStorage.getItem(CompanyFinancialDataStateService.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(CompanyFinancialDataStateService.STORAGE_KEY));
        } else {
            this.storageData = {
               type: FinancialStatementTypes.Overview
            };
        }
    }

    public setCompanyFinancialDataType(type: FinancialStatementTypes){
        this.storageData.type  = type;
        this.write();
    }

    public write(){
        localStorage[CompanyFinancialDataStateService.STORAGE_KEY] = JSON.stringify(this.storageData);;
    }

    public getCompanyFinancialDataState(){
      return  this.storageData.type;
    }
}

export interface CompanyFinancialDataType {
    type: FinancialStatementTypes

}
