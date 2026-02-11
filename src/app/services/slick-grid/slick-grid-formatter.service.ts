import {Injectable} from '@angular/core';

import {
    GenericFormatters,
    MarketwatchFormatters,
    // MarketPreOpenFormatters,
    // MarketDepthFormatters,
    // CompanyNewsFormatters,
    // TimeAndSaleFormatters,
    // DerayahWalletFormatters,
    // DerayahOrdersFormatters,
    // SnbcapitalWalletFormatters,
    // SnbcapitalOrdersFormatters,
    // RiyadcapitalWalletFormatters,
    // RiyadcapitalOrdersFormatters,
    // AlinmainvestWalletFormatters,
    // AlinmainvestOrdersFormatters,
    // VirtualTradingPositionsFormatters,
    // VirtualTradingOrdersFormatters,
    Formatter,
    // TradestationOrdersFormatters, AljaziracapitalWalletFormatters, AljaziracapitalOrdersFormatters, FinancialDataFormatters
} from './formatters/index';

import {LanguageService, MiscStateService} from '../state/index';
import {ColumnDefinition} from './slick-grid-columns.service';
import {GridData} from '../../components/shared/slick-grid/slick-grid';
import {SlickGridFormatter} from './slick-grid-formatter-type';
import {AppModeAuthorizationService, AuthorizationService} from '../auhtorization';
// import {FinancialData} from '../data/financials';
// import {AppModeAuthorizationService, AuthorizationService} from '../auhtorization';
// import {MusharakaOrdersFormatters} from './formatters/musharaka-orders-formatters';
// import {BsfOrdersFormatters} from './formatters/bsf-orders-formatters';
// import {AlkhabeercapitalOrdersFormatters} from './formatters/alkhabeercapital-orders-formatters';

@Injectable()
export class SlickGridFormatterService {

    private genericFormatters: Formatter;
    private marketwatchFormatters: Formatter;
    private marketPreOpenFormatters: Formatter;
    private marketDepthFormatters: Formatter;
    private companyNewsFormatters: Formatter;
    private timeAndSaleFormatters: Formatter;
    private derayahWalletFormatters: Formatter;
    private derayahOrdersFormatters: Formatter;
    private snbcapitalWalletFormatters: Formatter;
    private snbcapitalOrdersFormatters: Formatter;
    private riyadcapitalWalletFormatters: Formatter;
    private riyadcapitalOrdersFormatters: Formatter;
    private alinmainvestWalletFormatters: Formatter;
    private alinmainvestOrdersFormatters: Formatter;
    private aljaziracapitalWalletFormatters: Formatter;
    private aljaziracapitalOrdersFormatters: Formatter;
    private virtualTradingPositionsFormatters: Formatter;
    private virtualTradingOrdersFormatters: Formatter;
    private tradestationOrdersFormatters: Formatter;
    private financialDataFormatters: Formatter;
    private musharakaOrdersFormatters: Formatter;
    private bsfOrdersFormatters: Formatter;
    private alkhabeercapitalOrdersFormatters: Formatter;

    private formatters: { [type: number]: Formatter } = {};

    constructor(private languageService: LanguageService, private miscStateService:MiscStateService, private appModeAuthorizationService: AppModeAuthorizationService, private authorizationService: AuthorizationService) {
        this.genericFormatters = this.register(new GenericFormatters(this.languageService, this.miscStateService, this.appModeAuthorizationService, this.authorizationService));
        this.marketwatchFormatters = this.register(new MarketwatchFormatters(this.languageService));
        // this.marketPreOpenFormatters = this.register(new MarketPreOpenFormatters(this.languageService));
        // this.marketDepthFormatters = this.register(new MarketDepthFormatters(this.languageService, this.miscStateService));
        // this.companyNewsFormatters = this.register(new CompanyNewsFormatters(this.languageService));
        // this.timeAndSaleFormatters = this.register(new TimeAndSaleFormatters(this.languageService));
        // this.derayahWalletFormatters = this.register(new DerayahWalletFormatters(this.languageService));
        // this.derayahOrdersFormatters = this.register(new DerayahOrdersFormatters(this.languageService));
        // this.snbcapitalWalletFormatters = this.register(new SnbcapitalWalletFormatters(this.languageService));
        // this.snbcapitalOrdersFormatters = this.register(new SnbcapitalOrdersFormatters(this.languageService));
        // this.riyadcapitalWalletFormatters = this.register(new RiyadcapitalWalletFormatters(this.languageService));
        // this.riyadcapitalOrdersFormatters = this.register(new RiyadcapitalOrdersFormatters(this.languageService));
        // this.alinmainvestWalletFormatters = this.register(new AlinmainvestWalletFormatters(this.languageService));
        // this.alinmainvestOrdersFormatters = this.register(new AlinmainvestOrdersFormatters(this.languageService));
        // this.aljaziracapitalWalletFormatters = this.register(new AljaziracapitalWalletFormatters(this.languageService));
        // this.aljaziracapitalOrdersFormatters = this.register(new AljaziracapitalOrdersFormatters(this.languageService));
        // this.virtualTradingPositionsFormatters = this.register(new VirtualTradingPositionsFormatters(this.languageService));
        // this.virtualTradingOrdersFormatters = this.register(new VirtualTradingOrdersFormatters(this.languageService));
        // this.tradestationOrdersFormatters = this.register(new TradestationOrdersFormatters(this.languageService));
        // this.financialDataFormatters = this.register(new FinancialDataFormatters(this.languageService));
        // this.musharakaOrdersFormatters = this.register(new MusharakaOrdersFormatters(this.languageService));
        // this.bsfOrdersFormatters = this.register(new BsfOrdersFormatters(this.languageService));
        // this.alkhabeercapitalOrdersFormatters = this.register(new AlkhabeercapitalOrdersFormatters(this.languageService));
    }

    private register(formatter: Formatter): Formatter {
        formatter.getFormattersTypes().forEach(type => {
            this.formatters[type] = formatter;
        });

        return formatter;
    }

    getFormatter(columnFormatters: SlickGridFormatter[]): Slick.Formatter<GridData> {

        return (row: number, cell: number, value: unknown, columnDef: ColumnDefinition, dataContext: GridData): string => {

            let isFreeColumn = columnDef.isFreeForRegisteredUser === true;
            if(!this.authorizationService.isSubscriber() && !isFreeColumn){
                return this.showUpgradeAnnotationFormatter();
            }

            let selectedFormatters = columnFormatters;

            if (dataContext.rowCustomFormatters) {
                // specific row can override column formatters by directly passing formatter
                selectedFormatters = dataContext.rowCustomFormatters;
            }

            selectedFormatters.forEach(formatter => {
                value = this.formatters[formatter].format(formatter, row, cell, value, columnDef, dataContext);
            });

            return value as string;

        }

    }

    private showUpgradeAnnotationFormatter(): string {
        return `<div class="upgrade-icon-wrapper"><div class="grid-tooltip upgrade-icon">!</div></div>`;
    }
}
