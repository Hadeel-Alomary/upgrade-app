// import {Tc} from 'tc-web-chart-lib';

export class AppMarketInfoUtils {

    public static getMarketNameByAbbreviation(abbreviation: string, isArabic: boolean) {
        switch (abbreviation) {
            case 'TAD':
                return  isArabic ?  'سوق الأسهم السعودي': 'Saudi Stock Market';
            case 'USA':
                return  isArabic ?  'السوق الأمريكي': 'US Market';
            case 'DFM':
            case 'ADX':
                return isArabic ? 'سوق الإمارات المالي': 'Emirates Stock Market';
            case 'KSE':
                return isArabic ? 'بورصة الكويت' : 'Kuwait Boursa';
            case 'ASE':
                return isArabic ? 'بورصة عمّان': 'Amman Boursa';
            case 'DSM':
                return isArabic ? 'بورصة قطر' : 'Qatar Boursa';
            case 'EGY':
                return  isArabic ? 'البورصة المصرية': 'Egyptian Boursa';
            case 'FRX':
                return isArabic ? 'سوق العملات و السلع': 'Forex and Commodities';
        }
        // Tc.error("unkonwn market name " + abbreviation);
    }

    public static isNomuCompany(companyCategoryId:number): boolean {
        return companyCategoryId == 303;
    }
    public static isSukukCompany(companyCategoryId:number): boolean {
        return companyCategoryId == 391;
    }

    public static isDerivativesCompany(companyCategoryId:number): boolean {
        return companyCategoryId == 346;
    }

}
