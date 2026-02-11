import {SlickGridFormatter} from '../slick-grid-formatter-type';
import {LanguageService, MiscStateService} from '../../state/index';
import {Formatter} from './formatter';
import {MarketUtils, StringUtils, Tc} from '../../../utils/index';
import {Market} from '../../loader/loader';
import {ColumnDefinition} from '../slick-grid-columns.service';
import {GridData} from '../../../components/shared/slick-grid/slick-grid';
import {TimeAndSale} from '../../data/time-and-sale';
import {MarketAlert} from '../../data/market-alert';
import {TechnicalScopeSignal} from '../../data/technical-scope/technical-scope-signal';
import {Quote} from '../../data/quote';
// import {FinancialData} from '../../data';
import {AppModeAuthorizationService, AuthorizationService} from '../../auhtorization';
// import {FinancialIndicatorRealTimeData} from '../../data/financials/financial-indicator-streamer.service';

export class GenericFormatters implements Formatter{

    constructor(private languageService:LanguageService, private miscStateService:MiscStateService, private appModeAuthorizationService: AppModeAuthorizationService, private authorizationService: AuthorizationService){}

    getFormattersTypes():SlickGridFormatter[]{
        return [
            SlickGridFormatter.None,
            SlickGridFormatter.Direction,
            SlickGridFormatter.NumberWhole,
            SlickGridFormatter.Number2Digits,
            SlickGridFormatter.Number3Digits,
            SlickGridFormatter.NumberVariableDigits,
            SlickGridFormatter.Percent,
            SlickGridFormatter.NegativePositive,
            SlickGridFormatter.NegativePositive3Digits,
            SlickGridFormatter.NegativePositiveByDirection,
            SlickGridFormatter.NegativePositiveByState,
            SlickGridFormatter.LiquidityBar,
            SlickGridFormatter.Symbol,
            SlickGridFormatter.DateTime,
            SlickGridFormatter.UnixDateTime,
            SlickGridFormatter.Market,
            SlickGridFormatter.ChangeDigit,
            SlickGridFormatter.Circle,
            SlickGridFormatter.EyeFilter,
            SlickGridFormatter.AnnotationDelayed,
            SlickGridFormatter.FlagAnnotation,
            SlickGridFormatter.balloonAnnotation
        ];
    }

    format(formatter:SlickGridFormatter, row:number, cell:number, value:unknown, columnDef:ColumnDefinition, dataContext:GridData): string{
        switch(formatter) {
            case SlickGridFormatter.None:
                return this.noFormatter(value);
            case SlickGridFormatter.Direction:
                return this.directionFormatter(value);
            case SlickGridFormatter.NumberWhole:
                return this.numberWholeFormatter(value);
            case SlickGridFormatter.Number2Digits:
                return this.number2DigitsFormatter(value);
            case SlickGridFormatter.Number3Digits:
                return this.number3DigitsFormatter(value);
            case SlickGridFormatter.NumberVariableDigits:
                return this.variableDigitsFormatter(value);
            case SlickGridFormatter.Percent:
                return this.percentFormatter(value);
            case SlickGridFormatter.NegativePositive:
                return this.negativePositiveFormatter(value);
            case SlickGridFormatter.NegativePositive3Digits :
                return this.negativePositive3DigitsFormatter(value);
            case SlickGridFormatter.NegativePositiveByDirection:
                return this.negativePositiveByDirectionFormatter(value, dataContext);
            case SlickGridFormatter.NegativePositiveByState:
                return this.negativePositiveByStateFormatter(value, dataContext);
            case SlickGridFormatter.LiquidityBar:
                return this.liquidityBarFormatter(value);
            case SlickGridFormatter.Symbol:
                return this.symbolFormatter(value);
            case SlickGridFormatter.DateTime:
                return this.dateTimeFormatter(value);
            case SlickGridFormatter.UnixDateTime:
                return this.unixDateTimeFormatter(value);
            case SlickGridFormatter.Market:
                return this.marketFormatter(value);
            case SlickGridFormatter.ChangeDigit:
                return this.ChangeDigitsFormatter(value);
            case SlickGridFormatter.Circle:
                return this.circleFormatter(value, dataContext);
            case SlickGridFormatter.EyeFilter:
                return this.eyeFilter();
            case SlickGridFormatter.AnnotationDelayed:
                return this.annotationDelayedFormatter(value, dataContext, columnDef);
            case SlickGridFormatter.FlagAnnotation:
                // return this.flagAnnotationFormatter(value, dataContext);
            case SlickGridFormatter.balloonAnnotation:
                return this.balloonAnnotationFormater(value)
        }

        Tc.error("fail to find formatter for " + formatter);
    }

    private noFormatter(value:unknown):string{
        return value as string;
    }

    private directionFormatter(value:unknown):string{
        let map:{[key:string]:string} = {"=": 'equal', '-': 'down', '+': 'up'};
        return `<div class="direction-icon ${map[value as string]}"></div>`;
    }

    private numberWholeFormatter(value:unknown):string{
        return StringUtils.formatWholeNumber(value as number);
    }

    private number2DigitsFormatter(value:unknown):string{
        return StringUtils.format2DigitsNumber(value as number);
    }

    private number3DigitsFormatter(value:unknown):string{
        return StringUtils.format3DigitsNumber(value as number);
    }

    private variableDigitsFormatter(value:unknown):string{
        return StringUtils.formatVariableDigitsNumber(value as number);
    }

