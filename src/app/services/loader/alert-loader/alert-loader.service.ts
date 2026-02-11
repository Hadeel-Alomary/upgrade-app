import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EnumUtils, Tc} from '../../../utils/index';
import {Loader, LoaderConfig, LoaderUrlType, MarketsManager} from '../loader/index';
import {CredentialsStateService, LanguageService} from '../../state/index';
import {TrendLineAlert} from '../../data/alert/trend-line-alert';
import {AbstractAlert, AlertHistory} from '../../data/alert/abstract-alert';
import {NormalAlert} from '../../data/alert/normal-alert';
import {AlertType} from '../../data/alert/alert-type';
import {NotificationMethodResponse, NotificationMethods} from '../../data/notification';
import {AlertOperator} from '../../data/alert/alert-operator';
import {TrendLineAlertOperation, TrendLineAlertOperationType} from '../../data/alert/trend-line-alert-operation';
import {AlertTriggerType} from '../../data/alert/alert-trigger';
import {ChartAlert} from '../../data/alert/chart-alert';
import {ChartAlertFunctionType} from '../../data/alert/chart-alert-function';
import {ChartAlertIndicator} from '../../data/alert/chart-alert-indicator';
// import {Interval , EnumUtils} from 'tc-web-chart-lib';
import {TcAuthenticatedHttpClient} from '../../../utils/app.tc-authenticated-http-client.service';

@Injectable()
export class AlertLoader {
    private baseUrl: string;

    constructor(private loader:Loader,
                private tcHttpClient:TcAuthenticatedHttpClient,
                private credentialsService:CredentialsStateService,
                private marketsManager:MarketsManager,
                private languageService: LanguageService
    ) {
        this.loader.getConfigStream()
            .subscribe((loaderConfig:LoaderConfig) => {
                if(loaderConfig){
                    this.onLoaderConfig(loaderConfig);
                }
            });
    }

    private onLoaderConfig(loaderConfig:LoaderConfig){
        this.baseUrl = LoaderConfig.url(loaderConfig, LoaderUrlType.AlertsBase);
    }

    public loadAlerts(): Observable<AbstractAlert[]> {
        let url:string = `${this.baseUrl}/web/index`;
        return this.tcHttpClient.getWithAuth(Tc.url(url)).pipe(
            map((response:AlertResponse[]) => this.processHistoricalAlerts(response))
        );
    }

    createAlert(alert: AbstractAlert):Observable<string> {
        let url:string = `${this.baseUrl}/add`;

        let alertAsJson: {[key: string]: string | number | Object} = {
            "alert_type": EnumUtils.enumValueToString(AlertType, alert.alertType),
            // "data_interval": Interval.toAlertServerInterval(alert.interval),
            "equation": alert.getEquation(),
            "equation_description": alert.getEquationDescription(),
            "expiry_time": `${alert.expiryDate} 00:00:00`,
            "market": this.marketsManager.getMarketBySymbol(alert.company.symbol).abbreviation,
            "message": alert.message,
            "language": this.languageService.arabic ? "arabic" : "english",
            "methods": alert.notificationMethods.toRequestObject(),
            "paused": alert.paused,
            "trigger_type": EnumUtils.enumValueToString(AlertTriggerType, alert.triggerType),
            "symbols": [alert.company.symbol],
            "fire_on_change": alert.fireOnChange
        };

        if(!alert.isNormalAlert()){
            alertAsJson['platform'] = 'WEB';
        }

        return this.tcHttpClient.postWithAuth(Tc.url(url), alertAsJson).pipe(map((response: SaveAlertResponse) => this.processSavedAlertOnServer(response)));
    }

    public updateAlert(alert: AbstractAlert):Observable<void> {
        let url:string = `${this.baseUrl}/{0}/update`;
        url = url.replace('{0}', alert.id);

        return this.tcHttpClient.postWithAuth(url, {
            "alert_type": EnumUtils.enumValueToString(AlertType, alert.alertType),
            // "data_interval": Interval.toAlertServerInterval(alert.interval),
            "equation": alert.getEquation(),
            "equation_description": alert.getEquationDescription(),
            "expiry_time": `${alert.expiryDate} 00:00:00`,
            "market": this.marketsManager.getMarketBySymbol(alert.company.symbol).abbreviation,
            "message": alert.message,
            "language": this.languageService.arabic ? "arabic" : "english",
            "methods": alert.notificationMethods.toRequestObject(),
            "paused": alert.paused,
            "trigger_type": EnumUtils.enumValueToString(AlertTriggerType, alert.triggerType),
            "symbols": [alert.company.symbol],
            "fire_on_change": alert.fireOnChange
        }).pipe(map(response => null));
    }

