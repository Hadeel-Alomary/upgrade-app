export enum ReportType {
    Shareholders = 1,
    Companies = 2
}

export interface SelectedReportItem {
    reportType: ReportType
    id: string,
    description: string
}

export interface ShareholdersListDetails {
    id: string,
    name: string,
    symbol:string,
    count: number,
}

export interface ShareholderCompanyDetails {
    id: string,
    date: string,
    companyName: string,
    holderPercent: string
}

export interface CompanyShareholdersDetails {
    id: string;
    date: string,
    holderName: string,
    holderPercent: string
}

export interface ShareholderChangeDetails {
    id: string,
    date: string,
    holderName: string,
    companyName: string,
    previousChange: string,
    currentChange: string,
    status: string,
    change: string
}



