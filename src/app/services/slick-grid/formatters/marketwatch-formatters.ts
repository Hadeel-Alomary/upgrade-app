import {SlickGridFormatter} from '../slick-grid-formatter-type';
import {LanguageService} from '../../state/index';
import {Analysis, MarketAlert, News, NormalAlert, Quote, TimeAndSale} from '../../data/index';
import {Formatter} from './formatter';
import {MarketUtils, StringUtils, Tc} from '../../../utils/index';
import {ColumnDefinition} from '../slick-grid-columns.service';
import {GridData} from '../../../components/shared/slick-grid/slick-grid';
import {MarketAlertsQuoteMessage} from '../../data/quote/quote';
import {Sector} from '../../loader/loader';
import {TechnicalScopeStateType, TechnicalSignalState} from '../../data/technical-scope/technical-scope-signal';

export class MarketwatchFormatters implements Formatter{

    constructor(private languageService:LanguageService){}

    getFormattersTypes():SlickGridFormatter[]{
        return [
            SlickGridFormatter.MarketwatchFlag,
            SlickGridFormatter.MarketwatchOpen,
            SlickGridFormatter.MarketwatchAlert,
            SlickGridFormatter.MarketwatchNewsAnalysis,
            SlickGridFormatter.MarketwatchSector,
            SlickGridFormatter.MarketwatchTechnicalScope,
            SlickGridFormatter.MarketwatchMarketAlerts,
        ];
    }

    format(formatter:SlickGridFormatter, row:number, cell:number, value:unknown, columnDef:ColumnDefinition, dataContext:GridData):string{
        if(dataContext['isSectionRow']){
            return this.sectionRowFormatter(value);
        }
        switch(formatter) {
            case SlickGridFormatter.MarketwatchFlag:
                return this.flagFormatter(value, dataContext);
            case SlickGridFormatter.MarketwatchAlert:
                return this.alertFormatter(value);
            case SlickGridFormatter.MarketwatchOpen:
                return this.openFormatter(value, dataContext);
            case SlickGridFormatter.MarketwatchNewsAnalysis:
                return this.newsAnalysisFormatter(dataContext);
            case SlickGridFormatter.MarketwatchSector:
                return this.sectorFormatter(value)
            case SlickGridFormatter.MarketwatchTechnicalScope:
                return this.formatTechnicalScope(value);
            case SlickGridFormatter.MarketwatchMarketAlerts:
                return this.marketAlertsFormat(value);
        }

        Tc.error("fail to find formatter for " + formatter);
    }

    private sectionRowFormatter(value: unknown): string {
        return `<div class="section-name">${value}</div>`;
    }

    private flagFormatter(value: unknown, dataContext: GridData): string {
        let quote = dataContext as Quote;
        if (quote.flagAnnouncement) {
            return `<div class=" grid-tooltip flag-icon ${value}" data-placement="left" data-original-title="${quote.flagAnnouncement}"></div>`;
        }
        return '';
    }

    private alertFormatter(value:unknown):string{
        let className:string = value != null ? 'shown' : '';
        let alert = value as NormalAlert;
        let tooltip = alert == null ? '' : alert.getCondition(this.languageService);
        if(tooltip != '') {
            tooltip = `${this.languageService.translate('تنبيه: ')}${tooltip}`;
            return `<div class=" grid-tooltip alert-icon ${className}" data-placement="left" data-original-title="${tooltip}"></div>`;
        }
        return '';
    }

    private openFormatter(value:unknown, dataContext:GridData):string {
        let quote:Quote = dataContext as Quote;
        let previousClose:number = quote.previousClose;
        let formatted:string = StringUtils.formatVariableDigitsNumber(value as number);
        if(value == previousClose) {
            return formatted; // no formatting when open equal to previousClose
        }
        return (value as number) < previousClose ? `<div class="negative">${formatted}</div>` : `<div class="positive">${formatted}</div>`;
    }

    private newsAnalysisFormatter(dataContext:GridData):string{
        /*
        NK Priority rules:
           1. not-viewed news.
           2. not-viewed analysis.
           3. viewed news.
           4. viewed analysis.
        */

        let quote = dataContext as Quote;

        let news:News = quote.news;
        let analysis:Analysis = quote.analysis;

        let nonViewedNews:boolean = news && !news.viewed;
        let viewedNews:boolean = news && news.viewed;
        let nonViewedAnalysis:boolean = analysis && !analysis.viewed;
        let viewedAnalysis:boolean = analysis && analysis.viewed;

        if(nonViewedNews) {
            return this.getFormattedNews(news)
        } else if(nonViewedAnalysis) {
            return this.getFormattedAnalysis(analysis)
        } else if (viewedNews) {
            return this.getFormattedNews(news)
        } else if (viewedAnalysis) {
            return this.getFormattedAnalysis(analysis)
        }

        return '';

    }

     private getFormattedAnalysis(analysis:Analysis):string{
        let viewedAnalysis:string = analysis.viewed ? 'viewed' : 'not-viewed';
        return `<div class="grid-tooltip analysis-icon shown ${viewedAnalysis}" data-placement="left" data-original-title="${analysis.title}"></div>`
    }

     private getFormattedNews(news:News):string{
        let viewedNews:string = news.viewed ? 'viewed' : 'not-viewed';
        return `<div class=" grid-tooltip news-icon shown ${viewedNews}" data-placement="left" data-original-title="${news.header}"></div>`
    }

    private sectorFormatter(value: unknown) {
        let sector = (value as Sector);
        let text = this.languageService.arabic ? sector.arabic: sector.english;
        return `<div class="name">${text}</div>`;
    }

    private formatTechnicalScope(value: unknown) {
        let technicalScopeMessage = value as TechnicalSignalState;
        let message: string;
        let color: string
        if(technicalScopeMessage) {
            message = this.languageService.arabic ? technicalScopeMessage.arabic : technicalScopeMessage.english;

            if (technicalScopeMessage.state == TechnicalScopeStateType.positive) {
                color = '#00CC00';
            }else if(technicalScopeMessage.state == TechnicalScopeStateType.negative) {
                color = '#F00000';
            }
            return `<div class="circle" style="background:${color}"></div><div>${message}</div>`;
        }
        return '';
    }

    private marketAlertsFormat(value: unknown) {
        let message = value as  MarketAlertsQuoteMessage;
        let alertMessage: string;
        let alertEv: string;
        let color: string;

        if(message){
            let alertEvSections = message.alertEv.split('  ');
            alertEv = '&nbsp; &nbsp;' + alertEvSections[0] + '&nbsp; &nbsp;';

            if(alertEvSections.length > 1){
                //Ehab: has percentage value
                alertEv+= alertEvSections[1].replace('pct', '%') + '&nbsp; &nbsp;';
            }
            alertMessage = this.languageService.arabic ? message.arabic.replace('[#]', ''): message.english.replace('[#]', '');

            color = MarketAlert.typeToColor(message.alertType);

            return `<div class="circle" style="background:${color}"></div><div><span>${alertMessage}</span><span class="technical-scope-alert"> ${alertEv} ${message.alertTime}</span></div>`;
        }
        return '';
    }

}
