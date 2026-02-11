import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AlertMessage, Streamer} from '../../streaming/index';
import {AlertLoader, Company, Loader, LoaderConfig, LoaderUrlType} from '../../loader/index';
// import {IntervalType, TrendLineAlertDrawingDefinition} from 'tc-web-chart-lib';
import {AbstractAlert} from './abstract-alert';
import {Tc, AppTcTracker} from '../../../utils/index';
import {CredentialsStateService, LanguageService} from '../../state/index';
import {AuthorizationService} from '../../auhtorization';
import {FeatureType} from '../../auhtorization/feature';
import {TrendLineAlert} from './trend-line-alert';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ChartAlert} from './chart-alert';
import {HostedAlert} from './hosted-alert';
import {map} from 'rxjs/operators';
import {AlertLimitReached} from '../../loader/alert-loader/alert-loader.service';

@Injectable()
export class AlertService {

    private alerts: AbstractAlert[] = [];

    private alertUpdatedStream: Subject<AbstractAlert>;
    private alertsHistoryLoadedStream: BehaviorSubject<Boolean>;
    private _updateAlertTimeoutHandle: number = null;

    constructor(private alertLoader:AlertLoader,
                streamer:Streamer,
                private credentialsService:CredentialsStateService,
                private loader:Loader,
                private authorizationService:AuthorizationService,
                public languageService: LanguageService) {
        this.alertUpdatedStream = new Subject();
        this.alertsHistoryLoadedStream = new BehaviorSubject(false);

        this.loader.isLoadingDoneStream().subscribe(loadingDone => {
            if(loadingDone) {
                authorizationService.authorizeService(FeatureType.ALERT, () => {
                    this.alertLoader.loadAlerts().subscribe((alerts: AbstractAlert[]) => {
                        this.onLoadHistoricalAlerts(alerts);
                        streamer.getGeneralPurposeStreamer().subscribeAlerts(this.credentialsService.username);
                        streamer.getGeneralPurposeStreamer().getAlertsStream().subscribe((message) => this.onAlertFromStreamer(message));
                    });
                });
            }
        });
    }

    public createAlert(alert:AbstractAlert) {
        Tc.assert(this.alerts.indexOf(alert) == -1, "create an alert that already exists");
        AppTcTracker.trackSaveAlert();
        this.alertLoader.createAlert(alert)
            .subscribe((alertId: string) => {
                alert.id = alertId;
                this.alerts.push(alert);
                this.alertUpdatedStream.next(alert);
            });
    }

    public alertReachedLimit(): Observable<AlertLimitReached>{
        return this.alertLoader.alertLimitReached().pipe(map((response: AlertLimitReached) => response))
    }

    public updateAlert(alert:AbstractAlert) {
        Tc.assert(this.alerts.indexOf(alert) !== -1, "delete an alert that does not exist");
        AppTcTracker.trackUpdateAlert();
        this.alertLoader.updateAlert(alert).subscribe(() => {
            this.alertUpdatedStream.next(alert);
        });
    }

    public getAlertUpdatedStream(): Subject<AbstractAlert> {
        return this.alertUpdatedStream;
    }

    public getAlertsHistoryLoadedStream(): BehaviorSubject<Boolean> {
        return this.alertsHistoryLoadedStream;
    }

    public deleteAlert(alert: AbstractAlert) {
        Tc.assert(this.alerts.indexOf(alert) !== -1, "delete an alert that does not exist");
        AppTcTracker.trackDeleteAlert();
        // MA we need to do the deletion before the request, as services may try to fetch alerts immediately after deletion
        // for rendering, and we like to see this alert then gone :-)
        this.alerts.splice(this.alerts.indexOf(alert), 1);
        alert.deleted = true;
        this.alertLoader.deleteAlert(alert).subscribe(() => {
            this.alertUpdatedStream.next(alert);
        });
    }

    public getActiveSimpleAlerts(): AbstractAlert[] {
        return this.alerts.filter(alert => alert.isNormalAlert() && alert.isActive());
    }

    public getAlerts(): AbstractAlert[] {
        return this.alerts;
    }
    public getActiveAlerts(): AbstractAlert[] {
        return this.alerts.filter(alert => alert.isActive());
    }

    public getInactiveAlerts(): AbstractAlert[] {
        return this.alerts.filter(alert => !alert.isActive());
    }

    public getAchievedAlerts(): AbstractAlert[] {
        return this.alerts.filter(alert => alert.isAchieved());
    }

    public getTrendLineAlertByDrawingId(drawingId: string): TrendLineAlert {
        return this.getActiveAlerts().find(alert => alert.isTrendLineAlert() && (alert as TrendLineAlert).drawingId == drawingId) as TrendLineAlert;
    }

    public getAchievedTrendLineAlertByDrawingId(drawingId: string): TrendLineAlert {
        return this.getAchievedAlerts().find(alert => alert.isTrendLineAlert() && (alert as TrendLineAlert).drawingId == drawingId) as TrendLineAlert;
    }

