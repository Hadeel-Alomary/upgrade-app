import {ArrayUtils} from '../../utils';

export enum MarketWatchCategoryType {
    EssentialColumn = 1,
    LastValueColumn = 2,
    LiquidityColumn = 3,
    SupportAndResistanceColumn = 4,
    FinancialInformationColumn = 5,
    HistoricalHighAndLowColumn = 6,
    IndexCalculationData = 7,
    OpeningAndClosingAuction = 8,
    SignalsScope = 9,
}

export class MarketWatchCategory {

    constructor(public type: number, public name: string) { }

    private static marketWatchCategories: { [key: string]: MarketWatchCategory } = {
        essentialColumn: new MarketWatchCategory(MarketWatchCategoryType.EssentialColumn, 'البيانات الرئيسية'),
        lastValueColumn: new MarketWatchCategory(MarketWatchCategoryType.LastValueColumn, 'القيم السابقة'),
        liquidityColumn: new MarketWatchCategory(MarketWatchCategoryType.LiquidityColumn, 'السيولة'),
        supportAndResistanceColumn: new MarketWatchCategory(MarketWatchCategoryType.SupportAndResistanceColumn, 'الدعم والمقاومة'),
        financialInformationColumn: new MarketWatchCategory(MarketWatchCategoryType.FinancialInformationColumn, 'البيانات المالية الأساسية'),
        historicalHighAndLowColumn: new MarketWatchCategory(MarketWatchCategoryType.HistoricalHighAndLowColumn, 'الأعلى والأدنى التاريخي'),
        indexCalculationData: new MarketWatchCategory(MarketWatchCategoryType.IndexCalculationData, 'تأثير على المؤشر والقطاع'),
        openingAndClosingAuction: new MarketWatchCategory(MarketWatchCategoryType.OpeningAndClosingAuction, 'مزاد الإفتتاح والإغلاق'),
        signalsScope: new MarketWatchCategory(MarketWatchCategoryType.SignalsScope, 'راصد الإشارات'),
    }

    public static getAllCategories(): MarketWatchCategory[] {
        return ArrayUtils.values(MarketWatchCategory.marketWatchCategories);
    }

    public static getDefaultCategory(): number {
        return ArrayUtils.values(MarketWatchCategory.marketWatchCategories)[0].type;
    }

}

