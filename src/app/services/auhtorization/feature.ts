import {AccessType} from './access-type';
import {Tc} from '../../utils';

export enum FeatureType {
    ALERT = 1,
    MULTIPLE_SIMPLE_ALERTS,
    CHART_ALERT,
    TREND_LINE_ALERT,
    SAVE_WORKSPACE_LOCALLY,
    ADVANCE_WORKSPACE_CONTROL,
    CREATE_WORKSPACE,
    SAVE_DRAWINGS,
    DYNAMIC_BOX_LAYOUT,
    WINDOW_TOOLBAR,
    MULTIPLE_PAGES,
    CHANGE_PAGES,
    SAVE_WORKSPACE_ON_CLOUD,
    FILTER,
    WATCHLIST_FILTER,
    UPDATE_WATCHLIST_FILTER,
    FILTER_SETTINGS,
    LIQUIDITY_INDICATORS,
    FINANCIAL_INDICATOR,
    SUBSCRIBED_COLUMNS,
    HISTORICAL_TRADES,
    WATCHLIST_ADD,
    WATCHLIST_ADD_SYMBOL,
    CHART_SET_SIGNATURE,
    SAVE_CHART_ON_INTERNET,
    COMMUNITY,
    CUSTOM_INTERVAL,

    //Market Screens
    MARKET_WATCH_SCREEN,//
    MARKET_TRADES_SCREEN,//
    MARKET_ALERTS_SCREEN,
    BIG_TRADES_SCREEN,
    TECHNICAL_SCOPE_SCREEN,
    MAJOR_SHAREHOLDERS_SCREEN,//
    MAJOR_SHAREHOLDERS_LIST_SCREEN,//
    ANALYSIS_CENTER_SCREEN,//
    MARKET_PREOPEN_SCREEN,
    FINANCIAL_DATA,
    FINANCIAL_DATA_BEFORE_THREE_YEAR,

    //Company Screens
    CHART_SCREEN,
    DETAILED_QUOTE_SCREEN,
    TIME_AND_SALE_SCREEN,
    TRADES_SUMMARY_SCREEN,
    MARKET_DEPTH_BY_PRICE_SCREEN,
    MARKET_DEPTH_BY_ORDER_SCREEN,
    COMPANY_NEWS_SCREEN,
    COMPANY_FINANCIAL_STATEMENTS,

    //Trading Screens
    TRADING_POSITIONS_SCREEN,
    TRADING_ORDERS_SCREEN,
    TRADING_ACCOUNT_BALANCE_SCREEN,
    TRADING_ACCOUNT_TRANSACTIONS_SCREEN,
    TRADING_TRANSFER_MONEY_SCREEN,
    TRADING_ORDER_SEARCH_SCREEN,

    //Trading Features
    TRADING_BUY_SELL,
    TRADING_TRANSFER_MONEY,
    TRADING_DELETE_ORDERS,
    TRADING_CLOSE_POSITIONS,
    TRADING_REVERSE_POSITIONS,
    TRADING_REVERT_ORDERS,
    TRADING_PORTFOLIO_CONTROL,
    TRADING_LIQUIDATE_ENTIRE_POSITIONS,
    ADD_MORE_THAN_FIVE_INDICATORS,
    MARKET_MOVERS_SCREEN,
    ALWAYS_VALID_ALERT,
    ADD_INDICATORS,
    ADD_DRAWINGS,
    MARKET_MOVERS_DEPTH,
    MARKET_WATCH_COLUMN_SETTINGS,
    INDEX_ANALYSIS_SCREEN
}

export enum FeatureCountType {
    Screens,
    Features
}

export class Feature {

    static features:Feature[] = [];

    constructor(public type:FeatureType, public access:AccessType, public registeredCount: number, public basicCount: number, public advancedCount: number, public arabic:string, public english:string, public featureCountType: FeatureCountType) { }

    static getFeature(featureType:FeatureType): Feature {
        let result:Feature = Feature.getFeatures().find(feature => feature.type == featureType);
        Tc.assert(result != null, "fail to find feature");
        return result;
    }

    static getAccess(featureType: FeatureType): AccessType {
        return this.getFeature(featureType).access;
    }

