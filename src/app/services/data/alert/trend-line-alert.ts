import {TrendLineAlertOperation, TrendLineAlertOperationType} from './trend-line-alert-operation';
import {AlertTriggerType} from './alert-trigger';
import {AbstractAlert, AlertHistory} from './abstract-alert';
import {LanguageService} from '../../state/language';
import {AlertType} from './alert-type';
import {Company} from '../../loader/loader';
import {NotificationMethods} from '../notification';
// import {IntervalType, TrendLineAlertDrawingDefinition} from 'tc-web-chart-lib';
import {HostedAlert} from './hosted-alert';

const isEqual = require("lodash/isEqual");

export class TrendLineAlert extends HostedAlert {
    constructor(
        id: string,
        // interval: any , //IntervalType,
        paused: boolean,
        reactivateMinutes: boolean,
        triggerType: AlertTriggerType,
        fireOnChange: boolean,
        expiryDate: string,
        message: string,
        language: string,
        expired: boolean,
        createdAt: string,
        updatedAt: string,
        company: Company,
        lastTriggerTime: string,
        history: AlertHistory[],
        notificationMethods: NotificationMethods,
        type: AlertType,
        deleted: boolean,
        hostId: string,
        public operation: TrendLineAlertOperation,
        public trendLine: any ,//TrendLineAlertDrawingDefinition,
        public drawingId: string
    ) {
        super(id, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired,
            createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted, hostId);
    }

    // public static createNewAlert(interval: IntervalType, company: Company, drawingDefinition:TrendLineAlertDrawingDefinition,
    //                              hostId: string, drawingId: string, language: string): TrendLineAlert {
    //     return new TrendLineAlert(
    //         null,
    //         interval,
    //         false,
    //         false,
    //         AlertTriggerType.ONCE,
    //         false,
    //         moment().add(3, 'days').format('YYYY-MM-DD 00:00:00'),
    //         '',
    //         language,
    //         false,
    //         moment().format('YYYY-MM-DD 00:00:00'),
    //         moment().format('YYYY-MM-DD 00:00:00'),
    //         company,
    //         null,
    //         [],
    //         new NotificationMethods(),
    //         AlertType.TREND,
    //         false,
    //         hostId,
    //         TrendLineAlertOperation.fromType(TrendLineAlertOperationType.CROSS_UP),
    //         drawingDefinition,
    //         drawingId
    //     );
    // }
    //
    // public updateTrendLineDefinitionAndInterval(drawingInfo: TrendLineAlertDrawingDefinition, interval: IntervalType): void {
    //     this.trendLine = drawingInfo;
    //     this.interval = interval;
    // }

    public getCondition(languageService: LanguageService): string {
        return languageService.arabic ? this.operation.arabic : this.operation.english;
    }

    public getEquation(): string {
        let equationObject = {
            'operation': TrendLineAlertOperationType[this.operation.type],
            'date1': this.trendLine.date1,
            'date2': this.trendLine.date2,
            'price1': this.trendLine.price1,
            'price2': this.trendLine.price2,
            'extend-left': this.trendLine.extendLeft,
            'extend-right': this.trendLine.extendRight,
            'logarithmic': this.trendLine.logarithmic
        };
        return JSON.stringify(equationObject);
    }

    public getEquationDescription(): string {
        let equationDescriptionObject = {
            'web': true,
            'hostId': this.hostId,
            'drawingId': this.drawingId
        };
        return JSON.stringify(equationDescriptionObject);
    }

    // public hasDifferentTrendLineDefinition(trendLineDefinition:TrendLineAlertDrawingDefinition):boolean {
    //     return !isEqual(this.trendLine, trendLineDefinition);
    // }
}
