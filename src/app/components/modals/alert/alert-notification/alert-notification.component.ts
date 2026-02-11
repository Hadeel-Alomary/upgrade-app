import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';
import {
    AbstractAlert,
    AlertService,
    ChannelRequestType,
    ChartAlert,
    LanguageService,
    PageService,
    SharedChannel,
    TrendLineAlert
} from '../../../../services/index';

import {SubscriptionLike as ISubscription} from 'rxjs';
import {ShowAlertOnChartChannelRequest} from '../../../chart';
import {MessageBoxRequest} from '../../popup/message-box';
import {HostedAlert} from '../../../../services/data/alert/hosted-alert';

@Component({
    selector: 'alert-notification',
    templateUrl:'./alert-notification.component.html',
    styleUrls:['./alert-notification.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class AlertNotificationComponent implements OnDestroy {

    @ViewChild(ModalDirective)  alertMessageBox:ModalDirective;

     alert: AbstractAlert;
     waitingAlerts: AbstractAlert[] = [];

     subscriptions:ISubscription[] = [];
    
    constructor(
        public cd:ChangeDetectorRef,
        public alertService:AlertService,
        public languageService:LanguageService,
        public pageService: PageService,
        public sharedChannel: SharedChannel
    ){
        this.subscriptions.push(
            this.alertService.getAlertUpdatedStream().subscribe( (alert: AbstractAlert) => this.processAlert(alert))
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
    }
    
     processAlert(alert: AbstractAlert) {
        if(alert.isAchieved()){
            this.waitingAlerts.push(alert);
            if(!this.alertMessageBox.isShown) {
                this.showNextWaitingAlert();
            }
        }
     }
    
     onCloseModal(){
        this.alertMessageBox.hide();
        setTimeout(() => this.showNextWaitingAlert());
    }
    
     showNextWaitingAlert(){
        if(0 < this.waitingAlerts.length){
            this.alert = this.waitingAlerts.shift();            
            this.cd.markForCheck();
            this.alertMessageBox.show();
        }       
    }

     get alertCondition():string{
        return this.alert.getCondition(this.languageService);
    }

    get showAlertOnChartText(): string {
        let trendLineAlertText = this.languageService.translate('مشاهدة التنبيه على الرسم البياني');
        let chartAlertText = this.languageService.translate('مشاهدة الرسم البياني');
        return this.alert.isTrendLineAlert() ? trendLineAlertText : chartAlertText;
    }

    onShowAlertOnChart() {
        let hostId = (this.alert as HostedAlert).hostId;
        let alertPageId = hostId.split('|')[0] ;
        let alertBoxId = hostId.split('|')[1];
        let alertDrawingId = this.alert.isTrendLineAlert() ? (this.alert as TrendLineAlert).drawingId : null;

        let alertPage = this.pageService.getPages().find(page => page.guid == alertPageId);

        // MA message needed here to appear in translation service without having exception condition happening.
        let notFoundMessage = this.languageService.translate('لم يتم إيجاد صفحة الرسم البياني');

        if(!alertPage) {
            let messageBoxChannelRequest: MessageBoxRequest = {type:ChannelRequestType.MessageBox, messageLine: notFoundMessage};
            this.sharedChannel.request(messageBoxChannelRequest);
            this.onCloseModal();
            return;
        }

        this.pageService.setActivePage(alertPage);

        let channelRequest: ShowAlertOnChartChannelRequest = {
            type: ChannelRequestType.SelectChartDrawing,
            pageId: alertPageId,
            boxId: alertBoxId,
            drawingId: alertDrawingId,
            symbol: this.alert.company.symbol,
            interval: this.alert.interval
        };
        this.sharedChannel.request(channelRequest);

        this.onCloseModal();
    }
}