    public getAchievedTrendLineAlertsHostedByChart(hostId: string): TrendLineAlert[] {
        let activeTrendLineAlerts = this.getAchievedAlerts().filter(alert => alert.isTrendLineAlert());
        return (activeTrendLineAlerts as TrendLineAlert[]).filter(alert => alert.hostId == hostId);
    }

    public getTrendLineAlertsHostedByChart(hostId: string): TrendLineAlert[] {
        let activeTrendLineAlerts = this.getActiveAlerts().filter(alert => alert.isTrendLineAlert());
        return (activeTrendLineAlerts as TrendLineAlert[]).filter(alert => alert.hostId == hostId);
    }

    public getChartAlertsHostedByChart(hostId: string): ChartAlert[] {
        let activeChartAlerts = this.getActiveAlerts().filter(alert => alert.isChartAlert());
        return (activeChartAlerts as ChartAlert[]).filter(alert => alert.hostId == hostId);
    }

    public getAlertsHostedByChart(hostId: string): AbstractAlert[] {
        return [].concat(this.getTrendLineAlertsHostedByChart(hostId), this.getChartAlertsHostedByChart(hostId));
    }

    //HA : Previous method don't return Achieved Trend Line Alerts .
    public getAllAlertsHostedByChart(hostId: string): AbstractAlert[] {
        return [].concat(this.getChartAlertsHostedByChart(hostId), this.getTrendLineAlertsHostedByChart(hostId), this.getAchievedTrendLineAlertsHostedByChart(hostId));
    }

    public getIndicatorChartAlerts(hostId: string, indicatorId: string): ChartAlert[] {
        return this.getChartAlertsHostedByChart(hostId).filter(alert => alert.parameter.indicatorId == indicatorId);
    }

    private onLoadHistoricalAlerts(alerts: AbstractAlert[]): void {
        alerts.forEach(alert => {
            this.alerts.push(alert);
        });
        this.alertsHistoryLoadedStream.next(true);
    }

    private onAlertFromStreamer(message:AlertMessage):void{
        let alert: AbstractAlert = this.alerts.find(alert => alert.id == message.id);
        if(alert) {
            alert.lastTriggerTime = message.time;
            alert.history.push({time: message.time, price: +message.price});
            alert.expired = true;
            this.alertUpdatedStream.next(alert);
        }
    }

    getAlertsHostedByPage(pageId: string):AbstractAlert[] {
        return this.alerts.filter(alert => {
            return (alert instanceof HostedAlert) && (alert as HostedAlert).hostId.startsWith(pageId + '|');
        });
    }

    // public updateTrendLineAlert(intervalType : IntervalType , company:Company , hostId : string , trendLineDefinition :TrendLineAlertDrawingDefinition ,drawingId:string) {
    //     let newTrendLineAlert = this.createTrendLineAlert(intervalType , company , hostId , trendLineDefinition , drawingId);
    //     let trendLineAlert = this.getTrendLineAlertByDrawingId(drawingId);
    //
    //     if(this._updateAlertTimeoutHandle) {
    //         clearTimeout(this._updateAlertTimeoutHandle);
    //         this._updateAlertTimeoutHandle = null;
    //     }
    //
    //     if(trendLineAlert.hasDifferentTrendLineDefinition(newTrendLineAlert.trendLine)) {
    //         trendLineAlert.updateTrendLineDefinitionAndInterval(newTrendLineAlert.trendLine, newTrendLineAlert.interval);
    //         this._updateAlertTimeoutHandle = window.setTimeout(() => {
    //             this.updateAlert(trendLineAlert);
    //         }, 2000);
    //     }
    // }

    // public createTrendLineAlert(intervalType : IntervalType , company:Company , hostId : string , trendLineDefinition :TrendLineAlertDrawingDefinition ,drawingId:string): TrendLineAlert {
    //     return TrendLineAlert.createNewAlert(intervalType, company, trendLineDefinition ,
    //         hostId , drawingId , this.languageService.arabic ? 'arabic' : 'english');
    // }

    public indicatorSettingsUpdated(chartHostId:string , indicatorId:string , alertParameter:(string | number)[]) {
        let indicatorAlerts = this.getIndicatorChartAlerts(chartHostId, indicatorId);
        if(indicatorAlerts.length == 0) {
            return;
        }
        if(this._hasDifferentParametersThanAlert(indicatorAlerts[0],alertParameter)) {
            indicatorAlerts.forEach(alert => {
                alert.parameter.indicatorParameters = alertParameter;
                this.updateAlert(alert);
            })
        }
    }

    private _hasDifferentParametersThanAlert(alert: ChartAlert , alertParameter:(string | number)[]) {
        let newIndicatorAlertParameters = alertParameter;
        for(let i = 0; i < newIndicatorAlertParameters.length; i++) {
            let param = newIndicatorAlertParameters[i];
            if(param != alert.parameter.indicatorParameters[i]) {
                return true;
            }
        }
        return false;
    }

}