    public deleteAlert(alert: AbstractAlert):Observable<void> {
        let url:string = `${this.baseUrl}/{0}/delete`;
        url = url.replace('{0}', alert.id);

        return this.tcHttpClient.postWithAuth(url, {}).pipe(map(response => null));
    }

    public alertLimitReached(): Observable<AlertLimitReached> {
        let url:string = `${this.baseUrl}/limit`;
      return this.tcHttpClient.getWithAuth(Tc.url(url)).pipe(
            map((response:AlertLimitReached) => response));
    }

    private processSavedAlertOnServer(response: SaveAlertResponse):string{
        if(!response.success) {
            Tc.warn("fail in saving alert on server");
            alert("لم يتم حفظ التنبيه بنجاح");
            return "-1";
        }
        return response.id;
    }

    private processHistoricalAlerts(response: AlertResponse[]): AbstractAlert[] {
        let result:  AbstractAlert[] = [];

        for (let responseObject of response) {
            if( (responseObject.deleted == "1") || (responseObject.legacy == "1") ) {
                continue;
            }
            if(this.isSupportedAlert(responseObject.alert_type)) {
            	let symbol = `${responseObject.symbols[0].symbol}.${responseObject.symbols[0].market}`;
		        if(this.marketsManager.hasCompany(symbol)){
                    if(responseObject.alert_type == 'NORMAL') {
                        result.push(this.constructNormalAlert(responseObject));
                    } else if(responseObject.alert_type == 'TREND') {
                        result.push(this.constructTrendLineAlert(responseObject));
                    } else if(responseObject.alert_type == 'TECHNICAL') {
                        result.push(this.constructChartAlert(responseObject));
                    } else {
                        Tc.error("unexpected alert type: " + responseObject.alert_type);
                    }
                }
            }
        }
        return result;
    }

    private isSupportedAlert(alertType: string): boolean {
        return ['NORMAL', 'TREND', 'TECHNICAL'].indexOf(alertType) > -1;
    }

    private constructNormalAlert(responseObject: AlertResponse): NormalAlert {
        let equationDescription = JSON.parse(responseObject.equation_description);

        return new NormalAlert(
            responseObject.id,
            // Interval.fromAlertServerInterval(responseObject.data_interval),
            responseObject.paused == "1",
            responseObject.reactivate_minutes == "1",
            EnumUtils.enumStringToValue(AlertTriggerType, responseObject.trigger_type),
            responseObject.fire_on_change == "1",
            `${responseObject.expiry_time}`.substr(0, 10),
            responseObject.message,
            responseObject.language,
            responseObject.expired == "1",
            responseObject.created_at,
            responseObject.updated_at,
            this.marketsManager.getCompanyBySymbol(`${responseObject.symbols[0].symbol}.${responseObject.symbols[0].market}`),
            responseObject.last_trigger_time,
            this.extractAlertHistory(responseObject.history),
            NotificationMethods.fromResponseData(responseObject.methods),
            AlertType.NORMAL,
            false,
            equationDescription['Operands'][0],
            AlertOperator.fromOperationSymbol(equationDescription['Operation']).id,
            equationDescription['Operands'][1]
        );
    }

