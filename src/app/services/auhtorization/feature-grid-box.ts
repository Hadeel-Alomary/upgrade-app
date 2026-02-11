import {GridBoxType} from '../../components/shared';
import {FeatureType} from './feature';
import {Tc} from '../../utils';

export class FeatureGridBox {

    public static getAuthorizationFeatureTypeByGridBoxType(gridBoxType: GridBoxType): FeatureType {
        switch (gridBoxType) {

            // Market Grids
            case GridBoxType.Marketwatch:
                return FeatureType.MARKET_WATCH_SCREEN;

            case GridBoxType.IndexAnalysis:
                return FeatureType.INDEX_ANALYSIS_SCREEN;

            case GridBoxType.MarketTrades:
                return FeatureType.MARKET_TRADES_SCREEN;

            case GridBoxType.MarketAlerts:
                return FeatureType.MARKET_ALERTS_SCREEN;

            case GridBoxType.BigTrades:
                return FeatureType.BIG_TRADES_SCREEN;

            case GridBoxType.TechnicalScope:
                return FeatureType.TECHNICAL_SCOPE_SCREEN;

            case GridBoxType.Shareholders:
                return FeatureType.MAJOR_SHAREHOLDERS_SCREEN;

            case GridBoxType.ShareholdersList:
                return FeatureType.MAJOR_SHAREHOLDERS_LIST_SCREEN;

            case GridBoxType.AnalysisCenter:
                return FeatureType.ANALYSIS_CENTER_SCREEN;

            case GridBoxType.MarketPreOpen:
                return FeatureType.MARKET_PREOPEN_SCREEN;

            case GridBoxType.FinancialData:
                return FeatureType.FINANCIAL_DATA;

            case GridBoxType.MarketMovers:
                return FeatureType.MARKET_MOVERS_SCREEN;


            //Company Grids
            case GridBoxType.Chart:
                return FeatureType.CHART_SCREEN;

            case GridBoxType.DetailedQuote:
                return FeatureType.DETAILED_QUOTE_SCREEN;

            case GridBoxType.TimeAndSale:
                return FeatureType.TIME_AND_SALE_SCREEN;

            case GridBoxType.TradesSummary:
                return FeatureType.TRADES_SUMMARY_SCREEN;

            case GridBoxType.CompanyNews:
                return FeatureType.COMPANY_NEWS_SCREEN;

            case GridBoxType.MarketDepthByPrice:
                return FeatureType.MARKET_DEPTH_BY_PRICE_SCREEN;

            case GridBoxType.MarketDepthByOrder:
                return FeatureType.MARKET_DEPTH_BY_ORDER_SCREEN;

            case GridBoxType.CompanyFinancialStatements:
                return FeatureType.COMPANY_FINANCIAL_STATEMENTS;

            case GridBoxType.VirtualTradingPositions:
            case GridBoxType.DerayahWallet:
            case GridBoxType.SnbcapitalWallet:
            case GridBoxType.RiyadcapitalWallet:
            case GridBoxType.AljaziracapitalWallet:
            case GridBoxType.AlrajhicapitalWallet:
            case GridBoxType.AlinmainvestWallet:
            case GridBoxType.TradestationPositions:
            case GridBoxType.MusharakaWallet:
            case GridBoxType.BsfWallet:
            case GridBoxType.AlkhabeercapitalWallet:
                return FeatureType.TRADING_POSITIONS_SCREEN;

            case GridBoxType.VirtualTradingOrders:
            case GridBoxType.DerayahOrders:
            case GridBoxType.SnbcapitalOrders:
            case GridBoxType.RiyadcapitalOrders:
            case GridBoxType.AljaziracapitalOrders:
            case GridBoxType.AlrajhicapitalOrders:
            case GridBoxType.AlinmainvestOrders:
            case GridBoxType.TradestationOrders:
            case GridBoxType.MusharakaOrders:
            case GridBoxType.BsfOrders:
            case GridBoxType.AlkhabeercapitalOrders:
                return FeatureType.TRADING_ORDERS_SCREEN;

            case GridBoxType.SnbcapitalAccountBalance:
            case GridBoxType.RiyadcapitalAccountBalance:
            case GridBoxType.AljaziracapitalAccountBalance:
            case GridBoxType.AlrajhicapitalAccountBalance:
            case GridBoxType.AlinmainvestAccountBalance:
            case GridBoxType.TradestationAccountBalance:
            case GridBoxType.MusharakaAccountBalance:
            case GridBoxType.BsfAccountBalance:
            case GridBoxType.AlkhabeercapitalAccountBalance:
                return FeatureType.TRADING_ACCOUNT_BALANCE_SCREEN;

            case GridBoxType.SnbcapitalOrderSearch:
            case GridBoxType.RiyadcapitalOrderSearch:
            case GridBoxType.AljaziracapitalOrderSearch:
            case GridBoxType.AlrajhicapitalOrderSearch:
            case GridBoxType.AlinmainvestOrderSearch:
            case GridBoxType.MusharakaOrderSearch:
            case GridBoxType.BsfOrderSearch:
            case GridBoxType.AlkhabeercapitalOrderSearch:
                return FeatureType.TRADING_ORDER_SEARCH_SCREEN;

            default:
                Tc.error('Unknown GridBox Type: ' + gridBoxType);
        }
    }

}

