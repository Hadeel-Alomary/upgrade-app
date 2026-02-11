import {ArrayUtils} from '../../../utils';
import {TechnicalScopeCategoryType} from '../../../services/data/technical-scope/technical-scope-signal';

export class TechnicalScopeCategory {
    constructor(public type: TechnicalScopeCategoryType, public name: string) { }

    private static technicalScopeCategories: { [key: string]: TechnicalScopeCategory } = {
        MA_EMA_CROSS: new TechnicalScopeCategory(TechnicalScopeCategoryType.MA_EMA_CROSS, 'تفاطع المتوسطات'),
        DIFFERENT_INDICATORS_CROSS: new TechnicalScopeCategory(TechnicalScopeCategoryType.DIFFERENT_INDICATORS_CROSS, 'تفاطع المؤشرات المختلفة'),
        TECHNICAL_SIGNAL: new TechnicalScopeCategory(TechnicalScopeCategoryType.TECHNICAL_SIGNALS, 'الاشارات الفنية'),
        OVER_BOUGHT_OVER_SOLD: new TechnicalScopeCategory(TechnicalScopeCategoryType.OVER_BOUGHT_OVER_SOLD, 'تشبع البيع و تشبع الشراء '),
    }

    public static getAllCategories(): TechnicalScopeCategory[] {
        return ArrayUtils.values(TechnicalScopeCategory.technicalScopeCategories);
    }

    public static getDefaultCategory():TechnicalScopeCategoryType {
        return ArrayUtils.values(TechnicalScopeCategory.technicalScopeCategories)[0].type;
    }
}