    private percentFormatter(value:unknown):string{
        let formatted:string = StringUtils.format2DigitsNumber(value as number);
        if(formatted == '-'){ return formatted; }
        return  `${formatted} %`;
    }

    private negativePositiveFormatter(value:unknown):string {
        let formatted:string = StringUtils.format2DigitsNumber(value as number);
        return this.getNegativePositiveFormat(value , formatted)
    }

    private getNegativePositiveFormat(value:unknown , formatted:string) {
        if(value === 0) {
            return formatted; // no formatting for zero value
        }
        return (value as number) < 0 ? `<div class="negative">${formatted}</div>` : `<div class="positive">${formatted}</div>`;
    }

    private negativePositive3DigitsFormatter(value:unknown):string {
        let formatted:string = StringUtils.format3DigitsNumber(value as number);
        return this.getNegativePositiveFormat(value , formatted)
    }

    private ChangeDigitsFormatter(value:unknown):string {
        let formatted:string = StringUtils.formatVariableDigitsNumber(value as number);
        if(value === 0) {
            return formatted; // no formatting for zero value
        }
        return (value as number) < 0 ? `<div class="negative">${formatted}</div>` : `<div class="positive">${formatted}</div>`;
    }

    private negativePositiveByDirectionFormatter(value:unknown, dataContext:GridData):string {
        let timeAndSale = dataContext as TimeAndSale;
        Tc.assert(timeAndSale.direction != null, "direction is needed for formatting, but not exists");
        let formatted:string = StringUtils.format2DigitsNumber(value as number);
        let cssClass:string = '';
        if(timeAndSale.direction == '+'){
            cssClass = 'positive';
        }
        if(timeAndSale.direction == '-'){
            cssClass = 'negative';
        }
        return `<div class="${cssClass}">${formatted}</div>`;
    }

    private negativePositiveByStateFormatter(value:unknown, dataContext:GridData):string {
        let timeAndSale = dataContext as TimeAndSale;
        Tc.assert(timeAndSale.state != null, "state is needed for formatting, but not exists");
        let formatted:string = StringUtils.formatVariableDigitsNumber(value as number);
        let cssClass:string = '';
        if(timeAndSale.state == 'buy'){
            cssClass = 'positive';
        }
        if(timeAndSale.state == 'sell'){
            cssClass = 'negative';
        }
        return `<div class="${cssClass}">${formatted}</div>`;
    }

    private liquidityBarFormatter(value:unknown):string {
        let formatted:string = this.percentFormatter(value);

        let greenColor = this.miscStateService.isDarkTheme() ? '#008000' : '#6ee06e';
        let redColor = this.miscStateService.isDarkTheme() ? '#992900' : '#ffaaaa';

        let background:string = this.languageService.arabic ?
            `background: linear-gradient(to left, ${greenColor} 0%,${greenColor} ${value}%,${redColor} ${value}%,${redColor} 100%);` :
            `background: linear-gradient(to right, ${greenColor} 0%,${greenColor} ${value}%,${redColor} ${value}%,${redColor} 100%);` ;

        return `<div class="liquidity-bar" style="${background}">${formatted}</div>`;
    }

    private symbolFormatter(value:unknown):string {
        return MarketUtils.symbolWithoutMarket(value as string);
    }

    private dateTimeFormatter(value:unknown):string {
        return (value && (value as string).indexOf('#')) == -1 ? value as string : '-';
    }

    private unixDateTimeFormatter(value: unknown): string {
        if(!value) {
            return '-';
        }
        let dateTime:string = moment(value as Date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss');
        return `<div class="date-time">${dateTime}</div>`;
    }

    private marketFormatter(value: unknown): string {
        let market: Market = (value as Market);
        return `<div class="name">${this.languageService.translate(market.shortArabic)}</div>`;
    }

    private circleFormatter(value: unknown, dataContext: GridData) {
        let context = dataContext as MarketAlert | TechnicalScopeSignal;
        if(!context.color) {
            Tc.error('fail to find color for ' + context);
        }
        return `<div class="circle" style="background:${context.color}"></div><div>${value}</div>`;
    }

    private eyeFilter() {
        return `<div class='eye'></div>`;
    }

    private annotationDelayedFormatter(value: unknown, dataContext: GridData, columnDef: ColumnDefinition) {
        let dataContext1 = dataContext as Quote | TimeAndSale | MarketAlert ;

        if(dataContext1['isSectionRow']){
            return `<div class="section-name">${value}</div>`;
        }

        let companyText = ''
        if (columnDef.field === "symbol") {
            companyText = MarketUtils.symbolWithoutMarket(dataContext1.symbol);
        } else if (columnDef.field === "name") {
            companyText = dataContext1.name
        }

        return dataContext1.isRealTimeMarket ?
            `<div class="symbol-text">${companyText}</div>` :`<div class="symbol-text">${companyText}</div><div class="annotation-delayed-icon grid-tooltip"></div>`;
    }

    private flagAnnotationFormatter(value: unknown, dataContext: GridData) {
       //  let dataContext1 = dataContext
       //  let name = value as string;
       // return  dataContext1.flagAnnouncement ? `<div>${name}</div><div class="grid-tooltip flag-icon ${dataContext1.flag}"></div>` : name;
    }

    private balloonAnnotationFormater(value: unknown) {
        let name = value as string;
       return `<div class="grid-tooltip balloon-icon"></div><div>${name}</div>`;
    }
}
