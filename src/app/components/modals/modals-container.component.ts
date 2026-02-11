import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation,} from '@angular/core';
import {TradingService} from '../../services/index';
import {SubscriptionLike as ISubscription} from 'rxjs';
import {BrokerType} from '../../services/trading/broker/broker';

@Component({
    selector: 'modals-container',
    templateUrl:'./modals-container.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class ModalsContainerComponent implements OnDestroy{

    subscriptions:ISubscription[] = [];
    connectedToDerayah:boolean = true;//always be available because it's needed in Derayah Web mode
    showSnbcapital:boolean = true;//always be available because it's needed in mode (Alahli package subscriber user)
    connectedToRiyadcapital:boolean = false;
    connectedToAlinmainvest:boolean = false;
    connectedToAljaziracapital:boolean = false;
    connectedToVirtualTrading:boolean = false;
    connectedToTradestation:boolean = false;
    connectedToMusharaka:boolean = true;
    connectedToBsf:boolean = true;
    connectedToAlkhabeercapital:boolean = true;
    connectedToAlrajhicapital:boolean = true;

    constructor(public tradingService: TradingService, public cd: ChangeDetectorRef) {
        this.subscriptions.push(this.tradingService.getBrokerSelectionStream()
            .subscribe(brokerType => this.onBrokerSelection(brokerType)));
    }

    ngOnDestroy(){
        for(let subscription of this.subscriptions){
            subscription.unsubscribe();
        }
        this.subscriptions = [];
    }

    private onBrokerSelection(brokerType: BrokerType): void {
        this.connectedToVirtualTrading = false;
        this.connectedToTradestation = false;
        this.connectedToRiyadcapital = false;
        this.connectedToAlinmainvest = false;
        this.connectedToAljaziracapital = false;
        if(brokerType != BrokerType.None) {
            this.activateBrokerModals(brokerType);
        }
        this.cd.markForCheck();
    }

    private activateBrokerModals(brokerType: BrokerType) {
        switch (brokerType) {
            case BrokerType.Derayah:
                this.connectedToDerayah = true;
                break;
            case BrokerType.Snbcapital:
                this.showSnbcapital = true;
                break;
            case BrokerType.Riyadcapital:
                this.connectedToRiyadcapital = true;
                break;
            case BrokerType.Musharaka:
                this.connectedToMusharaka = true;
                break;
            case BrokerType.Bsf:
                this.connectedToBsf = true;
               break;
            case BrokerType.Alkhabeercapital:
                this.connectedToAlkhabeercapital = true;
                break;
            case BrokerType.Alinmainvest:
                this.connectedToAlinmainvest = true;
                break;
            case BrokerType.Aljaziracapital:
                this.connectedToAljaziracapital = true;
                break;
            case BrokerType.Alrajhicapital:
                this.connectedToAlrajhicapital = true;
                break;
            case BrokerType.VirtualTrading:
                this.connectedToVirtualTrading = true;
                break;
            case BrokerType.Tradestation:
                this.connectedToTradestation = true;
                break;
        }
    }

}
