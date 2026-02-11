import {Component, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, ViewChild, OnDestroy} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';

import {ChannelListener} from '../../shared/channel-listener';

import {
    AlertService,
    AbstractAlert,
    NormalAlert,
    SharedChannel,
    ChannelRequest,
    ChannelRequestType,
    LanguageService,
    AlertTypeWrapper,
    ChartAlert
} from '../../../../services/index';

import {AppTcTracker} from '../../../../utils/index';

import {ConfirmationCaller, ConfirmationRequest} from "../../popup/index";

import {AlertChannelRequest, AlertChannelRequestCaller} from '../../alert/index';

@Component({
    selector:'alert-center',
    templateUrl:'./alert-center.component.html',
    styleUrls:['./alert-center.component.css'],
    changeDetection:ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation:ViewEncapsulation.None
})

export class AlertCenterComponent extends ChannelListener<ChannelRequest> implements ConfirmationCaller, AlertChannelRequestCaller, OnDestroy {

    @ViewChild(ModalDirective)  alertCenterModal: ModalDirective;

     inactiveAlerts: AbstractAlert[] = [];
     activeAlerts: AbstractAlert[] = [];

    constructor( public alertService:AlertService, public sharedChannel:SharedChannel,  public cd:ChangeDetectorRef, public languageService:LanguageService){

        super(sharedChannel, ChannelRequestType.AlertCenter);

        // MA when adding alert, alert service will wait for server to respond with id before
        // adding it. Below line is needed to refresh our alerts when this happens
        this.subscriptions.push(
            this.alertService.getAlertUpdatedStream().subscribe(alert => this.refreshAlerts())
        );

    }

    onChannelRequest(){
        AppTcTracker.trackOpenAlertCenter();
        this.refreshAlerts();
        this.alertCenterModal.show();
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel request callbacks */

    onConfirmation(confirmed:boolean, param:unknown){
        if(confirmed) {
            let alert: AbstractAlert = param as AbstractAlert;
            this.alertService.deleteAlert(alert);
        }
        this.refreshAlerts();
        this.alertCenterModal.show();
    }

    onAlertModalClose(alert: AbstractAlert):void {
        this.refreshAlerts();
        this.alertCenterModal.show();
    }

     refreshAlerts() {
        this.inactiveAlerts = this.alertService.getInactiveAlerts();
        this.activeAlerts = this.alertService.getActiveAlerts();
        this.cd.markForCheck();
    }

    /* template helpers */

     alertCondition(alert:AbstractAlert):string {
        return alert.getCondition(this.languageService);
    }

    getAlertTypeText(alert: AbstractAlert): string {
         return this.languageService.arabic ? AlertTypeWrapper.fromType(alert.alertType).arabic : AlertTypeWrapper.fromType(alert.alertType).english;
    }

    /* interactive events */

     onDeleteAlert(alert: AbstractAlert) {
        let message:string = "هل أنت متأكد أنك تريد حذف التنبيه؟";
        let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.Confirmation,
            messageLine: this.languageService.translate(message), param: alert, caller: this};
        this.sharedChannel.request(confirmationRequest);
        this.alertCenterModal.hide();
    }

     onUpdateAlert(alert: AbstractAlert) {
        let channelRequest: AlertChannelRequest = {type: ChannelRequestType.Alert, caller:this, alert:alert};
        if(alert.isChartAlert()) {
            channelRequest.chatAlertParameters = [(alert as ChartAlert).parameter];
        }
        this.sharedChannel.request(channelRequest);
        this.alertCenterModal.hide();
    }

     onNewAlert() {
        let channelRequest:AlertChannelRequest = {
            type: ChannelRequestType.Alert,
            caller: this,
            alert: NormalAlert.createNewAlert(this.languageService.arabic ? 'arabic' : 'english', null)
        };
        this.sharedChannel.request(channelRequest);
        this.alertCenterModal.hide();
    }


    public getExpiryDate(alert: AbstractAlert): string {
        return alert.expiryDate.substr(0,4) == '2099' ? this.languageService.translate('صالح دائما') : alert.expiryDate.substr(0, 10);
    }
}

