import {Injectable} from '@angular/core';
import {LanguageService} from '../state/index';
import {GridBoxType} from '../../components/shared/grid-box/grid-box-type';
import {SlickGridFormatter} from './slick-grid-formatter-type';
import {Tc} from '../../utils/index';
import {MarketWatchCategoryType} from '../../components/marketwatch/market-watch-category';

@Injectable()
export class SlickGridColumnsService {

    constructor(private languageService: LanguageService) {
    }

    public getDefaultColumns(type: GridBoxType): GridColumn[] {
        let defaultColumns: GridColumn[];
        switch (type) {
            case GridBoxType.Chart:
            case GridBoxType.DetailedQuote:
            case GridBoxType.TradestationAccountBalance:
            case GridBoxType.SnbcapitalAccountBalance:
            case GridBoxType.RiyadcapitalAccountBalance:
            case GridBoxType.AlinmainvestAccountBalance:
            case GridBoxType.AljaziracapitalAccountBalance:
            case GridBoxType.AlrajhicapitalAccountBalance:
            case GridBoxType.MusharakaAccountBalance:
            case GridBoxType.BsfAccountBalance:
            case GridBoxType.AlkhabeercapitalAccountBalance:
                //NK they do not implement slick grid
                defaultColumns = [];
                break;
            case GridBoxType.TimeAndSale:
                defaultColumns = [
                    {id: 'time'},
                    {id: 'volume'},
                    {id: 'price'},
                    {id: 'amount'},
                    {id: 'direction'},
                ];
                break;
            case GridBoxType.FinancialData:
                defaultColumns = [
                    {id: 'symbol'},
                    {id: 'company'},
                    {id: 'name'},
                    {id: 'firstQuarter'},
                    {id: 'secondQuarter'},
                    {id: 'thirdQuarter'},
                    {id: 'fourthQuarter'},
                    {id: 'annual'},
                    {id: 'id'},
                    {id: 'last'},
                    {id: 'eps'},
                    {id: 'priceToEarnings'},
                    {id: 'dividendsYield'},
                    {id: 'dividendsYieldByShare'},
                    {id: 'bookValue'},
                    {id: 'priceBook'},
                    {id: 'issuedShares'},
                    {id: 'marketCap'},
                    {id: 'netIncome'},
                    {id: 'totalShareholdersEquity'},
                    {id: 'returnOnEquity'},
                    {id: 'totalAssets'},
                    {id: 'returnOnAssets'},
                    {id: 'returnOnMarketCap'},
                    {id: 'salesRevenue'},
                    {id: 'marketCapOnSalesAndRevenue'},
                    {id: 'ebit'},
                    {id: 'totalCapital'},
                    {id: 'accumulatedMinorityInterest'},
                    {id: 'returnOnTotalCapital'},
                ]
                break;
            case GridBoxType.CompanyFinancialStatements:
                defaultColumns = [
                    {id: 'date'},
                    {id: 'category'},
                    {id: 'amount'},
                    {id: 'description'},
                    {id: 'announcementDate'},
                    {id: 'recordDate'},
                    {id: 'payDate'},
                    {id:'name'},
                    {id:'position'},
                    {id:'age'},
                ]
                break;
            case GridBoxType.Marketwatch:
                defaultColumns = [
                    {id: 'flag'},
                    {id: 'alert'},
                    {id: 'news'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'close'},
                    {id: 'last'},
                    {id: 'lastVolume'},
                    {id: 'direction'},
                    {id: 'change'},
                    {id: 'changePercent'},
                    {id: 'bidVolume'},
                    {id: 'bidPrice'},
                    {id: 'askPrice'},
                    {id: 'askVolume'},
                    {id: 'volume'},
                    {id: 'amount'},
                    {id: 'trades'},
                    {id: 'open'},
                    {id: 'high'},
                    {id: 'low'},
                    {id: 'previousClose'},
                    {id: 'liquidityFlow'},
                    {id: 'liquidityNet'},
                    {id: 'liquidityInflowPercent'}
                ];
                break;
            case GridBoxType.MarketTrades:
                defaultColumns = [
                    {id: 'name'},
                    {id: 'time'},
                    {id: 'volume'},
                    {id: 'price'},
                    {id: 'contarcts'},
                    {id: 'direction'},
                ];
                break;
            case GridBoxType.MarketPreOpen:
                defaultColumns = [
                    {id: 'balloon'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'preOpenPrice'},
                    {id: 'preOpenVolume'},
                    {id: 'askPrice'},
                    {id: 'askVolume'},
                    {id: 'bidPrice'},
                    {id: 'bidVolume'},
                    {id: 'preOpenChange'},
                    {id: 'preOpenChangePercentage'},
                    {id: 'effectIndex'},
                    {id: 'effectSector'}
                ];
                break;
            case GridBoxType.MarketDepthByPrice:
                defaultColumns = [
                    {id: 'bidOrders'},
                    {id: 'bidQuantity'},
                    {id: 'bidPrice'},
                    {id: 'askPrice'},
                    {id: 'askQuantity'},
                    {id: 'askOrders'},
                ];
                break;
            case GridBoxType.MarketDepthByOrder:
                defaultColumns = [
                    {id: 'bidQuantity'},
                    {id: 'bidPrice'},
                    {id: 'askPrice'},
                    {id: 'askQuantity'},
                ];
                break;
            case GridBoxType.MarketAlerts:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'time'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'message'},
                ];
                break;
            case GridBoxType.TechnicalScope:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'time'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'signal'},
                ];
                break;
            case GridBoxType.MarketMovers:
                defaultColumns = [
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'close'},
                    {id: 'change'},
                    {id: 'changePercent'},
                    {id: 'volume'},
                    {id: 'amount'},
                    {id: 'trades'},
                ];
                break;
            case GridBoxType.DerayahWallet:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'freeQuantity'},
                    {id: 'cost'},
                    {id: 'currentPrice'},
                    {id: 'totalCost'},
                    {id: 'currentTotalCost'},
                    {id: 'costDiff'},
                    {id: 'perCostDiff'}
                ];
                break;
            case GridBoxType.DerayahOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'date'},
                    {id: 'id'},
                    {id: 'type'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'price'},
                    {id: 'status'}
                ];
                break;
            case GridBoxType.SnbcapitalWallet:
            case GridBoxType.AlrajhicapitalWallet:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'freeQuantity'},
                    {id: 'blockedQuantity'},
                    {id: 'cost'},
                    {id: 'currentPrice'},
                    {id: 'totalCost'},
                    {id: 'currentTotalCost'},
                    {id: 'costDiff'},
                    {id: 'costDiffPercent'}
                ];
                break;
            case GridBoxType.SnbcapitalOrders:
            case GridBoxType.AlrajhicapitalOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'id'},
                    {id: 'date'},
                    {id: 'time'},
                    {id: 'type'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'remainingQuantity'},
                    {id: 'price'},
                    {id: 'status'}
                ];
                break;
            case GridBoxType.SnbcapitalOrderSearch:
            case GridBoxType.AlrajhicapitalOrderSearch:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'type'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'remainingQuantity'},
                    {id: 'price'},
                    {id: 'status'}
            ];
                break;
            case GridBoxType.RiyadcapitalWallet:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'cost'},
                    {id: 'unsettledSell'},
                    {id: 'currentPrice'},
                    {id: 'totalCost'},
                    {id: 'currentTotalCost'},
                    {id: 'costDiff'},
                    {id: 'costDiffPercent'},
                    {id: 'portfolioName'}
                ];
                break;
            case GridBoxType.MusharakaWallet:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'freeQuantity'},
                    {id: 'avgCst'},
                    {id: 'currentPrice'},
                    {id: 'totalCost'},
                    {id: 'currentTotalCost'},
                    {id: 'costDiff'},
                    {id: 'costDiffPercent'},
                    {id: 'pendSell'},
                    {id: 'pendBuy'},
                    {id: 'averagePrice'},
                ];
                break;
            case GridBoxType.BsfWallet:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'freeQuantity'},
                    {id: 'avgCst'},
                    {id: 'currentPrice'},
                    {id: 'totalCost'},
                    {id: 'currentTotalCost'},
                    {id: 'costDiff'},
                    {id: 'costDiffPercent'},
                    {id: 'pendSell'},
                    {id: 'pendBuy'},
                    {id: 'averagePrice'},
                ];
                break;
            case GridBoxType.AlkhabeercapitalWallet:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'freeQuantity'},
                    {id: 'avgCst'},
                    {id: 'currentPrice'},
                    {id: 'totalCost'},
                    {id: 'currentTotalCost'},
                    {id: 'costDiff'},
                    {id: 'costDiffPercent'},
                    {id: 'pendSell'},
                    {id: 'pendBuy'},
                    {id: 'averagePrice'},
                ];
                break;
            case GridBoxType.RiyadcapitalOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'type'},
                    {id: 'status'},
                    {id: 'name'},
                    {id: 'price'},
                    {id: 'quantity'},
                    {id: 'date'},
                    {id: 'fillQuantity'},
                    {id: 'avgPrice'},
                    {id: 'orderRefNo'},
                    {id: 'time'},
                    {id: 'symbol'},
                    {id: 'portfolioName'},
                ];
                break;
            case GridBoxType.MusharakaOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'clientId'},
                    {id: 'type'},
                    {id: 'status'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'price'},
                    {id: 'pendingQuantity'},
                    {id: 'date'},
                    {id: 'vatAmount'},
                    {id: 'totalCommission'},
                    {id: 'expiryDate'},
                    {id: 'portfolioName'},
                    {id: 'discloseQuantity'},
                    {id: 'expiration'},
                ];
                break;
            case GridBoxType.BsfOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'clientId'},
                    {id: 'type'},
                    {id: 'status'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'price'},
                    {id: 'pendingQuantity'},
                    {id: 'date'},
                    {id: 'vatAmount'},
                    {id: 'totalCommission'},
                    {id: 'expiryDate'},
                    {id: 'portfolioName'},
                    {id: 'discloseQuantity'},
                    {id: 'expiration'},
                ];
                break;
            case GridBoxType.AlkhabeercapitalOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'clientId'},
                    {id: 'type'},
                    {id: 'status'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'price'},
                    {id: 'pendingQuantity'},
                    {id: 'date'},
                    {id: 'vatAmount'},
                    {id: 'totalCommission'},
                    {id: 'expiryDate'},
                    {id: 'portfolioName'},
                    {id: 'discloseQuantity'},
                    {id: 'expiration'},
                ];
                break;
            case GridBoxType.MusharakaOrderSearch:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'clientId'},
                    {id: 'date'},
                    {id: 'type'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'price'},
                    {id: 'status'}
                ];
                break;
            case GridBoxType.BsfOrderSearch:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'clientId'},
                    {id: 'date'},
                    {id: 'type'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'price'},
                    {id: 'status'}
                ];
                break;
            case GridBoxType.AlkhabeercapitalOrderSearch:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'clientId'},
                    {id: 'date'},
                    {id: 'type'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'price'},
                    {id: 'status'}
                ];
                break;
            case GridBoxType.RiyadcapitalOrderSearch:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'type'},
                    {id: 'status'},
                    {id: 'name'},
                    {id: 'price'},
                    {id: 'quantity'},
                    {id: 'date'},
                    {id: 'fillQuantity'},
                    {id: 'time'},
                    {id: 'avgPrice'},
                ];
                break;

            case GridBoxType.AlinmainvestWallet:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'bledgeQuantity'},
                    {id: 'costValue'},
                    {id: 'unSettledSellQuantity'},
                    {id: 'portfolioName'},
                    {id: 'currentPrice'},
                    {id: 'currentTotalCost'},
                    {id: 'costDiff'},

                ];
                break;
            case GridBoxType.AlinmainvestOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'type'},
                    {id: 'status'},
                    {id: 'name'},
                    {id: 'price'},
                    {id: 'quantity'},
                    {id: 'date'},
                    {id: 'fillQuantity'},
                    {id: 'orderRefNo'},
                    {id: 'time'},
                    {id: 'symbol'},
                    {id: 'portfolioName'},
                    {id: 'discloseQuantity'},
                    {id: 'expiryDate'},

                ];
                break;
            case GridBoxType.AlinmainvestOrderSearch:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'type'},
                    {id: 'status'},
                    {id: 'name'},
                    {id: 'price'},
                    {id: 'quantity'},
                    {id: 'date'},
                    {id: 'fillQuantity'},
                    {id: 'time'},
                ];
                break;
            case GridBoxType.AljaziracapitalWallet:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'freeQuantity'},
                    {id: 'avgCost'},
                    {id: 'totalCost'},
                    {id: 'currentPrice'},
                    {id: 'currentTotalCost'},
                    {id: 'costDiff'},
                    {id: 'costDiffPercent'},
                ];
                break;
            case GridBoxType.AljaziracapitalOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'type'},
                    {id: 'status'},
                    {id: 'name'},
                    {id: 'price'},
                    {id: 'quantity'},
                    {id: 'pendingQuantity'},
                    {id: 'date'},
                ];
                break;
            case GridBoxType.AljaziracapitalOrderSearch:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'type'},
                    {id: 'status'},
                    {id: 'name'},
                    {id: 'price'},
                    {id: 'quantity'},
                    {id: 'date'}
                ];
                break;
            case GridBoxType.CompanyNews:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'date'},
                    {id: 'header'},
                ];
                break;
            case GridBoxType.ShareholdersList:
                defaultColumns = [
                    {id: 'name'},
                    {id: 'count'},
                ];
                break;
            case GridBoxType.BigTrades:
                defaultColumns = [
                    {id: 'time'},
                    {id: 'name'},
                    {id: 'volume'},
                    {id: 'price'},
                    {id: 'amount'},
                    {id: 'contracts'},
                    {id: 'direction'},
                ];
                break;
            case GridBoxType.AnalysisCenter:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'createdDate'},
                    {id: 'symbol'},
                    {id: 'name'},
                    {id: 'analyzerName'},
                    {id: 'title'},
                    {id: 'visits'}
                ];
                break;
            case GridBoxType.VirtualTradingPositions:
                defaultColumns = [
                    {id: 'id'},
                    {id: 'name'},
                    {id: 'quantity'},
                    {id: 'freeQuantity'},
                    {id: 'totalCost'},
                    {id: 'currentTotalCost'},
                    {id: 'costDiff'},
                ];
                break;
            case GridBoxType.VirtualTradingOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'name'},
                    {id: 'status'},
                    {id: 'execution'},
                    {id: 'quantity'},
                    {id: 'price'},
                    {id: 'executionTime'},
                ];
                break;
            case GridBoxType.TradesSummary:
                defaultColumns = [
                    {id: 'price'},
                    {id: 'trades'},
                    {id: 'buyTrades'},
                    {id: 'sellTrades'},
                    {id: 'volume'},
                    {id: 'buyVolume'},
                    {id: 'sellVolume'},
                    {id: 'value'},
                    {id: 'buyValue'},
                    {id: 'sellValue'}
                ]
                break;
            case GridBoxType.TradestationOrders:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'companyName'},
                    {id: 'side'},
                    {id: 'status'},
                    {id: 'price'},
                    {id: 'stopPrice'},
                    {id: 'quantity'},
                    {id: 'executedQuantity'},
                    {id: 'leavesQuantity'},
                    {id: 'executedPrice'},
                    {id: 'takeProfitPrice'},
                    {id: 'stopLossPrice'},
                    {id: 'expirationType'}
                ];
                break;
            case GridBoxType.TradestationPositions:
                defaultColumns = [
                    {id: 'actions'},
                    {id: 'id'},
                    {id: 'symbol'},
                    {id: 'companyName'},
                    {id: 'type'},
                    {id: 'quantity'},
                    {id: 'totalCost'},
                    {id: 'averagePrice'},
                    {id: 'marketValue'},
                    {id: 'todaysProfitLoss'},
                    {id: 'profitLoss'},
                    {id: 'profitLossPercent'}
                ];
                break;
            case GridBoxType.IndexAnalysis:
                defaultColumns = [
                    {id: 'company'},
                    {id: 'close'},
                    {id: 'change'},
                    {id: 'effectOnIndex'}
                ];
                break;
            default:
                Tc.error("unknown grid box type: " + type);
        }
        return defaultColumns;
    }

    public getColumnsDefinition(type: GridBoxType): ColumnDefinition[] {
        let columnsDefinition: ColumnDefinition[];
        switch (type) {
            case GridBoxType.Chart:
            case GridBoxType.DetailedQuote:
            case GridBoxType.Shareholders:
            case GridBoxType.TradestationAccountBalance:
            case GridBoxType.SnbcapitalAccountBalance:
            case GridBoxType.RiyadcapitalAccountBalance:
            case GridBoxType.AlinmainvestAccountBalance:
            case GridBoxType.AljaziracapitalAccountBalance:
            case GridBoxType.AlrajhicapitalAccountBalance:
                //NK they do not implement slick grid
                columnsDefinition = [];
                break;
            case GridBoxType.FinancialData:
                columnsDefinition = [
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'symbol',
                        width: 60,
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        sortable: true,
                        sortType: 'string',
                    },
                    {
                        id: 'company',
                        name: this.translate('الشركة'),
                        field: 'name',
                        cssClass: 'name flag',
                        width: 120,
                        sortable: true,
                        sortType: 'string',
                        formatterTypes:[SlickGridFormatter.FlagAnnotation]

                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'name',
                        width: 160,
                       formatterTypes:[SlickGridFormatter.FlagAnnotation]
                    },
                    {
                        id: 'firstQuarter',
                        name: this.translate('الربع الأول'),
                        field: 'firstQuarter',
                        cssClass: 'quarter center',
                        formatterTypes: [SlickGridFormatter.FinancialDataQuarter],

                    },
                    {
                        id: 'secondQuarter',
                        name: this.translate('الربع الثاني'),
                        field: 'secondQuarter',
                        cssClass: 'quarter',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.FinancialDataQuarter],
                    },
                    {
                        id: 'thirdQuarter',
                        name: this.translate('الربع الثالث'),
                        field: 'thirdQuarter',
                        cssClass: 'quarter center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.FinancialDataQuarter],

                    },
                    {
                        id: 'fourthQuarter',
                        name: this.translate('الربع الرابع'),
                        field: 'fourthQuarter',
                        cssClass: 'quarter center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.FinancialDataQuarter],
                    },
                    {
                        id: 'annual',
                        name: this.translate('سنوي'),
                        field: 'annual',
                        cssClass: 'quarter center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.FinancialDataQuarter],
                    },

                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'details  center',
                        formatterTypes: [SlickGridFormatter.FinancialDataDetails],
                        width: 100,
                        sortable: true,
                        mobileWidth:150
                    },
                    {
                        id: 'last',
                        name: this.translate('إغلاق'),
                        field: 'last',
                        cssClass: 'last-column highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'eps',
                        name: this.translate('ربح السهم (أخر 12 شهر)'),
                        field: 'eps',
                        cssClass: 'eps-column highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'priceToEarnings',
                        name: this.translate('مكرر الأرباح'),
                        field: 'priceToEarnings',
                        cssClass: 'price-to-earnings-column highlight-column',
                        formatterTypes: [SlickGridFormatter.FinancialDataNumbers],
                        sortable: true
                    },
                    {
                        id: 'dividendsYield',
                        name: this.translate('العائد الربحي (%)'),
                        field: 'dividendsYield',
                        cssClass: 'dividends_yield-column highlight-column',
                        formatterTypes: [SlickGridFormatter.FinancialDataNumbers],
                        sortable: true
                    },
                    {
                        id: 'dividendsYieldByShare',
                        name: this.translate('توزيع الأرباح لكل سهم (سنوي)'),
                        field: 'dividendsYieldByShare',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'bookValue',
                        name: this.translate('القيمة الدفترية'),
                        field: 'bookValue',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },                    {
                        id: 'priceBook',
                        name: this.translate('مكرر القيمة الدفترية'),
                        field: 'priceBook',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.FinancialDataPriceBook],
                        sortable: true
                    },
                    {
                        id: 'issuedShares',
                        name: this.translate('الاسهم المصدرة'),
                        field: 'issuedShares',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'marketCap',
                        name: this.languageService.arabic ? 'القيمة السوقية': 'Market Cap',
                        field: 'marketCap',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true
                    },
                    {
                        id: 'netIncome',
                        name: this.translate('صافي الدخل'),
                        field: 'netIncome',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'totalShareholdersEquity',
                        name: this.translate('إجمالي حقوق المساهمين'),
                        field: 'totalShareholdersEquity',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'returnOnEquity',
                        name: this.translate('العائد على حقوق الملكية'),
                        field: 'returnOnEquity',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true
                    },
                    {
                        id: 'totalAssets',
                        name: this.translate('إجمالي الأصول'),
                        field: 'totalAssets',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'returnOnAssets',
                        name: this.translate('العائد على الأصول'),
                        field: 'returnOnAssets',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true
                    },
                    {
                        id: 'returnOnMarketCap',
                        name: this.translate('العائد على القيمة السوقية'),
                        field: 'returnOnMarketCap',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.Number3Digits],
                    },
                    {
                        id: 'salesRevenue',
                        name: this.translate('الإيرادات'),
                        field: 'salesRevenue',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.Number3Digits],
                    },
                    {
                        id: 'marketCapOnSalesAndRevenue',
                        name: this.translate('القيمة السوقية على الإيرادات'),
                        field: 'marketCapOnSalesAndRevenue',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.Number3Digits],
                        sortable: true
                    },
                    {
                        id: 'ebit',
                        name: 'EBIT',
                        field: 'ebit',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'totalCapital',
                        name: this.translate('رأس المال'),
                        field: 'totalCapital',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'accumulatedMinorityInterest',
                        name: this.translate('فوائد الأقلية المتراكمة'),
                        field: 'accumulatedMinorityInterest',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                    },
                    {
                        id: 'returnOnTotalCapital',
                        name: this.translate('العائد على راس المال'),
                        field: 'returnOnTotalCapital',
                        cssClass: 'highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true
                    },

                ]
                break;

             case GridBoxType.CompanyFinancialStatements:
                 columnsDefinition = [
                     {
                         id: 'date',
                         name: this.translate('التاريخ'),
                         field: 'date',
                         sortable: true,
                         sortType:'date',
                         dateFormat: "DD-MM-YYYY",
                     },
                     {
                         id: 'category',
                         name: this.translate('النوع'),
                         field: 'category',
                         cssClass: 'fixed-column name category',
                         sortable: true,
                         sortType:'string',
                         formatterTypes: [SlickGridFormatter.FinancialStatementCategory],
                         width: 150,
                         mobileWidth:80
                     },
                     {
                         id: 'amount',
                         name: this.translate('القيمة'),
                         field: 'amount',
                         cssClass: 'fixed-column center highlight-column',
                         sortable: true,
                         formatterTypes: [SlickGridFormatter.Number3Digits],
                         width: 80,
                     },
                     {
                         id: 'description',
                         name: this.translate('التفاصيل'),
                         field: 'description',
                         cssClass: 'fixed-column name text-right description',
                         sortable: true,
                         sortType:'string',
                         formatterTypes: [SlickGridFormatter.None],
                         width: 150,
                         mobileWidth: 80
                     },
                     {
                         id: 'announcementDate',
                         name: this.translate('تاريخ الإعلان'),
                         field: 'announcementDate',
                         cssClass: 'fixed-column',
                         sortable: true,
                         sortType:'date',
                         dateFormat: "DD-MM-YYYY",
                     },
                     {
                         id: 'recordDate',
                         name: this.translate('تاريخ الأحقية'),
                         field: 'recordDate',
                         cssClass: 'fixed-column',
                         sortable: true,
                         sortType:'date',
                         dateFormat: "DD-MM-YYYY",
                     },
                     {
                         id: 'payDate',
                         name: this.translate('تاريخ التوزيع'),
                         field: 'payDate',
                         cssClass: 'fixed-column',
                         sortable: true,
                         sortType:'date',
                         dateFormat: "DD-MM-YYYY",
                     },
                     {
                         id: 'name',
                         name: this.translate('الإسم'),
                         field: 'name',
                         cssClass: 'name text-right balloon',
                         width: 160,
                         sortable: true,
                         resizable: true,
                         sortType: 'string',
                         formatterTypes: [SlickGridFormatter.balloonAnnotation]
                     },
                     {
                         id: 'position',
                         name: this.translate('الوظيفة'),
                         field: 'position',
                         cssClass: 'text-right position',
                         width: 160,
                         sortable: true,
                         sortType: 'string'
                     },                     {
                         id: 'age',
                         name: this.translate('العمر'),
                         field: 'age',
                         cssClass: 'age',
                         width: 160,
                         sortable: true,
                         sortType: 'string',
                         mobileWidth: 80
                     },
                     ]
                break;

            case GridBoxType.TimeAndSale:
                columnsDefinition = [
                    {id: 'time', name: this.translate('الوقت'), field: 'time', cssClass: 'time'},
                    {
                        id: 'volume',
                        name: this.translate('حجم آخر'),
                        field: 'volume',
                        cssClass: 'volume highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'price highlight-column',
                        formatterTypes: [SlickGridFormatter.NegativePositiveByState]
                    },
                    {
                        id: 'amount',
                        name: this.translate('القيمة'),
                        field: 'amount',
                        cssClass: 'amount',
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'direction',
                        name: this.translate('الاتجاه'),
                        field: 'direction',
                        cssClass: 'direction',
                        formatterTypes: [SlickGridFormatter.Direction],
                        width: 45
                    },
                    {
                        id: 'contracts',
                        name: this.translate('العدد'),
                        field: 'contracts',
                        cssClass: 'contracts',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 45
                    },
                    {
                        id: 'state',
                        name: this.translate('النوع'),
                        field: 'state',
                        cssClass: 'name state',
                        formatterTypes: [SlickGridFormatter.TimeAndSaleState]
                    },
                ];
                break;
            case GridBoxType.Marketwatch:
                columnsDefinition = [
                    // MA fixed-column class is used to prevent columns from being draggable
                    {
                        id: 'flag',
                        name: '<div class="header-icon header-flag"></div>',
                        field: 'flag',
                        cssClass: 'fixed-column flag',
                        formatterTypes: [SlickGridFormatter.MarketwatchFlag],
                        width: 30,
                        resizable: false,
                        sortable: true,
                        sortType: 'string',
                        excludeInProperties: true
                    },
                    {
                        id: 'alert',
                        name: '<div class="header-icon header-alert"></div>',
                        field: 'alert',
                        cssClass: 'fixed-column company-alert',
                        formatterTypes: [SlickGridFormatter.MarketwatchAlert],
                        width: 30,
                        resizable: false,
                        sortable: true,
                        sortType: 'field',
                        excludeInProperties: true,
                        sortField: 'id'
                    },
                    {
                        id: 'news',
                        name: '<div class="header-icon header-news"></div>',
                        field: 'news',
                        cssClass: 'fixed-column news analysis',
                        formatterTypes: [SlickGridFormatter.MarketwatchNewsAnalysis],
                        width: 30,
                        resizable: false,
                        sortable: true,
                        sortType: 'two-fields',
                        excludeInProperties: true,
                        sortField: 'id',
                        sortField1: 'news',
                        sortField2: 'analysis'
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'symbol',
                        width: 80,
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        sortable: true,
                        sortType: 'string',
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'name',
                        width: 160,
                        sortable: true,
                        sortType: 'string',
                        category: MarketWatchCategoryType.EssentialColumn,
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed]
                    },

                    {
                        id: 'close',
                        name: this.translate('إغلاق'),
                        field: 'close',
                        cssClass: 'close-column highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'last',
                        name: this.translate('آخر'),
                        field: 'last',
                        cssClass: 'last highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'lastVolume',
                        name: this.translate('حجم آخر'),
                        field: 'lastVolume',
                        cssClass: 'lastVolume highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },

                    {
                        id: 'direction',
                        name: this.translate('الاتجاه'),
                        field: 'direction',
                        cssClass: 'direction',
                        formatterTypes: [SlickGridFormatter.Direction],
                        width: 60,
                        sortable: true,
                        sortType: 'string',
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'change',
                        name: this.translate('التغير'),
                        field: 'change',
                        cssClass: 'change',
                        formatterTypes: [SlickGridFormatter.ChangeDigit],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'changePercent',
                        name: this.translate('التغير %'),
                        field: 'changePercent',
                        cssClass: 'changePercent',
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },

                    {
                        id: 'bidVolume',
                        name: this.translate('حجم أفضل طلب'),
                        field: 'bidVolume',
                        cssClass: 'bidVolume green-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn,
                        width:  100,
                        mobileWidth: 90
                    },
                    {
                        id: 'bidPrice',
                        name: this.translate('الطلب'),
                        field: 'bidPrice',
                        cssClass: 'bidPrice green-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'askPrice',
                        name: this.translate('العرض'),
                        field: 'askPrice',
                        cssClass: 'askPrice red-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'askVolume',
                        name: this.translate('حجم أفضل عرض'),
                        field: 'askVolume',
                        cssClass: 'askVolume red-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn,
                        width:  100,
                        mobileWidth: 90
                    },

                    {
                        id: 'volume',
                        name: this.translate('الحجم'),
                        field: 'volume',
                        cssClass: 'volume',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'amount',
                        name: this.translate('القيمة'),
                        field: 'amount',
                        cssClass: 'amount',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'trades',
                        name: this.translate('الصفقات'),
                        field: 'trades',
                        cssClass: 'trades',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },

                    {
                        id: 'open',
                        name: this.translate('إفتتاح'),
                        field: 'open',
                        cssClass: 'open',
                        formatterTypes: [SlickGridFormatter.MarketwatchOpen],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'high',
                        name: this.translate('أعلى'),
                        field: 'high',
                        cssClass: 'high',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'low',
                        name: this.translate('أدنى'),
                        field: 'low',
                        cssClass: 'low',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'sector',
                        name: this.translate('القطاع'),
                        field: 'sector',
                        cssClass: 'sector name',
                        formatterTypes: [SlickGridFormatter.MarketwatchSector],
                        sortable: true,
                        width: 150,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'date',
                        name: this.translate('التاريخ'),
                        field: 'date',
                        cssClass: 'date',
                        formatterTypes: [SlickGridFormatter.DateTime],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'time',
                        name: this.translate('الوقت'),
                        field: 'time',
                        cssClass: 'time',
                        formatterTypes: [SlickGridFormatter.DateTime],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'limitUp',
                        name: this.translate('الحد الأعلى'),
                        field: 'limitUp',
                        cssClass: 'limitUp',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'limitDown',
                        name: this.translate('الحد الأدنى'),
                        field: 'limitDown',
                        cssClass: 'limitDown',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'totalBidVolume',
                        name: this.translate('إجمالي حجم الطلب'),
                        field: 'totalBidVolume',
                        cssClass: 'totalBidVolume green-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        mobileWidth: 120,
                        category: MarketWatchCategoryType.EssentialColumn,
                        mobileName: 'إجمالي ح. الطلب'
                    },
                    {
                        id: 'totalAskVolume',
                        name: this.translate('إجمالي حجم العرض'),
                        field: 'totalAskVolume',
                        cssClass: 'totalAskVolume red-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn,
                        mobileName: 'إجمالي ح. العرض'
                    },

                    {
                        id: 'preOpenPrice',
                        name: this.translate('السعر الافتراضي'),
                        field: 'preOpenPrice',
                        cssClass: 'preOpenPrice',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn,
                        mobileName:'سعر افتراضي'
                    },
                    {
                        id: 'preOpenVolume',
                        name: this.translate('الكمية الافتراضية'),
                        field: 'preOpenVolume',
                        cssClass: 'preOpenVolume',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn,
                        mobileName:'كمية افتراضية'
                    },
                    {
                        id: 'maxLastVolume',
                        name: this.translate('أكبر حجم اّخر'),
                        field: 'maxLastVolume',
                        cssClass: 'maxLastVolume',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn
                    },
                    {
                        id: 'previousClose',
                        name: this.translate('الاغلاق السابق'),
                        field: 'previousClose',
                        cssClass: 'previousClose',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.LastValueColumn,
                        mobileName: 'إغلاق السابق'
                    },
                    {
                        id: 'phigh',
                        name: this.translate('الأعلى السابق'),
                        field: 'phigh',
                        cssClass: 'phigh',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.LastValueColumn,
                        mobileName: 'أعلى السابق'
                    },
                    {
                        id: 'plow',
                        name: this.translate('الأدنى السابق'),
                        field: 'plow',
                        cssClass: 'plow',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.LastValueColumn,
                        mobileName: 'أدنى السابق'
                    },
                    {
                        id: 'liquidityFlow',
                        name: this.translate('تدفق السيولة'),
                        field: 'liquidityFlow',
                        cssClass: 'liquidityFlow',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.LiquidityColumn,
                        mobileName:'تدفق سيولة'
                    },
                    {
                        id: 'liquidityNet',
                        name: this.translate('صافي السيولة'),
                        field: 'liquidityNet',
                        cssClass: 'liquidityNet',
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        width: 120,
                        sortable: true,
                        category: MarketWatchCategoryType.LiquidityColumn,
                        mobileName:'صافي سيولة'
                    },
                    {
                        id: 'liquidityInflowPercent',
                        name: this.translate('نسبة السيولة'),
                        field: 'liquidityInflowPercent',
                        cssClass: 'liquidityInflowPercent',
                        formatterTypes: [SlickGridFormatter.LiquidityBar],
                        sortable: true,
                        category: MarketWatchCategoryType.LiquidityColumn,
                        mobileName:'نسبة سيولة'
                    },

                    {
                        id: 'liquidityInflowOrders',
                        name: this.translate('أوامر السيولة الداخلة'),
                        field: 'liquidityInflowOrders',
                        cssClass: 'liquidityInflowOrders',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.LiquidityColumn,
                        mobileName: 'أوامر سيولة د'
                    },
                    {
                        id: 'liquidityOutflowOrders',
                        name: this.translate('أوامر السيولة الخارجة'),
                        field: 'liquidityOutflowOrders',
                        cssClass: 'liquidityOutflowOrders',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.LiquidityColumn,
                        mobileName: 'أوامر سيولة خ'
                    },
                    {
                        id: 'liquidityInflowVolume',
                        name: this.translate('حجم السيولة الداخلة'),
                        field: 'liquidityInflowVolume',
                        cssClass: 'liquidityInflowVolume',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.LiquidityColumn,
                        mobileName: 'حجم سيولة د'
                    },
                    {
                        id: 'liquidityOutflowVolume',
                        name: this.translate('حجم السيولة الخارجة'),
                        field: 'liquidityOutflowVolume',
                        cssClass: 'liquidityOutflowVolume',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.LiquidityColumn,
                        mobileName: 'حجم سيولة خ'
                    },
                    {
                        id: 'liquidityInflowValue',
                        name: this.translate('قيمة السيولة الداخلة'),
                        field: 'liquidityInflowValue',
                        cssClass: 'liquidityInflowValue',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.LiquidityColumn,
                        mobileName: 'قيمة سيولة د'
                    },
                    {
                        id: 'liquidityOutflowValue',
                        name: this.translate('قيمة السيولة الخارجة'),
                        field: 'liquidityOutflowValue',
                        cssClass: 'liquidityOutflowValue',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.LiquidityColumn,
                        mobileName: 'قيمة سيولة خ'
                    },
                    {
                        id: 'pivot',
                        name: this.translate('الارتكاز'),
                        field: 'pivot',
                        cssClass: 'pivot',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },
                    {
                        id: 'support1',
                        name: this.translate('الدعم 1'),
                        field: 'support1',
                        cssClass: 'support1',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width:100,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },
                    {
                        id: 'support2',
                        name: this.translate('الدعم 2'),
                        field: 'support2',
                        cssClass: 'support2',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width:100,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },

                    {
                        id: 'support3',
                        name: this.translate('الدعم 3'),
                        field: 'support3',
                        cssClass: 'support3',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width:100,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },

                    {
                        id: 'support4',
                        name: this.translate('الدعم 4'),
                        field: 'support4',
                        cssClass: 'support4',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width:100,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },
                    {
                        id: 'resistance1',
                        name: this.translate('المقاومة 1'),
                        field: 'resistance1',
                        cssClass: 'resistance1',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width:100,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },
                    {
                        id: 'resistance2',
                        name: this.translate('المقاومة 2'),
                        field: 'resistance2',
                        cssClass: 'resistance2',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width:100,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },

                    {
                        id: 'resistance3',
                        name: this.translate('المقاومة 3'),
                        field: 'resistance3',
                        cssClass: 'resistance3',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width:100,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },

                    {
                        id: 'resistance4',
                        name: this.translate('المقاومة 4'),
                        field: 'resistance4',
                        cssClass: 'resistance4',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width:100,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },
                    {
                        id: 'range',
                        name: this.translate('المدى'),
                        field: 'range',
                        cssClass: 'range',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        category: MarketWatchCategoryType.SupportAndResistanceColumn
                    },
                    {
                        id: 'issuedshares',
                        name: this.translate('الأسهم المصدرة'),
                        field: 'issuedshares',
                        cssClass: 'issuedshares',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width:150,
                        category: MarketWatchCategoryType.FinancialInformationColumn
                    },
                    {
                        id: 'freeshares',
                        name: this.translate('الأسهم الحرة'),
                        field: 'freeshares',
                        cssClass: 'freeshares',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width:150,
                        category: MarketWatchCategoryType.FinancialInformationColumn
                    },
                    {
                        id: 'parvalue',
                        name: this.translate('القيمة الإسمية'),
                        field: 'parvalue',
                        cssClass: 'parvalue',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        width:150,
                        category: MarketWatchCategoryType.FinancialInformationColumn
                    },
                    {
                        id: 'week52High',
                        name: this.translate('الأعلى سنويا'),
                        field: 'week52High',
                        cssClass: 'week52High',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.HistoricalHighAndLowColumn,
                        mobileName: 'أعلى سنوي'
                    },
                    {
                        id: 'week52Low',
                        name: this.translate('الأدنى سنويا'),
                        field: 'week52Low',
                        cssClass: 'week52Low',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        category: MarketWatchCategoryType.HistoricalHighAndLowColumn,
                        mobileName: 'أدنى سنوي'
                    },
                    {
                        id: 'fairPrice',
                        name: this.translate('قيمة الحق الإرشادية'),
                        field: 'fairPrice',
                        cssClass: 'fairPrice',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        category: MarketWatchCategoryType.EssentialColumn,
                        mobileName: 'قيمة الحق الإرشادية'
                    },
                    {
                        id: 'priceInIndex',
                        name: this.translate('السعر المعتمد في المؤشر'),
                        field: 'priceInIndex',
                        cssClass: 'priceInIndex',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.IndexCalculationData,
                        mobileName: 'السعر في المؤشر'
                    },
                    {
                        id: 'changeInIndex',
                        name: this.translate('التغير المعتمد في المؤشر'),
                        field: 'changeInIndex',
                        cssClass: 'changeInIndex',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.IndexCalculationData,
                        mobileName: 'التغير في المؤشر'
                    },
                    {
                        id: 'weightInIndex',
                        name: this.translate('الوزن في المؤشر'),
                        field: 'weightInIndex',
                        cssClass: 'weightInIndex',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.IndexCalculationData
                    },
                    {
                        id: 'weightInSector',
                        name: this.translate('الوزن في القطاع'),
                        field: 'weightInSector',
                        cssClass: 'weightInSector',
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.IndexCalculationData
                    },
                    {
                        id: 'effectOnIndex',
                        name: this.translate('التأثير على المؤشر (بالنقاط)'),
                        field: 'effectOnIndex',
                        cssClass: 'effectOnIndex',
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        sortable: true,
                        category: MarketWatchCategoryType.IndexCalculationData,
                        mobileName: 'التأثير على المؤشر'
                    },
                    {
                        id: 'effectOnSector',
                        name: this.translate('التأثير على القطاع'),
                        field: 'effectOnSector',
                        cssClass: 'effectOnSector',
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        sortable: true,
                        width: 120,
                        category: MarketWatchCategoryType.IndexCalculationData,
                        mobileName: 'التأثير على القطاع'
                    },
                    {
                        id: 'openingValue',
                        name: this.translate('قيمة الإفتتاح'),
                        field: 'openingValue',
                        cssClass: 'openingValue',
                        sortable: true,
                        width:100,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        category: MarketWatchCategoryType.OpeningAndClosingAuction
                    },
                    {
                        id: 'openingVolume',
                        name: this.translate('حجم الإفتتاح'),
                        field: 'openingVolume',
                        cssClass: 'openingVolume',
                        sortable: true,
                        width:100,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        category: MarketWatchCategoryType.OpeningAndClosingAuction
                    },
                    {
                        id: 'openingTrades',
                        name: this.translate('صفقات الإفتتاح'),
                        field: 'openingTrades',
                        cssClass: 'openingTrades',
                        sortable: true,
                        width:100,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        category: MarketWatchCategoryType.OpeningAndClosingAuction
                    },
                    {
                        id: 'valueOnClosingPrice',
                        name: this.translate('قيمة التداول على سعر الإغلاق'),
                        field: 'valueOnClosingPrice',
                        cssClass: 'valueOnClosingPrice',
                        sortable: true,
                        width:100,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        category: MarketWatchCategoryType.OpeningAndClosingAuction,
                        mobileName: 'قيمة على سعر الإغلاق'
                    },
                    {
                        id: 'volumeOnClosingPrice',
                        name: this.translate('حجم التداول على سعر الإغلاق'),
                        field: 'volumeOnClosingPrice',
                        cssClass: 'volumeOnClosingPrice',
                        sortable: true,
                        width:100,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        category: MarketWatchCategoryType.OpeningAndClosingAuction,
                        mobileName: 'حجم على سعر الإغلاق'
                    },
                    {
                        id: 'tradesOnClosingPrice',
                        name: this.translate('صققات التداول على سعر الإغلاق'),
                        field: 'tradesOnClosingPrice',
                        cssClass: 'tradesOnClosingPrice',
                        sortable: true,
                        width:100,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        category: MarketWatchCategoryType.OpeningAndClosingAuction,
                        mobileName: 'صققات على سعر الإغلاق'
                    },
                    {
                        id: 'marketalerts',
                        name: this.translate('راصد السوق'),
                        field: 'marketalerts',
                        cssClass: 'marketalerts name',
                        sortable: true,
                        sortType: 'field',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        width: 250,
                        formatterTypes:[SlickGridFormatter.MarketwatchMarketAlerts],
                        category: MarketWatchCategoryType.SignalsScope
                    },
                    {
                        id: 'technicalscope',
                        name: this.translate('راصد الإشارات الفنية'),
                        field: 'technicalscope',
                        cssClass: 'technicalscope name',
                        sortable: true,
                        sortType: 'field',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        width: 300,
                        formatterTypes:[SlickGridFormatter.MarketwatchTechnicalScope],
                        category: MarketWatchCategoryType.SignalsScope
                    },
                ];
                break;
            case GridBoxType.MarketTrades:
                columnsDefinition = [
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        cssClass: 'name',
                        width: 160
                    },
                    {
                        id: 'time',
                        name: this.translate('الوقت'),
                        field: 'time',
                        cssClass: 'time'
                    },
                    {
                        id: 'volume',
                        name: this.translate('حجم آخر'),
                        field: 'volume',
                        cssClass: 'volume highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'price highlight-column',
                        formatterTypes: [SlickGridFormatter.NegativePositiveByState]
                    },
                    {
                        id: 'contarcts',
                        name: this.translate('العدد'),
                        field: 'contracts',
                        cssClass: 'contracts',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 45
                    },
                    {
                        id: 'direction',
                        name: this.translate('الاتجاه'),
                        field: 'direction',
                        cssClass: 'direction',
                        formatterTypes: [SlickGridFormatter.Direction],
                        width: 45
                    },
                    {
                        id: 'amount',
                        name: this.translate('القيمة'),
                        field: 'amount',
                        cssClass: 'amount',
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'symbol',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed]
                    },
                    {
                        id: 'state',
                        name: this.translate('النوع'),
                        field: 'state',
                        cssClass: 'state',
                        formatterTypes: [SlickGridFormatter.TimeAndSaleState]
                    },
                ];
                break;
            case GridBoxType.MarketPreOpen:
                columnsDefinition = [
                    {
                        id: 'balloon',
                        name: '',
                        field: 'balloon',
                        cssClass: 'fixed-column balloon',
                        formatterTypes: [SlickGridFormatter.MarketPreOpenAnalysis],
                        width: 30,
                        resizable: false,
                        sortable: true,
                        sortType: 'string',
                        excludeInProperties: true
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'symbol',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        sortable: true,
                        width: 60,
                        sortType: 'string'
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'name',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        width: 190,
                        mobileWidth: 170,
                        sortable: true,
                        sortType: 'string'
                    },
                    {
                        id: 'preOpenPrice',
                        name: this.translate('السعر الافتراضي'),
                        field: 'preOpenPrice',
                        cssClass: 'price',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width:100,
                        sortable: true
                    },
                    {
                        id: 'preOpenVolume',
                        name: this.translate('الكمية الافتراضية'),
                        field: 'preOpenVolume',
                        cssClass: 'volume',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width:100,
                        sortable: true
                    },
                    {
                        id: 'askPrice',
                        name: this.translate('العرض'),
                        field: 'askPrice',
                        cssClass: 'askPrice red-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true
                    },
                    {
                        id: 'askVolume',
                        name: this.translate('حجم أفضل عرض'),
                        field: 'askVolume',
                        cssClass: 'askVolume red-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'bidPrice',
                        name: this.translate('الطلب'),
                        field: 'bidPrice',
                        cssClass: 'bidPrice green-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                    },
                    {
                        id: 'bidVolume',
                        name: this.translate('حجم أفضل طلب'),
                        field: 'bidVolume',
                        cssClass: 'bidVolume green-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        sortable: true,
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'preOpenChange',
                        name: this.translate('التغيير'),
                        field: 'preOpenChange',
                        cssClass: 'change',
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        sortable: true,
                    },
                    {
                        id: 'preOpenChangePercentage',
                        name: this.translate('التغيير %'),
                        field: 'preOpenChangePercentage',
                        cssClass: 'changePercent',
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        sortable: true,
                    },
                    {
                        id: 'effectIndex',
                        name: this.translate('التأثير على المؤشر (بالنقاط)'),
                        field: 'effectIndex',
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        width: 120,
                        sortable: true,
                    },
                    {
                        id: 'effectSector',
                        name: this.translate('التأثير على القطاع'),
                        field: 'effectSector',
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        width: 120,
                        sortable: true,
                    },
                    {
                        id: 'openingValue',
                        name: this.translate('قيمة الإفتتاح'),
                        field: 'openingValue' ,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        sortable: true,

                    },
                    {
                        id: 'openingVolume',
                        name: this.translate('حجم الإفتتاح'),
                        field: 'openingVolume',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        sortable: true,

                    },
                    {
                        id: 'openingTrades',
                        name: this.translate('صفقات الإفتتاح'),
                        field: 'openingTrades',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        sortable: true,

                    },
                    {
                        id: 'valueOnClosingPrice',
                        name: this.translate('قيمة التداول على سعر الإغلاق'),
                        field: 'valueOnClosingPrice',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        sortable: true,
                    },
                    {
                        id: 'volumeOnClosingPrice',
                        name: this.translate('حجم التداول على سعر الإغلاق'),
                        field: 'volumeOnClosingPrice',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        sortable: true,
                    },
                    {
                        id: 'tradesOnClosingPrice',
                        name: this.translate('صفقات التداول على سعر الإغلاق'),
                        field: 'tradesOnClosingPrice',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        sortable: true,
                    },
                ];
                break;
            case GridBoxType.MarketDepthByPrice:
                columnsDefinition = [
                    {
                        id: 'bidOrders',
                        field: 'bidOrders',
                        name: this.translate('العدد'),
                        formatterTypes: [SlickGridFormatter.NumberWhole, SlickGridFormatter.MarketDepthLevelColoring],
                        width: 45
                    },
                    {
                        id: 'bidQuantity',
                        field: 'bidQuantity',
                        name: this.translate('حجم الطلب'),
                        formatterTypes: [SlickGridFormatter.NumberWhole, SlickGridFormatter.MarketDepthPercentageBar, SlickGridFormatter.MarketDepthLevelColoring,]
                    },
                    {
                        id: 'bidPrice',
                        field: 'bidPrice',
                        name: this.translate('سعر الطلب'),
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits, SlickGridFormatter.MarketDepthLevelColoring]
                    },
                    {
                        id: 'askPrice',
                        field: 'askPrice',
                        name: this.translate('سعر العرض'),
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits, SlickGridFormatter.MarketDepthLevelColoring]
                    },
                    {
                        id: 'askQuantity',
                        field: 'askQuantity',
                        name: this.translate('حجم العرض'),
                        formatterTypes: [SlickGridFormatter.NumberWhole, SlickGridFormatter.MarketDepthPercentageBar, SlickGridFormatter.MarketDepthLevelColoring]
                    },
                    {
                        id: 'askOrders',
                        field: 'askOrders',
                        name: this.translate('العدد'),
                        formatterTypes: [SlickGridFormatter.NumberWhole, SlickGridFormatter.MarketDepthLevelColoring],
                        width: 45
                    }
                ];
                break;
            case GridBoxType.MarketDepthByOrder:
                columnsDefinition = [
                    {
                        id: 'bidQuantity',
                        field: 'bidQuantity',
                        name: this.translate('حجم الطلب'),
                        formatterTypes: [SlickGridFormatter.NumberWhole, SlickGridFormatter.MarketDepthPercentageBar, SlickGridFormatter.MarketDepthLevelColoring]
                    },
                    {
                        id: 'bidPrice',
                        field: 'bidPrice',
                        name: this.translate('سعر الطلب'),
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits, SlickGridFormatter.MarketDepthLevelColoring]
                    },
                    {
                        id: 'askPrice',
                        field: 'askPrice',
                        name: this.translate('سعر العرض'),
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits, SlickGridFormatter.MarketDepthLevelColoring]
                    },
                    {
                        id: 'askQuantity',
                        field: 'askQuantity',
                        name: this.translate('حجم العرض'),
                        formatterTypes: [SlickGridFormatter.NumberWhole, SlickGridFormatter.MarketDepthPercentageBar, SlickGridFormatter.MarketDepthLevelColoring]
                    },
                ];
                break;
            case GridBoxType.MarketAlerts:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'eye',
                        formatterTypes: [SlickGridFormatter.EyeFilter],
                        width: 16
                    },
                    {
                        id: 'time',
                        name: this.translate('الوقت'),
                        field: 'time',
                        cssClass: 'time',
                        mobileWidth: 60
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'symbol',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        mobileWidth: 40
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'name',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        width: 160,
                        mobileWidth: 120
                    },
                    {
                        id: 'message',
                        name: this.translate('الحدث'),
                        field: this.languageService.arabic ? 'messageArabic' : 'messageEnglish',
                        cssClass: 'message',
                        width: 200,
                        mobileWidth: 200,
                        formatterTypes: [SlickGridFormatter.Circle]
                    },
                ];
                break;
            case GridBoxType.TechnicalScope:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'eye',
                        formatterTypes: [SlickGridFormatter.EyeFilter],
                        width: 16
                    },
                    {
                        id: 'time',
                        name: this.translate('الوقت'),
                        field: 'time',
                        cssClass: 'time',
                        width: 60
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'symbol',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        width: 60
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'name',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        width: 110
                    },
                    {
                        id: 'signal',
                        name: this.translate('الإشارة الفنية'),
                        field: this.languageService.arabic ? 'arabicMessage': 'englishMessage',
                        cssClass: 'signal',
                        formatterTypes: [SlickGridFormatter.Circle],
                        width: 230,
                        mobileWidth: 300
                    },
                ];
                break;
            case GridBoxType.MarketMovers:
                columnsDefinition = [
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'symbol',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        mobileWidth: 80 ,
                        hadAnnotation:true
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'name',
                        mobileWidth: 100,
                        width:150,
                        sortable: true,
                        sortType: 'string',
                    },
                    {
                        id: 'close',
                        name: this.translate('الإغلاق'),
                        field: 'close',
                        cssClass: 'close-column highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        mobileWidth:80
                    },
                    {
                        id: 'change',
                        name: this.translate('التغير'),
                        field: 'change',
                        cssClass: 'change',
                        formatterTypes: [SlickGridFormatter.ChangeDigit],
                        sortable: true,
                        mobileWidth:80
                    },
                    {
                        id: 'changePercent',
                        name: this.translate('التغير %'),
                        field: 'changePercent',
                        cssClass: 'changePercent',
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        sortable: true,
                        mobileWidth:80
                    },
                    {
                        id: 'volume',
                        name: this.translate('الحجم'),
                        field: 'volume',
                        cssClass: 'volume highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        mobileWidth: 80,
                    },
                    {
                        id: 'amount',
                        name: this.translate('القيمة'),
                        field: 'amount',
                        cssClass: 'amount',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        mobileWidth: 80,
                    },
                    {   id: 'trades',
                        name: this.translate('الصفقات'),
                        field: 'trades',
                        mobileWidth: 80,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                    },
                ];
                break;
            case GridBoxType.DerayahWallet:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        formatterTypes: [SlickGridFormatter.DerayahWalletEdit]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 120
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 60
                    },
                    {
                        id: 'freeQuantity',
                        name: this.translate('ك.المتوفرة'),
                        field: 'freeQuantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'cost',
                        name: this.translate('معدل التكلفة'),
                        field: 'cost',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 80
                    },
                    {
                        id: 'currentPrice',
                        name: this.translate('السعر الحالي'),
                        field: 'currentPrice',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 80
                    },
                    {
                        id: 'totalCost',
                        name: this.translate('التكلفة'),
                        field: 'totalCost',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 80
                    },
                    {
                        id: 'currentTotalCost',
                        name: this.translate('القيمة الحالية'),
                        field: 'currentTotalCost',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 80
                    },
                    {
                        id: 'costDiff',
                        name: this.translate('ربح / خسارة'),
                        field: 'costDiff',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.DerayahWalletCostDiff],
                        width: 80
                    },
                    {
                        id: 'perCostDiff',
                        name: this.translate('ربح / خسارة %'),
                        field: 'perCostDiff',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.DerayahWalletCostDiff],
                        width: 80
                    }
                ];
                break;
            case GridBoxType.DerayahOrders:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        formatterTypes: [SlickGridFormatter.DerayahOrderActions]
                    },
                    {
                        id: 'date',
                        name: this.translate('التاريخ'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.DerayahOrderDate]
                    },
                    {
                        id: 'id',
                        name: this.translate('الرقم'),
                        field: 'id',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 80
                    },
                    {
                        id: 'type',
                        name: this.translate('العملية'),
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.DerayahOrderType],
                        width: 80
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'executedQuantity',
                        name: this.translate('ك.المنفذة'),
                        field: 'executedQuantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.DerayahOrderPrice],
                        width: 94
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.DerayahOrderStatus],
                        width: 90
                    }
                ];
                break;
            case GridBoxType.SnbcapitalWallet:
            case GridBoxType.AlrajhicapitalWallet:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.SnbcapitalWalletEdit]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80,
                        mobileWidth: 60
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150,
                        mobileWidth: 100
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'freeQuantity',
                        name: this.translate('ك.المتوفرة'),
                        field: 'freeQuantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'blockedQuantity',
                        name: this.translate('ك.المعلقة'),
                        field: 'blockedQuantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'cost',
                        name: this.translate('معدل التكلفة'),
                        field: 'cost',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'currentPrice',
                        name: this.translate('السعر الحالي'),
                        field: 'currentPrice',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'totalCost',
                        name: this.translate('التكلفة'),
                        field: 'totalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'currentTotalCost',
                        name: this.translate('القيمة الحالية'),
                        field: 'currentTotalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'costDiff',
                        name: this.translate('ربح / خسارة'),
                        field: 'costDiff',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.SnbcapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'costDiffPercent',
                        name: this.translate('الربح / الخسارة %' ),
                        field: 'costDiffPercent',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.SnbcapitalWalletCostDiff],
                        width: 100
                    },

                ];
                break;
            case GridBoxType.SnbcapitalOrders:
            case GridBoxType.SnbcapitalOrderSearch:
            case GridBoxType.AlrajhicapitalOrders:
            case GridBoxType.AlrajhicapitalOrderSearch:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.SnbcapitalOrderActions]
                    },
                    {
                        id: 'id',
                        name: this.translate('الرقم'),
                        field: 'id',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 120
                    },
                    {
                        id: 'date',
                        name: this.translate('التاريخ'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "DD/MM/YYYY",
                        formatterTypes: [SlickGridFormatter.SnbcapitalOrderDate]
                    },
                    {
                        id: 'time',
                        name: this.translate('الوقت'),
                        field: 'time',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "HH:mm:ss",
                        formatterTypes: [SlickGridFormatter.SnbcapitalOrderTime]
                    },
                    {
                        id: 'type',
                        name: this.translate('العملية'),
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'field',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.SnbcapitalOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100

                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'executedQuantity',
                        name: this.translate('ك.المنفذة'),
                        field: 'executedQuantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'remainingQuantity',
                        name: this.translate('ك.المتبقية'),
                        field: 'remainingQuantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.SnbcapitalOrderPrice],
                        width: 80
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.SnbcapitalOrderStatus],
                        width: 120
                    }
                ];
                break;
            case GridBoxType.RiyadcapitalWallet:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletEdit]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80,
                        mobileWidth: 60
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150,
                        mobileWidth: 100
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'unsettledSell',
                        name: this.translate('بيع تحت التسوية'),
                        field: 'unsettledSell',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'portfolioName',
                        name: this.translate('المحفظة'),
                        field: 'portfolioName',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'cost',
                        name: this.translate('متوسط التكلفة'),
                        field: 'averageCostPrice',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'currentPrice',
                        name: this.translate('سعر السوق'),
                        field: 'currentPrice',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'totalCost',
                        name: this.translate('إجمالي التكلفة'),
                        field: 'totalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'currentTotalCost',
                        name: this.translate('القيمة السوقية '),// added spaces to make it unique in the translation file.
                        field: 'currentTotalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'costDiff',
                        name: this.translate(' الربح / الخسارة '), // added spaces to make it unique in the translation file.
                        field: 'costDiff',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'costDiffPercent',
                        name: this.translate('العائد' ),
                        field: 'costDiffPercent',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletCostDiff],
                        width: 100
                    },

                ];
                break;
            case GridBoxType.MusharakaWallet:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletEdit]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80,
                        mobileWidth: 60
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150,
                        mobileWidth: 100
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'freeQuantity',
                        name: this.translate('الكمية المتاحة'),
                        field: 'freeQuantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'avgCst',
                        name: this.translate('متوسط التكلفة'),
                        field: 'avgCst',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'currentPrice',
                        name: this.translate('السعر الحالي'),
                        field: 'currentPrice',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'totalCost',
                        name: this.translate('قيمة التكلفة'),
                        field: 'totalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'currentTotalCost',
                        name: this.translate('القيمة الحالية'),// added spaces to make it unique in the translation file.
                        field: 'currentTotalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'costDiff',
                        name: this.translate(' الربح / الخسارة '), // added spaces to make it unique in the translation file.
                        field: 'costDiff',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'costDiffPercent',
                        name: this.translate('الربح / الخسارة %'),
                        field: 'costDiffPercent',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'pendSell',
                        name: this.translate('انتظار البيع'),
                        field: 'pendSell',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'pendBuy',
                        name: this.translate('شراء معلق'),
                        field: 'pendBuy',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'averagePrice',
                        name: this.translate('متوسط السعر'),
                        field: 'averagePrice',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                ];
                break;
            case GridBoxType.BsfWallet:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletEdit]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80,
                        mobileWidth: 60
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150,
                        mobileWidth: 100
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'freeQuantity',
                        name: this.translate('الكمية المتاحة'),
                        field: 'freeQuantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'avgCst',
                        name: this.translate('متوسط التكلفة'),
                        field: 'avgCst',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'currentPrice',
                        name: this.translate('السعر الحالي'),
                        field: 'currentPrice',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'totalCost',
                        name: this.translate('قيمة التكلفة'),
                        field: 'totalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'currentTotalCost',
                        name: this.translate('القيمة الحالية'),// added spaces to make it unique in the translation file.
                        field: 'currentTotalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'costDiff',
                        name: this.translate(' الربح / الخسارة '), // added spaces to make it unique in the translation file.
                        field: 'costDiff',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'costDiffPercent',
                        name: this.translate('الربح / الخسارة %'),
                        field: 'costDiffPercent',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'pendSell',
                        name: this.translate('انتظار البيع'),
                        field: 'pendSell',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'pendBuy',
                        name: this.translate('شراء معلق'),
                        field: 'pendBuy',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'averagePrice',
                        name: this.translate('متوسط السعر'),
                        field: 'averagePrice',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                ];
                break;
            case GridBoxType.AlkhabeercapitalWallet:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletEdit]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80,
                        mobileWidth: 60
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150,
                        mobileWidth: 100
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'freeQuantity',
                        name: this.translate('الكمية المتاحة'),
                        field: 'freeQuantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'avgCst',
                        name: this.translate('متوسط التكلفة'),
                        field: 'avgCst',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'currentPrice',
                        name: this.translate('السعر الحالي'),
                        field: 'currentPrice',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'totalCost',
                        name: this.translate('قيمة التكلفة'),
                        field: 'totalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'currentTotalCost',
                        name: this.translate('القيمة الحالية'),// added spaces to make it unique in the translation file.
                        field: 'currentTotalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'costDiff',
                        name: this.translate(' الربح / الخسارة '), // added spaces to make it unique in the translation file.
                        field: 'costDiff',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'costDiffPercent',
                        name: this.translate('الربح / الخسارة %'),
                        field: 'costDiffPercent',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'pendSell',
                        name: this.translate('انتظار البيع'),
                        field: 'pendSell',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'pendBuy',
                        name: this.translate('شراء معلق'),
                        field: 'pendBuy',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'averagePrice',
                        name: this.translate('متوسط السعر'),
                        field: 'averagePrice',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                ];
                break;
            case GridBoxType.RiyadcapitalOrders:
            case GridBoxType.RiyadcapitalOrderSearch:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalOrderActions]
                    },
                    {
                        id: 'orderRefNo',
                        name: this.translate('رقم الأمر'),
                        field: 'orderRefNo',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 120
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ العملية'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "DD-MM-YYYY",
                        formatterTypes: [SlickGridFormatter.RiyadcapitalOrderDate]
                    },
                    {
                        id: 'time',
                        name: this.translate('الوقت'),
                        field: 'time',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "HH:mm:ss",
                        formatterTypes: [SlickGridFormatter.RiyadcapitalOrderTime]
                    },
                    {
                        id: 'type',
                        name: this.translate(' العملية'), // added space to make it unique in the translation file
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.RiyadcapitalOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150

                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'fillQuantity',
                        name: this.translate('الكمية المنفذة'),
                        field: 'fillQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.RiyadcapitalOrderPrice],
                        width: 80
                    },
                    {
                        id: 'avgPrice',
                        name: this.translate('متوسط السعر'),
                        field: 'avgPrice',
                        cssClass: 'fixed-column highlight-column',
                        sortable: true,
                        width: 80,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits]
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.RiyadcapitalOrderStatus],
                        width: 150
                    },
                    {
                        id: 'portfolioName',
                        name: this.translate('المحفظة'),
                        field: 'portfolioName',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100,
                        mobileWidth: 80
                    },
                ];
                break;
            case GridBoxType.MusharakaOrders:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.MusharakaOrderActions]
                    },
                    {
                        id: 'clientId',
                        name: this.translate('الرقم'),
                        field: 'clientId',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150
                    },
                    {
                        id: 'type',
                        name: this.translate(' العملية'), // added space to make it unique in the translation file
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.MusharakaOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.MusharakaOrderStatus],
                        width: 150
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150

                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'executedQuantity',
                        name: this.translate('الكمية المنفذة'),
                        field: 'executedQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.MusharakaOrderPrice],
                        width: 80
                    },
                    {
                        id: 'pendingQuantity',
                        name: this.translate('الكمية المعلقة'),
                        field: 'pendingQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ الأمر'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: "date",
                        dateFormat: "YYYY-MM-DD HH:mm:ss",
                        width: 150,
                        formatterTypes: [SlickGridFormatter.MusharakaOrderDateTime]
                    },
                    {
                        id: 'vatAmount',
                        name: this.translate('قيمة الضريبة المضافة'),
                        field: 'vatAmount',
                        cssClass: 'fixed-column highlight-column',
                        sortable: true,
                        width: 130,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                    },
                    {
                        id: 'totalCommission',
                        name: this.translate('العمولة'),
                        field: 'totalCommission',
                        cssClass: 'fixed-column highlight-column',
                        sortable: true,
                        width: 80,
                        formatterTypes: [SlickGridFormatter.Number2Digits]
                    },
                    {
                        id: 'expiryDate',
                        name: this.translate('تاريخ انتهاء الصلاحية'),
                        field: 'expiryDate',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "YYYY-MM-DD",
                        width: 120,
                        formatterTypes: [SlickGridFormatter.MusharakaOrderDate]
                    },
                    {
                        id: 'portfolioName',
                        name: this.translate('المحفظة'),
                        field: 'portfolioName',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'discloseQuantity',
                        name: this.translate('الكمية المعلنة'),
                        field: 'discloseQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'expiration',
                        name: this.translate('ساري حتى') ,
                        field: 'expiration',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'field',
                        sortField: this.languageService.arabic ? "arabic": "english",
                        formatterTypes: [SlickGridFormatter.MusharakaExpirationType],
                        width: 150,
                        mobileWidth: 90
                    },
                ];
                break;
            case GridBoxType.MusharakaOrderSearch:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.MusharakaOrderActions]
                    },
                    {
                        id: 'clientId',
                        name: this.translate('الرقم'),
                        field: 'clientId',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ الأمر'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "YYYY-MM-DD",
                        formatterTypes: [SlickGridFormatter.MusharakaOrderDate]
                    },
                    {
                        id: 'type',
                        name: this.translate(' العملية'), // added space to make it unique in the translation file
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.MusharakaOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150

                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'executedQuantity',
                        name: this.translate('الكمية المنفذة'),
                        field: 'executedQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.MusharakaOrderPrice],
                        width: 80
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.MusharakaOrderStatus],
                        width: 150
                    }
                ];
                break;

            case GridBoxType.BsfOrders:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.BsfOrderActions]
                    },
                    {
                        id: 'clientId',
                        name: this.translate('الرقم'),
                        field: 'clientId',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150
                    },
                    {
                        id: 'type',
                        name: this.translate(' العملية'), // added space to make it unique in the translation file
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.BsfOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.BsfOrderStatus],
                        width: 150
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150

                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'executedQuantity',
                        name: this.translate('الكمية المنفذة'),
                        field: 'executedQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.BsfOrderPrice],
                        width: 80
                    },
                    {
                        id: 'pendingQuantity',
                        name: this.translate('الكمية المعلقة'),
                        field: 'pendingQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ الأمر'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: "date",
                        dateFormat: "YYYY-MM-DD HH:mm:ss",
                        width: 150,
                        formatterTypes: [SlickGridFormatter.BsfOrderDateTime]
                    },
                    {
                        id: 'vatAmount',
                        name: this.translate('قيمة الضريبة المضافة'),
                        field: 'vatAmount',
                        cssClass: 'fixed-column highlight-column',
                        sortable: true,
                        width: 130,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                    },
                    {
                        id: 'totalCommission',
                        name: this.translate('العمولة'),
                        field: 'totalCommission',
                        cssClass: 'fixed-column highlight-column',
                        sortable: true,
                        width: 80,
                        formatterTypes: [SlickGridFormatter.Number2Digits]
                    },
                    {
                        id: 'expiryDate',
                        name: this.translate('تاريخ انتهاء الصلاحية'),
                        field: 'expiryDate',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "YYYY-MM-DD",
                        width: 120,
                        formatterTypes: [SlickGridFormatter.BsfOrderDate]
                    },
                    {
                        id: 'portfolioName',
                        name: this.translate('المحفظة'),
                        field: 'portfolioName',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'discloseQuantity',
                        name: this.translate('الكمية المعلنة'),
                        field: 'discloseQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'expiration',
                        name: this.translate('ساري حتى') ,
                        field: 'expiration',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'field',
                        sortField: this.languageService.arabic ? "arabic": "english",
                        formatterTypes: [SlickGridFormatter.BsfExpirationType],
                        width: 150,
                        mobileWidth: 90
                    },
                ];
                break;
            case GridBoxType.BsfOrderSearch:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.BsfOrderActions]
                    },
                    {
                        id: 'clientId',
                        name: this.translate('الرقم'),
                        field: 'clientId',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ الأمر'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "YYYY-MM-DD",
                        formatterTypes: [SlickGridFormatter.BsfOrderDate]
                    },
                    {
                        id: 'type',
                        name: this.translate(' العملية'), // added space to make it unique in the translation file
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.BsfOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150

                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'executedQuantity',
                        name: this.translate('الكمية المنفذة'),
                        field: 'executedQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.BsfOrderPrice],
                        width: 80
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.BsfOrderStatus],
                        width: 150
                    }
                ];
                break;

            case GridBoxType.AlkhabeercapitalOrders:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderActions]
                    },
                    {
                        id: 'clientId',
                        name: this.translate('الرقم'),
                        field: 'clientId',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150
                    },
                    {
                        id: 'type',
                        name: this.translate(' العملية'), // added space to make it unique in the translation file
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderStatus],
                        width: 150
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150

                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'executedQuantity',
                        name: this.translate('الكمية المنفذة'),
                        field: 'executedQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderPrice],
                        width: 80
                    },
                    {
                        id: 'pendingQuantity',
                        name: this.translate('الكمية المعلقة'),
                        field: 'pendingQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ الأمر'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: "date",
                        dateFormat: "YYYY-MM-DD HH:mm:ss",
                        width: 150,
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderDateTime]
                    },
                    {
                        id: 'vatAmount',
                        name: this.translate('قيمة الضريبة المضافة'),
                        field: 'vatAmount',
                        cssClass: 'fixed-column highlight-column',
                        sortable: true,
                        width: 130,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                    },
                    {
                        id: 'totalCommission',
                        name: this.translate('العمولة'),
                        field: 'totalCommission',
                        cssClass: 'fixed-column highlight-column',
                        sortable: true,
                        width: 80,
                        formatterTypes: [SlickGridFormatter.Number2Digits]
                    },
                    {
                        id: 'expiryDate',
                        name: this.translate('تاريخ انتهاء الصلاحية'),
                        field: 'expiryDate',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "YYYY-MM-DD",
                        width: 120,
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderDate]
                    },
                    {
                        id: 'portfolioName',
                        name: this.translate('المحفظة'),
                        field: 'portfolioName',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'discloseQuantity',
                        name: this.translate('الكمية المعلنة'),
                        field: 'discloseQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'expiration',
                        name: this.translate('ساري حتى') ,
                        field: 'expiration',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'field',
                        sortField: this.languageService.arabic ? "arabic": "english",
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalExpirationType],
                        width: 150,
                        mobileWidth: 90
                    },
                ];
                break;
            case GridBoxType.AlkhabeercapitalOrderSearch:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderActions]
                    },
                    {
                        id: 'clientId',
                        name: this.translate('الرقم'),
                        field: 'clientId',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ الأمر'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "YYYY-MM-DD",
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderDate]
                    },
                    {
                        id: 'type',
                        name: this.translate(' العملية'), // added space to make it unique in the translation file
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150

                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'executedQuantity',
                        name: this.translate('الكمية المنفذة'),
                        field: 'executedQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderPrice],
                        width: 80
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.AlkhabeercapitalOrderStatus],
                        width: 150
                    }
                ];
                break;

            case GridBoxType.AljaziracapitalWallet:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.AljaziracapitalWalletEdit]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80,
                        mobileWidth: 60
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150,
                        mobileWidth: 100
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'freeQuantity',
                        name: this.translate('الكمية المتاحة'),
                        field: 'freeQuantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 60
                    },
                    {
                        id: 'avgCost',
                        name: this.translate('متوسط التكلفة'),
                        field: 'avgCost',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'totalCost',
                        name: this.translate('تكلفة الشراء'),
                        field: 'totalCost',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'currentPrice',
                        name: this.translate('سعر السوق'),
                        field: 'currentPrice',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'currentTotalCost',
                        name: this.translate('القيمة السوقية '),// added spaces to make it unique in the translation file.
                        field: 'currentTotalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.AljaziracapitalCurrentTotalCost],
                        width: 100
                    },
                    {
                        id: 'costDiff',
                        name: this.translate(' ربح / خسارة '), // added spaces to make it unique in the translation file.
                        field: 'costDiff',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.AljaziracapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'costDiffPercent',
                        name: this.translate('العائد' ),
                        field: 'costDiffPercent',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.AljaziracapitalWalletCostDiff],
                        width: 100
                    },
                    {
                        id: 'portfolioId',
                        name: this.translate('المحفظة'),
                        field: 'portfolioId',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100,
                        mobileWidth: 80
                    },
                ];
                break;
            case GridBoxType.AljaziracapitalOrders:
            case GridBoxType.AljaziracapitalOrderSearch:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.AljaziracapitalOrderActions]
                    },
                    {
                        id: 'type',
                        name: this.translate('النوع'), // added space to make it unique in the translation file
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.AljaziracapitalOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.AljaziracapitalOrderStatus],
                        width: 150
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150

                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.AljaziracapitalOrderPrice],
                        width: 80
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'pendingQuantity',
                        name: this.translate('الكمية المتبقية'),
                        field: 'pendingQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ العملية'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "DD-MM-YYYY",
                        formatterTypes: [SlickGridFormatter.AljaziracapitalOrderDate]
                    },
                    {
                        id: 'orderRefNo',
                        name: this.translate('رقم الأمر'),
                        field: 'orderRefNo',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 120
                    },
                    {
                        id: 'expiryDate',
                        name: this.translate('الصلاحية'),
                        field: 'expiryDate',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "DD-MM-YYYY",
                        formatterTypes: [SlickGridFormatter.AljaziracapitalOrderDate]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'portfolioId',
                        name: this.translate('المحفظة'),
                        field: 'portfolioId',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'reason',
                        name: this.translate('السبب'),
                        field: 'reason',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150
                    },
                ];
                break;


            case GridBoxType.AlinmainvestWallet:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.AlinmainvestWalletEdit]
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80,
                        mobileWidth: 60
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150,
                        mobileWidth: 100
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية المملوكة'),
                        field: 'quantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 85
                    },
                    {
                        id: 'bledgeQuantity',
                        name: this.translate('الكمية المرهونة'),
                        field: 'bledgeQuantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 150,
                        mobileWidth: 90
                    },
                    {
                        id: 'portfolioName',
                        name: this.translate('المحفظة'),
                        field: 'portfolioName',
                        cssClass: 'portfolio-name fixed-column center name',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150,
                        mobileWidth: 150
                    },
                    {
                        id: 'unSettledSellQuantity',
                        name: this.translate('كمية الشراء المستحقة'),
                        field: 'unSettledSellQuantity',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 150,
                        mobileWidth: 115
                    },
                    {
                        id: 'costValue',
                        name: this.translate('التكلفة'),
                        field: 'costValue',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'currentPrice',
                        name: this.translate('اّخر سعر'),
                        field: 'currentPrice',
                        cssClass: 'fixed-column center highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'currentTotalCost',
                        name: this.translate('القيمة السوقية '),// added spaces to make it unique in the translation file.
                        field: 'currentTotalCost',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100
                    },
                    {
                        id: 'costDiff',
                        name: this.translate(' الربح / الخسارة '), // added spaces to make it unique in the translation file.
                        field: 'costDiff',
                        cssClass: 'fixed-column center',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.AlinmainvestWalletCostDiff],
                        width: 100
                    },

                ];
                break;
            case GridBoxType.AlinmainvestOrders:
            case GridBoxType.AlinmainvestOrderSearch:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.AlinmainvestOrderActions]
                    },
                    {
                        id: 'orderRefNo',
                        name: this.translate('رقم الأمر'),
                        field: 'orderRefNo',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 120
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ العملية'),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "DD-MM-YYYY",
                        formatterTypes: [SlickGridFormatter.AlinmainvestOrderDate]
                    },
                    {
                        id: 'time',
                        name: this.translate('الوقت'),
                        field: 'time',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'date',
                        dateFormat: "HH:mm:ss",
                        formatterTypes: [SlickGridFormatter.AlinmainvestOrderTime]
                    },
                    {
                        id: 'type',
                        name: this.translate(' العملية'), // added space to make it unique in the translation file
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.AlinmainvestOrderType],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150

                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 80
                    },
                    {
                        id: 'fillQuantity',
                        name: this.translate('الكمية المنفذة'),
                        field: 'fillQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.AlinmainvestOrderPrice],
                        width: 80
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType:'string',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.AlinmainvestOrderStatus],
                        width: 150
                    },
                    {
                        id: 'portfolioName',
                        name: this.translate('المحفظة'),
                        field: 'portfolioName',
                        cssClass: 'portfolio-name fixed-column name',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 150,
                        mobileWidth: 150
                    },
                    {
                        id: 'discloseQuantity',
                        name: this.translate('الكمية المعلنة'),
                        field: 'discloseQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100
                    },
                    {
                        id: 'expiryDate',
                        name: this.translate('تاريخ الإنتهاء'),
                        field: 'expiryDate',
                        cssClass: 'fixed-column',
                        sortType:'date',
                        dateFormat: "DD-MM-YYYY",
                        formatterTypes: [SlickGridFormatter.AlinmainvestOrderDate]
                    },
                ];
                break;



            case GridBoxType.CompanyNews:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'details name',
                        formatterTypes: [SlickGridFormatter.CompanyNewsDetails],
                        width: 60,
                        resizable: false
                    },
                    {
                        id: 'date',
                        name: this.translate('التاريخ'),
                        field: 'date',
                        cssClass: 'date',
                        width: 90,
                        resizable: false
                    },
                    {
                        id: 'header',
                        name: this.translate('العنوان'),
                        field: 'header',
                        cssClass: 'header name',
                        width: 600
                    }
                ];
                break;
            case GridBoxType.ShareholdersList:
                columnsDefinition = [
                    {
                        id: 'name',
                        name: '',
                        field: 'name',
                        cssClass: 'name',
                        width: 225,
                        resizable: false,
                        sortable: true,
                        sortType: 'string'
                    },
                    {
                        id: 'count',
                        name: '',
                        field: 'count',
                        width: 100,
                        resizable: false,
                        sortable: true,
                    }
                ];
                break;
            case GridBoxType.BigTrades:
                columnsDefinition = [
                    {id: 'time', name: this.translate('الوقت'), field: 'time', cssClass: 'time', mobileWidth: 60},
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'name',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed],
                        width: 160,
                        mobileWidth: 120
                    },
                    {
                        id: 'volume',
                        name: this.translate('حجم آخر'),
                        field: 'volume',
                        cssClass: 'volume highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        mobileWidth: 75
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'price highlight-column',
                        formatterTypes: [SlickGridFormatter.NegativePositiveByState],
                        mobileWidth: 60
                    },
                    {
                        id: 'amount',
                        name: this.translate('القيمة'),
                        field: 'amount',
                        cssClass: 'amount',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        mobileWidth: 90
                    },
                    {
                        id: 'contracts',
                        name: this.translate('العدد'),
                        field: 'contracts',
                        cssClass: 'amount',
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        mobileWidth: 40
                    },
                    {
                        id: 'direction',
                        name: this.translate('الاتجاه'),
                        field: 'direction',
                        cssClass: 'direction',
                        formatterTypes: [SlickGridFormatter.Direction],
                        mobileWidth: 40
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'symbol',
                        formatterTypes: [SlickGridFormatter.AnnotationDelayed]
                    },
                    {
                        id: 'state',
                        name: this.translate('النوع'),
                        field: 'state',
                        cssClass: 'state',
                        formatterTypes: [SlickGridFormatter.TimeAndSaleState]
                    },
                ];
                break;
            case GridBoxType.VirtualTradingPositions:
                columnsDefinition = [
                    {
                        id: 'id',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        formatterTypes: [SlickGridFormatter.VirtualTradingPositionsEdit],
                        width: 60,
                        excludeInProperties: true
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Symbol],
                        sortType: "string",
                        width: 40
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: "string",
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 40
                    },
                    {
                        id: 'freeQuantity',
                        name: this.translate('ك.المتوفرة'),
                        field: 'freeQuantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 60
                    },
                    {
                        id: 'cost',
                        name: this.translate('معدل التكلفة'),
                        field: 'averagePrice',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits]
                    },
                    {
                        id: 'currentPrice',
                        name: this.translate('السعر الحالي'),
                        field: 'currentPrice',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits]
                    },
                    {
                        id: 'totalCost',
                        name: this.translate('التكلفة'),
                        field: 'totalCost',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits]
                    },
                    {
                        id: 'currentTotalCost',
                        name: this.translate('القيمة الحالية'),
                        field: 'currentTotalCost',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits]
                    },
                    {
                        id: 'costDiff',
                        name: this.translate('ربح / خسارة'),
                        field: 'costDiff',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.VirtualTradingPositionsCostDiff]
                    },


                ];
                break;

            case GridBoxType.VirtualTradingOrders:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        formatterTypes: [SlickGridFormatter.VirtualTradingOrderActions],
                        width: 80,
                        excludeInProperties: true
                    },
                    {
                        id: 'id',
                        name: this.translate('الرقم'),
                        field: 'id',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 50
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: "string",
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 50
                    },
                    {
                        id: 'name',
                        name: this.translate('الاسم'),
                        field: 'name',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: "string",
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'orderStatus',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: "field",
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.VirtualTradingOrderStatus],
                        width: 70
                    },
                    {
                        id: 'execution',
                        name: this.translate('التنفيذ'),
                        field: 'orderType',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: "field",
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.VirtualTradingOrderExecution],
                        width: 70
                    },
                    {
                        id: 'date',
                        name: this.translate('تاريخ الإنشاء'),
                        field: 'createdAt',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: "date",
                        dateFormat: "DD/MM/YY HH:mm:ss",
                        formatterTypes: [SlickGridFormatter.UnixDateTime],
                        width: 150
                    },
                    {
                        id: 'type',
                        name: this.translate('الجهة'),
                        field: 'orderSide',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: "field",
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.VirtualTradingOrderSide],
                        width: 40
                    },
                    {
                        id: 'market',
                        name: this.translate('السوق'),
                        field: 'market',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: "field",
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.Market],
                        width: 60
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 40
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.VirtualTradingOrderPrice],
                        width: 50
                    },
                    {
                        id: 'executionPrice',
                        name: this.translate('سعر التنفيذ'),
                        field: 'executionPrice',
                        cssClass: 'fixed-column text-right',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.VirtualTradingOrderExecutionPrice],
                        width: 60
                    },
                    {
                        id: 'executionTime',
                        name: this.translate('تاريخ التنفيذ'),
                        field: 'executionTime',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: "date",
                        dateFormat: "DD/MM/YY HH:mm:ss",
                        formatterTypes: [SlickGridFormatter.UnixDateTime],
                        width: 150
                    },
                ];
                break;
            case GridBoxType.TradesSummary:
                columnsDefinition =[
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'price highlight-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 75,

                    },
                    {   id: 'trades',
                        name: this.translate('الصفقات'),
                        field: 'trades',
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'buyTrades',
                        name: this.translate('صفقات الشراء'),
                        field: 'buyTrades',
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'sellTrades',
                        name: this.translate('صفقات البيع'),
                        field: 'sellTrades',
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'volume',
                        name: this.translate('الحجم'),
                        field: 'volume',
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'buyVolume',
                        name: this.translate('حجم الشراء'),
                        field: 'buyVolume',
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'sellVolume',
                        name: this.translate('حجم البيع'),
                        field: 'sellVolume',
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'value',
                        name: this.translate('القيمة'),
                        field: 'value',
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'buyValue',
                        field: 'buyValue',
                        name: this.translate('قيمة الشراء'),
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                    {
                        id: 'sellValue',
                        field: 'sellValue',
                        name: this.translate('قيمة البيع'),
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberWhole]
                    },
                ]
                break;
            case GridBoxType.TradestationOrders:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        excludeInProperties: true,
                        formatterTypes: [SlickGridFormatter.TradestationOrderActions],
                        width: 100,
                        mobileWidth: 75
                    },
                    {
                        id: 'id',
                        name: this.translate('رقم الطلب'),
                        field: 'id',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.None],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'companyName',
                        name: this.translate('الاسم'),
                        field: 'companyName',
                        cssClass: 'name',
                        formatterTypes: [SlickGridFormatter.None],
                        sortable: true,
                        sortType: 'string',
                        width: 190
                    },
                    {
                        id: 'side',
                        name: this.translate('جانب'),
                        field: 'side',
                        cssClass: 'name',
                        sortable: true,
                        sortType: 'field',
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes:[SlickGridFormatter.TradestationOrderSide],
                        width: 110
                    },
                    {
                        id: 'status',
                        name: this.translate('الحالة'),
                        field: 'status',
                        cssClass: 'name',
                        sortable: true,
                        sortType: "field",
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.TradestationOrderStatus],
                        width: 100,
                        mobileWidth: 55
                    },
                    {
                        id: 'price',
                        name: this.translate('السعر'),
                        field: 'price',
                        cssClass: 'close-column highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.TradestationOrderPrice],
                        width: 100,
                        mobileWidth: 75
                    },
                    {
                        id: 'stopPrice',
                        name: this.translate('وقف'),
                        field: 'stopPrice',
                        cssClass: 'close-column highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 70
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 70
                    },
                    {
                        id: 'executedQuantity',
                        name: this.translate('الكمية المنفذة'),
                        field: 'executedQuantity',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'leavesQuantity',
                        name: this.translate('الكمية المتبقية'),
                        field: 'leavesQuantity',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberWhole],
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'executedPrice',
                        name: this.translate('سعر التنفيذ'),
                        field: 'executedPrice',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 70
                    },
                    {
                        id: 'takeProfitPrice',
                        name: this.translate('جني الأرباح'),
                        field: 'takeProfitPrice',
                        cssClass: 'close-column highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.TradestationOrderProfitLoss],
                        width: 100,
                        mobileWidth: 70
                    },
                    {
                        id: 'stopLossPrice',
                        name: this.translate('وقف الخسارة'),
                        field: 'stopLossPrice',
                        cssClass: 'close-column highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.TradestationOrderProfitLoss],
                        width: 100,
                        mobileWidth: 70
                    },
                    {
                        id: 'expirationType',
                        name: this.translate('نوع الصلاحية') ,
                        field: 'expirationType',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'field',
                        sortField: this.languageService.arabic ? "arabic": "english",
                        formatterTypes: [SlickGridFormatter.TradestationExpirationType],
                        width: 150,
                        mobileWidth: 90
                    },
                    {
                        id: 'triggeredBy',
                        name: this.translate('سبب التفعيل'),
                        field: 'triggeredBy',
                        sortable: true,
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'timeStamp',
                        name: this.translate('التاريخ'),
                        field: 'timeStamp',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.TradestationOrderDate],
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'tillDate',
                        name: this.translate('صالح لتاريخ') ,
                        field: 'tillDate',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'string',
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'commission',
                        name: this.translate('العمولة'),
                        field: 'commission',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 80,
                        mobileWidth: 60
                    },
                    {
                        id: 'unbundledRouteFee',
                        name: this.translate('رسوم توجيه غير مجمعة'),
                        field: 'unbundledRouteFee',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 150,
                        mobileWidth: 120
                    },

                    {
                        id: 'routing',
                        name: this.translate('التوجيه'),
                        field: 'routing',
                        sortable: true,
                        sortType: 'string',
                        cssClass: 'routing',
                        formatterTypes: [SlickGridFormatter.TradestationOrderRouting],
                        width: 130,
                        mobileWidth: 100
                    },
                    {
                        id: 'groupName',
                        name: this.translate('اسم المجموعة'),
                        field: 'groupName',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 120
                    },
                    {
                        id: 'timeExecuted',
                        name: this.translate('وقت التنفيذ'),
                        field: 'timeExecuted',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.TradestationOrderDate],
                        width: 100,
                        mobileWidth:90
                    },
                    {
                        id: 'rejectReason',
                        name: this.translate('سبب الرفض'),
                        field: 'rejectReason',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.TradestationRejectedReason],
                        width: 190
                    },
                    {
                        id: 'accountId',
                        name: this.translate('رقم الحساب'),
                        field: 'accountId',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.None],
                        width: 140,
                        mobileWidth: 110
                    },

                ];
                break;
            case GridBoxType.TradestationPositions:
                columnsDefinition = [
                    {
                        id: 'actions',
                        name: '',
                        field: 'id',
                        cssClass: 'fixed-column name center',
                        sortable: false,
                        formatterTypes: [SlickGridFormatter.TradestationOrderActions],
                        excludeInProperties: true,
                        width: 80,
                        mobileWidth: 75
                    },
                    {
                        id: 'symbol',
                        name: this.translate('الرمز'),
                        field: 'symbol',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'string',
                        formatterTypes: [SlickGridFormatter.Symbol],
                        width: 80,
                        mobileWidth: 50
                    },
                    {
                        id: 'companyName',
                        name: this.translate('الإسم'),
                        field: 'companyName',
                        cssClass: 'fixed-column name',
                        formatterTypes: [SlickGridFormatter.None],
                        sortable: true,
                        sortType: 'string',
                        width: 190
                    },
                    {
                        id: 'type',
                        name: this.translate('النوع'),
                        field: 'type',
                        cssClass: 'fixed-column name',
                        sortable: true,
                        sortType: "field",
                        sortField: this.languageService.arabic ? "arabic" : "english",
                        formatterTypes: [SlickGridFormatter.TradestationOrderSide],
                        width: 120
                    },
                    {
                        id: 'id',
                        name: this.translate('الرقم'),
                        field: 'id',
                        cssClass: 'fixed-column ',
                        sortable: true,
                        width: 100,
                        mobileWidth: 80
                    },
                    {
                        id: 'quantity',
                        name: this.translate('الكمية'),
                        field: 'quantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.TradestationOrderQuantity],
                        width: 100,
                        mobileWidth: 70
                    },
                    {
                        id: 'averagePrice',
                        name: this.translate('متوسط السعر'),
                        field: 'averagePrice',
                        cssClass: 'fixed-column close-column highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'date',
                        name: this.translate('التاريخ' ),
                        field: 'date',
                        cssClass: 'fixed-column',
                        sortable: true,
                        sortType: 'string',
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'markToMarketPrice',
                        name: this.translate('متوسط السعر المرجح'),
                        field: 'markToMarketPrice',
                        cssClass: 'fixed-column close-column highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 125
                    },
                    {
                        id: 'lastPrice',
                        name: this.translate('اخر'),
                        field: 'lastPrice',
                        cssClass: 'fixed-column last highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 70
                    },
                    {
                        id: 'bidPrice',
                        name: this.translate('الطلب'),
                        field: 'bidPrice',
                        cssClass: 'fixed-column bidPrice green-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 70
                    },
                    {
                        id: 'askPrice',
                        name: this.translate('العرض'),
                        field: 'askPrice',
                        cssClass: 'fixed-column askPrice red-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 70
                    },
                    {
                        id: 'marketValue',
                        name: this.translate('القيمة السوقية'),
                        field: 'marketValue',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'totalCost',
                        name: this.translate('إجمالي التكلفة'),
                        field: 'totalCost',
                        cssClass: 'fixed-column lastVolume highlight-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.Number2Digits],
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'profitLoss',
                        name: this.translate('الربح / الخسارة'),
                        field: 'profitLoss',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        width: 100,
                        mobileWidth: 90
                    },
                    {
                        id: 'profitLossPercent',
                        name: this.translate('الربح / الخسارة %' ),
                        field: 'profitLossPercent',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        width: 120,
                        mobileWidth: 100
                    },
                    {
                        id: 'profitLossQuantity',
                        name: this.translate('كمية ربح / خسارة'),
                        field: 'profitLossQuantity',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes: [SlickGridFormatter.NegativePositive],
                        width: 100
                    },
                    {
                        id: 'todaysProfitLoss',
                        name: this.translate('الربح / خسارة اليوم'),
                        field: 'todaysProfitLoss',
                        cssClass: 'fixed-column',
                        sortable: true,
                        formatterTypes:  [SlickGridFormatter.NegativePositive],
                        width: 110
                    },
                    {
                        id: 'margin',
                        name: this.translate('الهامش ') ,
                        field: 'margin',
                        cssClass: 'fixed-column',
                        sortable: true,
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        mobileWidth: 60
                    },
                    {
                        id: 'maintenanceMargin',
                        name: this.translate('هامش الوقاية') ,
                        field: 'maintenanceMargin',
                        cssClass: 'fixed-column',
                        sortable: true,
                        width: 100,
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        mobileWidth: 80
                    },
                    {
                        id: 'accountId',
                        name: this.translate('رقم الحساب') ,
                        field: 'accountId',
                        cssClass: 'fixed-column',
                        sortable: true,
                        width: 100,
                    },
                ];
                break;
            case GridBoxType.IndexAnalysis:
                columnsDefinition = [
                    {
                        id: 'company',
                        name: this.translate('الشركة'),
                        field: 'name',
                        cssClass: 'name',
                        width: 120,
                        sortable: true,
                        sortType: 'string',
                        formatterTypes:[SlickGridFormatter.AnnotationDelayed],
                        mobileWidth:150
                    },
                    {
                        id: 'close',
                        name: this.translate('السعر'),
                        field: 'close',
                        cssClass: 'close-column',
                        formatterTypes: [SlickGridFormatter.NumberVariableDigits],
                        sortable: true,
                        mobileWidth:80
                    },
                    {
                        id: 'change',
                        name: this.translate('التغير'),
                        field: 'change',
                        cssClass: 'change',
                        formatterTypes: [SlickGridFormatter.ChangeDigit],
                        sortable: true,
                        mobileWidth:80
                    },
                    {
                        id: 'effectOnIndex',
                        name: this.translate('التأثير على المؤشر (بالنقاط)'),
                        field: 'effectOnIndex',
                        cssClass: 'effectOnIndex',
                        formatterTypes: [SlickGridFormatter.NegativePositive3Digits],
                        sortable: true,
                        mobileName: 'التأثير على المؤشر',
                        mobileWidth:120,
                        width:100
                    },
                    {
                        id: 'effectOnSector',
                        name: this.translate('التأثير على القطاع'),
                        field: 'effectOnSector',
                        cssClass: 'effectOnSector',
                        formatterTypes: [SlickGridFormatter.NegativePositive3Digits],
                        sortable: true,
                        mobileName: 'التأثير على القطاع',
                        mobileWidth:120,
                        width:100
                    }
                ];
                break;
            default:
                Tc.error("unknown grid box type: " + type);
        }

        return columnsDefinition;
    }

    private translate(arabic: string): string {
        return this.languageService.translate(arabic);
    }
}

export interface GridColumn {
    id: string;
    width?:number;
}

export interface ColumnDefinition extends Slick.Column<Slick.SlickData>{
    sortType?: string,
    dateFormat?: string,
    formatterTypes?: SlickGridFormatter[],
    excludeInProperties?: boolean,
    sortField?: string,
    sortField1?: string,
    sortField2?: string,
    mobileWidth?:number,
    mobileName?:string,
    category?: number,
    hadAnnotation?:boolean,
    isFreeForRegisteredUser?: boolean
}