    private static getFeatures():Feature[] {
        if(!Feature.features.length) {
            Feature.features.push(new Feature(FeatureType.WINDOW_TOOLBAR, AccessType.REGISTERED, 0, 0,0, 'إضافة شاشات', 'Add Screens', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.ALERT, AccessType.BASIC_SUBSCRIPTION, 0, 0, 0,'التنبيهات', 'Alerts', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.MULTIPLE_SIMPLE_ALERTS, AccessType.PROFESSIONAL_SUBSCRIPTION, 0, 40 ,100, 'التنبيهات المتعددة', 'Multiple Alerts', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.CHART_ALERT, AccessType.BASIC_SUBSCRIPTION, 0, 0,0, 'تنبيهات الرسم البياني', 'Chart Alerts', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.TREND_LINE_ALERT, AccessType.BASIC_SUBSCRIPTION, 0, 0 ,0, 'تنبيهات خط الإتجاه', 'Trend Line Alerts', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.SAVE_WORKSPACE_LOCALLY, AccessType.REGISTERED, 0, 0 ,0, 'حفظ رسوماتك على الجهاز', 'Save Local Work', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.ADVANCE_WORKSPACE_CONTROL, AccessType.ADVANCED_SUBSCRIPTION, 0 ,0, Number.MAX_SAFE_INTEGER, 'التحكم المتقدم بمساحة العمل', 'Advance Workspaces Control', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.CREATE_WORKSPACE, AccessType.ADVANCED_SUBSCRIPTION, 0 ,0, 3, 'مساحات عمل', 'Workspaces', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.SAVE_DRAWINGS, AccessType.BASIC_SUBSCRIPTION, 0, 0,0, 'حفظ رسوماتك البيانية', 'Save Chart Drawings', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.DYNAMIC_BOX_LAYOUT, AccessType.REGISTERED, 0, 0 ,0, 'تنسيق الشاشات', 'Dynamic Layout', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.MULTIPLE_PAGES, AccessType.REGISTERED, 0, 0,0, 'إضافة صفحات متعددة', 'Add Multiple Pages', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.CHANGE_PAGES, AccessType.REGISTERED, 0, 0,0, 'التنقل بين الصفحات', 'Change Pages', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.SAVE_WORKSPACE_ON_CLOUD, AccessType.ADVANCED_SUBSCRIPTION, 0, 0,0, 'حفظ مساحات العمل', 'Save Workspaces', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.FILTER, AccessType.ADVANCED_SUBSCRIPTION, 0, 0,0,'التصفية', 'Filter', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.WATCHLIST_FILTER, AccessType.ADVANCED_SUBSCRIPTION, 0, 0, Number.MAX_SAFE_INTEGER,'التصفية', 'Filter', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.UPDATE_WATCHLIST_FILTER, AccessType.ADVANCED_SUBSCRIPTION, 0, 0, Number.MAX_SAFE_INTEGER,'تعديل التصفية', 'Update Filter', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.FILTER_SETTINGS, AccessType.ADVANCED_SUBSCRIPTION, 0, 0, 0,'تصفية البيانات', 'Filtering Data' , FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.LIQUIDITY_INDICATORS, AccessType.BASIC_SUBSCRIPTION, 0, 0,0,'مؤشرات السيولة', 'Liquidity Indicators', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.FINANCIAL_INDICATOR, AccessType.BASIC_SUBSCRIPTION, 0, 0,0,'المؤشرات المالية ', 'Financial Indicators', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.SUBSCRIBED_COLUMNS, AccessType.ADVANCED_SUBSCRIPTION, 0, 0, 0, ' الأعمدة المتقدمة', 'With Advance Columns Feature', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.HISTORICAL_TRADES, AccessType.ADVANCED_SUBSCRIPTION, 0, 0, 0,'الصفقات التاريخية', 'Historical Trades', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.WATCHLIST_ADD, AccessType.REGISTERED, 1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 'لوائح الأسهم', 'Watchlist', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.WATCHLIST_ADD_SYMBOL, AccessType.REGISTERED, 60, 700, 700,'رمز لمتابع السوق', 'Symbols to the market watch ', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.COMMUNITY, AccessType.REGISTERED, 0, 0, 0,'المجتمع', 'Community', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.CHART_SET_SIGNATURE, AccessType.PROFESSIONAL_SUBSCRIPTION, 0, 0, 0,'إضافة توقيع على الرسم البياني', 'Save Chart Signature', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.SAVE_CHART_ON_INTERNET, AccessType.REGISTERED, 0, 0, 0,'حفظ الرسم كرابط على الإنترنت ', 'Save screenshot online', FeatureCountType.Features));

            //Market Screens
            Feature.features.push(new Feature(FeatureType.MARKET_WATCH_SCREEN, AccessType.REGISTERED, 1, 1,3,'متابع السوق', 'Market Watch', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.INDEX_ANALYSIS_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 1,1,'تحليل المؤشر', 'Index Analysis', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.MARKET_TRADES_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 1,1,'صفقات السوق', 'Market Trades', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.MARKET_ALERTS_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 1,1,'راصد السوق', 'Market Alerts', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.BIG_TRADES_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 1,1,'الصفقات الكبيرة', 'Big Trades', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TECHNICAL_SCOPE_SCREEN, AccessType.ADVANCED_SUBSCRIPTION, 0, 1, 1,'راصد الإشارات الفنية', 'Technical Scope' , FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.MARKET_MOVERS_SCREEN, AccessType.REGISTERED, 1, 1, 1,'محركو السوق', 'Market Movers' , FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.MAJOR_SHAREHOLDERS_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 1,1,'كبار الملاك', 'Major Shareholders', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.MAJOR_SHAREHOLDERS_LIST_SCREEN, AccessType.BASIC_SUBSCRIPTION, 1, 1,0,'كبار الملاك', 'Major Shareholders', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.ANALYSIS_CENTER_SCREEN, AccessType.REGISTERED, 1, 1,1,'مركز التحليلات', 'Analysis Center', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.MARKET_PREOPEN_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 1,1,'مزاد الإفتتاح و الإغلاق', 'With Open & Close Auction', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.FINANCIAL_DATA, AccessType.BASIC_SUBSCRIPTION, 0, 1, 1,'البيانات المالية', 'Financial Data', FeatureCountType.Screens));

            //Company Screens
            Feature.features.push(new Feature(FeatureType.CHART_SCREEN, AccessType.REGISTERED, 1, 0, 10,'الرسم البياني', 'Chart', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.DETAILED_QUOTE_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 0,10,'السعر المفصل', 'Detailed Quote', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TIME_AND_SALE_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 0,10,'الصفقات', 'Trades', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADES_SUMMARY_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 0,10,'ملخص الصفقات', 'Trades Summary', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.COMPANY_NEWS_SCREEN, AccessType.REGISTERED, 1, 1,10,'إعلانات الشركة', 'Company Announcements', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.MARKET_DEPTH_BY_PRICE_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 0, 10,'عمق السوق حسب السعر', 'Market Depth By Price', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.MARKET_DEPTH_BY_ORDER_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 0,10,'عمق السوق حسب الترتيب', 'Market Depth By Order', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.COMPANY_FINANCIAL_STATEMENTS, AccessType.BASIC_SUBSCRIPTION, 0, 1,10,'البيانات المالية', 'Financial Data', FeatureCountType.Screens));
            //Trading Screens
            Feature.features.push(new Feature(FeatureType.TRADING_POSITIONS_SCREEN, AccessType.REGISTERED, 1, 1, Number.MAX_SAFE_INTEGER,'محفظة الأسهم', 'Portfolio', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_ORDERS_SCREEN, AccessType.REGISTERED, 1, 1, Number.MAX_SAFE_INTEGER,'أوامر البيع والشراء', 'Buy/Sell Orders', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_ACCOUNT_BALANCE_SCREEN, AccessType.REGISTERED, 1, 1, Number.MAX_SAFE_INTEGER,'رصيد الحساب', 'Account Balance', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_ACCOUNT_TRANSACTIONS_SCREEN, AccessType.REGISTERED, 1, 1, Number.MAX_SAFE_INTEGER,'حركات الحساب', 'Account Transactions', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_TRANSFER_MONEY_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 1, Number.MAX_SAFE_INTEGER,'تحويل الرصيد', 'Cash Transfer', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_ORDER_SEARCH_SCREEN, AccessType.BASIC_SUBSCRIPTION, 0, 1, Number.MAX_SAFE_INTEGER,'استفسار عن أمر', 'Order Search', FeatureCountType.Screens));

            //Trading Features
            Feature.features.push(new Feature(FeatureType.TRADING_BUY_SELL, AccessType.BASIC_SUBSCRIPTION, 0, Number.MAX_SAFE_INTEGER, 0,  'تداول - ميزة البيع والشراء', 'Trading - Buy And Sell', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_TRANSFER_MONEY, AccessType.BASIC_SUBSCRIPTION, 0, 1, 0,'تداول - ميزة التحويل النقدي', 'Trading - Transfer Money', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_DELETE_ORDERS, AccessType.BASIC_SUBSCRIPTION, 0, 0, 0, 'تداول - ميزة إلغاء الأوامر', 'Trading - Delete Orders', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_CLOSE_POSITIONS, AccessType.BASIC_SUBSCRIPTION, 0, 0, 0,'تداول - إغلاق الصفقات', 'Trading - Close Positions', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_REVERSE_POSITIONS, AccessType.BASIC_SUBSCRIPTION, 0, 0, 0, 'تداول - عكس الصفقات', 'Trading - Reverse Positions', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_REVERT_ORDERS, AccessType.BASIC_SUBSCRIPTION, 0, 0, 0,'تداول - تراجع الأوامر', 'Trading - Revert Orders', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_PORTFOLIO_CONTROL, AccessType.BASIC_SUBSCRIPTION, 0, 0,0, 'تداول - التحكم بالمحفظة', 'Trading - Portfolio Control', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.TRADING_LIQUIDATE_ENTIRE_POSITIONS, AccessType.BASIC_SUBSCRIPTION, 0, 0, 0,'تداول - تصفية الأسهم ', 'Trading - Liquidate Positions', FeatureCountType.Screens));

            //Chart
            Feature.features.push(new Feature(FeatureType.ADD_MORE_THAN_FIVE_INDICATORS, AccessType.BASIC_SUBSCRIPTION, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 'إضافة أكثر من 5 مؤشرات', 'Add more than 5 indicators', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.ADD_INDICATORS, AccessType.BASIC_SUBSCRIPTION, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 'المؤشرات المتقدمة ', 'Advanced Indicators', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.ADD_DRAWINGS, AccessType.BASIC_SUBSCRIPTION, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, ' الرسوم الفنية المتقدمة', 'Advanced Drawings', FeatureCountType.Features));

            Feature.features.push(new Feature(FeatureType.ALWAYS_VALID_ALERT, AccessType.PROFESSIONAL_SUBSCRIPTION, 0, 0, Number.MAX_SAFE_INTEGER,'تنبيه صالح دائما (بدون تاريخ صلاحية)', 'Always Valid Alert (With no expiration date)', FeatureCountType.Features));

            Feature.features.push(new Feature(FeatureType.CUSTOM_INTERVAL, AccessType.ADVANCED_SUBSCRIPTION, 0, 0, Number.MAX_SAFE_INTEGER,'الفواصل المخصصة', 'Custom Intervals', FeatureCountType.Screens));
            Feature.features.push(new Feature(FeatureType.MARKET_MOVERS_DEPTH, AccessType.BASIC_SUBSCRIPTION, 0, 0, Number.MAX_SAFE_INTEGER,'تغيير العمق', 'Change Level', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.MARKET_MOVERS_DEPTH, AccessType.BASIC_SUBSCRIPTION, 0, 0, Number.MAX_SAFE_INTEGER,'تغيير العمق', 'Change Level', FeatureCountType.Features));
            Feature.features.push(new Feature(FeatureType.MARKET_WATCH_COLUMN_SETTINGS, AccessType.BASIC_SUBSCRIPTION, 0, 0, Number.MAX_SAFE_INTEGER,'إعدادات متابع السوق', 'Market Watch Settings', FeatureCountType.Features));

        }
        return Feature.features;
    }

}

