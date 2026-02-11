import {AlertOperator} from './alert-operator';
import {LanguageService} from '../../state/language';
import {AlertField} from './alert-field';
import {AbstractAlert, AlertHistory} from './abstract-alert';
import {Company} from '../../loader/loader/market';
import {AlertType} from './alert-type';
import {NotificationMethods} from '../notification';
import {AlertTriggerType} from './alert-trigger';
import {IntervalType} from 'tc-web-chart-lib';

export class NormalAlert extends AbstractAlert {

    constructor(
        id: string,
        interval: IntervalType,
        paused: boolean,
        reactivateMinutes: boolean,
        triggerTypeValue: AlertTriggerType,
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
        public field: string,
        public operator: string,
        public value: number
    ) {
        super(id, interval, paused, reactivateMinutes, triggerTypeValue, fireOnChange, expiryDate, message, language, expired,
              createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted);
    }

    public static createNewAlert(language: string, company: Company, value: number = 0): NormalAlert {
        return new NormalAlert(
            null,
            IntervalType.Day,
            false,
            false,
            AlertTriggerType.ONCE,
            false,
            moment().add(3, 'days').format('YYYY-MM-DD 00:00:00'),
            '',
            language,
            false,
            moment().format('YYYY-MM-DD 00:00:00'),
            moment().format('YYYY-MM-DD 00:00:00'),
            company,
            null,
            [],
            new NotificationMethods(),
            AlertType.NORMAL,
            false,
            'last',
            AlertOperator.fromOperationSymbol('>').id,
            +value.toFixed(2)
        );
    }

    public getCondition(languageService: LanguageService): string {
        let fieldText = languageService.translate(AlertField.getFieldById(this.field).name);
        let operatorText = languageService.translate(AlertOperator.fromId(this.operator).name);
        return `${fieldText} ${operatorText} ${this.value}`;
    }

    public getEquation(): string {
        return `${this.field} ${AlertOperator.fromId(this.operator).operationSymbol} ${this.value}`;
    }

    public getEquationDescription(): string {
        return JSON.stringify({
            Operands: [this.field, `${this.value}`],
            Operation: AlertOperator.fromId(this.operator).operationSymbol
        });
    }
}