    private constructTrendLineAlert(responseObject: AlertResponse): TrendLineAlert {
        let equation = JSON.parse(responseObject.equation);
        let equationDescription = JSON.parse(responseObject.equation_description);

        let symbol = `${responseObject.symbols[0].symbol}.${responseObject.symbols[0].market}`;

        let trendLineDefinition = {
            date1: equation['date1'],
            date2: equation['date2'],
            price1: equation['price1'],
            price2: equation['price2'],
            extendLeft: equation['extend-left'],
            extendRight: equation['extend-right'],
            logarithmic: equation['logarithmic'],
        };

        return new TrendLineAlert(
            responseObject.id,
            // Interval.fromAlertServerInterval(responseObject['data_interval']),
            responseObject.paused == "1",
            responseObject.reactivate_minutes == "1",
            EnumUtils.enumStringToValue(AlertTriggerType, responseObject.trigger_type),
            responseObject.fire_on_change == "1",
            `${responseObject.expiry_time}`.substr(0, 10),
            responseObject.message,
            responseObject.language,
            responseObject.expired == "1",
            responseObject.created_at,
            responseObject.updated_at,
            this.marketsManager.getCompanyBySymbol(symbol),
            responseObject.last_trigger_time,
            this.extractAlertHistory(responseObject.history),
            NotificationMethods.fromResponseData(responseObject.methods),
            AlertType.TREND,
            false,
            equationDescription['hostId'],
            TrendLineAlertOperation.fromType(TrendLineAlertOperationType[equation['operation'] as keyof typeof TrendLineAlertOperationType]),
            trendLineDefinition,
            equationDescription['drawingId']
        );
    }

    private constructChartAlert(responseObject: AlertResponse) {
        let equationDescription = JSON.parse(responseObject.equation_description);

        let indicatorType = equationDescription['indicatorType'];
        let selectedIndicatorField = equationDescription['selectedIndicatorField'];
        let indicatorParameters = equationDescription['indicatorParameters'];
        let value = equationDescription['value'];
        let alertFunction = equationDescription['alertFunction'];
        let alertFunctionTypeEnumString = ChartAlertFunctionType[alertFunction];
        let hostId = equationDescription['hostId'];
        let indicatorId = equationDescription['indicatorId'];
        let secondValue = equationDescription['secondValue'];

        return new ChartAlert(
            responseObject.id,
            // Interval.fromAlertServerInterval(responseObject.data_interval),
            responseObject.paused == "1",
            responseObject.reactivate_minutes == "1",
            EnumUtils.enumStringToValue(AlertTriggerType, responseObject.trigger_type),
            responseObject.fire_on_change == "1",
            `${responseObject.expiry_time}`.substr(0, 10),
            responseObject.message,
            responseObject.language,
            responseObject.expired == "1",
            responseObject.created_at,
            responseObject.updated_at,
            this.marketsManager.getCompanyBySymbol(`${responseObject.symbols[0].symbol}.${responseObject.symbols[0].market}`),
            responseObject.last_trigger_time,
            this.extractAlertHistory(responseObject.history),
            NotificationMethods.fromResponseData(responseObject.methods),
            AlertType.TECHNICAL,
            false,
            hostId,
            {
                indicator: new ChartAlertIndicator(indicatorType, selectedIndicatorField, indicatorParameters, indicatorId),
                alertFunctionType: ChartAlertFunctionType[alertFunctionTypeEnumString as keyof typeof ChartAlertFunctionType],
                value1: value,
                value2: secondValue
            }
        );
    }

    private extractAlertHistory(responseHistory: AlertHistoryResponse[]): AlertHistory[] {
        let result: AlertHistory[] = [];
        for(let history of responseHistory) {
            result.push({
                time: history.alert_time,
                price: +history.price
            });
        }
        return result;
    }
}

interface AlertResponse {
    id: string,
    alert_type: string,
    data_interval: string,
    deleted: string,
    equation: string,
    equation_description: string,
    expired: string,
    expiry_time: string,
    fire_on_change: string,
    history: AlertHistoryResponse[],
    language: string,
    last_trigger_time: string,
    legacy: string,
    market: string,
    message: string,
    methods: NotificationMethodResponse[],
    paused: string,
    reactivate_minutes: string,
    symbols: AlertSymbolResponse[],
    trigger_type: string,
    created_at: string,
    updated_at: string
}

interface AlertSymbolResponse {
    symbol: string,
    market: string
}

interface AlertHistoryResponse {
    alert_time: string,
    price: string
}

interface SaveAlertResponse {
    success: boolean,
    id: string
}

export interface AlertLimitReached {
    success: boolean,
    limit_reached: boolean
}
