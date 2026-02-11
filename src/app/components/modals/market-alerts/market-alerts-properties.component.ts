import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    ViewChild,
    ChangeDetectorRef,
    OnDestroy
} from "@angular/core";

import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';

import {ChannelListener} from '../shared/channel-listener';


import {
    SharedChannel,
    ChannelRequest,
    ChannelRequestType
} from '../../../services/index';
import {AppBrowserUtils} from '../../../utils';

const isEqual = require("lodash/isEqual");
const difference = require("lodash/difference");

@Component({
    selector: 'market-alerts-properties',
    templateUrl:'./market-alerts-properties.component.html',
    styleUrls:['./market-alerts-properties.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class MarketAlertsPropertiesComponent extends ChannelListener<MarketAlertsPropertiesRequest> implements OnDestroy {

    @ViewChild("propertiesModal") public propertiesModal: ModalDirective;

     selectedAlertIds:string[];
     outSelectBoxSelection:AlertEntry[] = [];
     inSelectBoxSelection:AlertEntry[] = [];

    constructor( public cd:ChangeDetectorRef, public sharedChannel:SharedChannel){
        super(sharedChannel, ChannelRequestType.MarketAlertsProperties);
    }

    ngOnDestroy() {
        this.onDestroy();
    }


    /* channel requests */

    protected onChannelRequest() {
        this.propertiesModal.show();
        this.selectedAlertIds = this.getSelectedAlertsInRequest();
        this.cd.markForCheck();
    }


    /* template events */

     onOutSelectBoxSelection(event:AlertEntry){
        this.outSelectBoxSelection = Array.isArray(event) ? event : [event];
    }

     onInSelectBoxSelection(event:AlertEntry){
        this.inSelectBoxSelection = Array.isArray(event) ? event : [event];
    }

     onDoubleClickOutSelectBox(alert:AlertEntry) {
        this.selectedAlertIds.push(alert.id);
        this.outSelectBoxSelection = [];
    }

     onDoubleClickInSelectBox(alert:AlertEntry) {
        this.selectedAlertIds.splice(this.selectedAlertIds.indexOf(alert.id), 1);
        this.inSelectBoxSelection = [];
    }

     onAddAlert() {
        this.outSelectBoxSelection.forEach(alert => this.selectedAlertIds.push(alert.id));
        this.outSelectBoxSelection = [];
    }

     onRemoveAlert() {
        this.inSelectBoxSelection.forEach(alert => this.selectedAlertIds.splice(this.selectedAlertIds.indexOf(alert.id), 1));
        this.inSelectBoxSelection = [];
    }

     onDone(){
        let changed:boolean = !isEqual(this.getSelectedAlertsInRequest(), this.selectedAlertIds);
        if(changed) {
            this.channelRequest.caller.onMarketAlertsChange(this.getExcludedAlertIds());
        }
        this.propertiesModal.hide();
    }

    /* template helpers */

     get inAlerts():AlertEntry[] {
        return this.selectedAlertIds.map(c => this.channelRequest.definitions.find(d => d.id == c));
    }

     get outAlerts():AlertEntry[] {
        return this.channelRequest.definitions.filter(d => d.name && !this.selectedAlertIds.includes(d.id));
    }

    /* misc */

     getSelectedAlertsInRequest():string[] {
        return difference(this.channelRequest.definitions.map(entry => entry.id), this.channelRequest.excludedMarketAlerts);
    }
     getExcludedAlertIds():string[] {
        return difference(this.channelRequest.definitions.map(entry => entry.id), this.selectedAlertIds);
    }


    getSelectBoxWidth():string {
        return AppBrowserUtils.isMobile() ? "100%" : "200";
    }

    getSelectBoxHeight():number {
        return AppBrowserUtils.isMobile() ? 350 : 400;
    }

}

export interface MarketAlertsPropertiesRequest extends ChannelRequest {
    caller: MarketAlertsPropertiesCaller,
    definitions: {id:string, name:string}[]
    excludedMarketAlerts:string[]
}

export interface MarketAlertsPropertiesCaller {
    onMarketAlertsChange(excludedMarketAlerts:string[]):void;
}

interface AlertEntry {
    id:string,
    name:string
}
