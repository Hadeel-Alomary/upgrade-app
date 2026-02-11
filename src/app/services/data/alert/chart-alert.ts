import {LanguageService} from '../../state/language';
import {AlertHistory} from './abstract-alert';
import {Company} from '../../loader/loader';
import {AlertType} from './alert-type';
import {NotificationMethods} from '../notification';
import {ChartAlertFunction, ChartAlertFunctionType} from './chart-alert-function';
import {ChartAlertIndicator} from './chart-alert-indicator';
// import {Interval, IntervalType} from 'tc-web-chart-lib';
import {AlertTriggerType} from './alert-trigger';
import {HostedAlert} from './hosted-alert';
import {StringUtils, Tc} from '../../../utils';
// import {MathUtils} from 'tc-web-chart-lib';

export class ChartAlert extends HostedAlert {

    constructor(
        id: string,
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
        hostId:string,
        public equationDefinition:ChartAlertEquationDefinition
    ) {
        super(id, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired,
            createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted, hostId);
    }


    public get parameter():ChartAlertIndicator {
        return this.equationDefinition.indicator;
    }

    public set parameter(indicator:ChartAlertIndicator) {
        this.equationDefinition.indicator = indicator;
    }


    public static createNewAlert(language: string,
                                 company: Company,
                                 intervalType: any , //IntervalType,
                                 hostId:string,
                                 equationDefinition:ChartAlertEquationDefinition): ChartAlert {


        return new ChartAlert(
            null,
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
            AlertType.TECHNICAL,
            false,
            hostId,
            equationDefinition
        );
    }

    public getCondition(languageService: LanguageService): string {
        let template = languageService.arabic ?
            ChartAlertFunction.fromType(this.equationDefinition.alertFunctionType).arabicMessageTemplate :
            ChartAlertFunction.fromType(this.equationDefinition.alertFunctionType).englishMessageTemplate;
        return template
            .replace('INDICATOR', StringUtils.markLeftToRightInRightToLeftContext(this.parameter.selectedIndicatorField + this.parameter.indicatorParametersString))
            // .replace('VALUE1', StringUtils.formatVariableDigitsNumber(MathUtils.roundAccordingMarket(this.equationDefinition.value1, this.company.symbol)))
            // .replace('VALUE2', StringUtils.formatVariableDigitsNumber(MathUtils.roundAccordingMarket(this.equationDefinition.value2, this.company.symbol)));
    }

    public getEquation(): string {
        let technicalFunction = this.getTechnicalFunction();
        let serverInterval = '1min' //Interval.toAlertServerInterval(this.interval);
        let p1 = ([this.parameter.selectedIndicatorField, serverInterval] as (string | number)[]).concat(this.parameter.indicatorParameters).join('_');
        technicalFunction = this.replaceAll(technicalFunction, 'P_1', p1);
        technicalFunction = this.replaceAll(technicalFunction, 'P_2_prv1', this.equationDefinition.value1.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_2_prv2', this.equationDefinition.value1.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_2', this.equationDefinition.value1.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_3_prv1', this.equationDefinition.value2.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_3_prv2', this.equationDefinition.value2.toString());
        technicalFunction = this.replaceAll(technicalFunction, 'P_3', this.equationDefinition.value2.toString());
        return technicalFunction;
    }

    public getEquationDescription(): string {
        let equationDescriptionObject = {
            'indicatorType': this.parameter.indicatorType,
            'selectedIndicatorField': this.parameter.selectedIndicatorField,
            'indicatorParameters': this.parameter.indicatorParameters,
            'value': this.equationDefinition.value1,
            'alertFunction': this.equationDefinition.alertFunctionType,
            'hostId': this.hostId,
            'indicatorId': this.parameter.indicatorId,
            'secondValue': this.equationDefinition.value2
        };
        return JSON.stringify(equationDescriptionObject);
    }

    public hasChannelFunction() {
        return [ChartAlertFunctionType.ENTERING_CHANNEL, ChartAlertFunctionType.EXITING_CHANNEL].indexOf(this.equationDefinition.alertFunctionType) > -1;
    }

    private replaceAll(str:string, find:string, replace:string) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    private getTechnicalFunction(): string {
        return this.getAlertFunction().technicalFunction;
    }

    private getAlertFunction():ChartAlertFunction {
        return ChartAlertFunction.fromType(this.equationDefinition.alertFunctionType);
    }

}

export interface ChartAlertEquationDefinition {
    indicator: ChartAlertIndicator,
    alertFunctionType:ChartAlertFunctionType,
    value1:number,
    value2:number
}

