import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    ViewChild,
    ChangeDetectorRef,
    OnDestroy
} from "@angular/core";

import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../../shared/channel-listener';
import {ConfirmationCaller, ConfirmationRequest} from '../../popup/confirmation/confirmation.component';

import {
    SharedChannel,
    ChannelRequest,
    ChannelRequestType,
    FilterService,
    Filter,
    LanguageService
} from '../../../../services/index';

import {AppTcTracker} from '../../../../utils/index';

import {Condition} from '../../../../services/settings/filter/condition/index';

@Component({
    selector: 'filter-properties',
    templateUrl:'./filter-properties.component.html',
    styleUrls:['./filter-properties.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class FilterPropertiesComponent extends ChannelListener<FilterPropertiesRequest> implements ConfirmationCaller, OnDestroy {

    @ViewChild("propertiesModal") public propertiesModal: ModalDirective;

     filters:Filter[] = [];
     selectedFilter:Filter;
     filter:string;

    constructor( public cd:ChangeDetectorRef,
                 public filterService:FilterService,
                 public sharedChannel:SharedChannel,
                 public languageService:LanguageService){
        super(sharedChannel, ChannelRequestType.FilterProperties);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel request callbacks */

    onConfirmation(confirmed:boolean){
        this.propertiesModal.show();
        if(confirmed) {
            this.filterService.remove(this.selectedFilter);
            this.filters = this.filterService.getUserDefinedFilters();
            this.selectedFilter = this.filters.length ? this.filterService.getUserDefined(this.filters[0].id) : null;
            this.cd.markForCheck();
        }
    }

    /* channel requests */

    protected onChannelRequest() {

        AppTcTracker.trackOpenFilterProperties();

        this.filters = this.filterService.getUserDefinedFilters();

        if(this.channelRequest.filter) {
            this.selectedFilter = this.channelRequest.filter;
        } else {
            this.selectedFilter = this.filters.length ? this.filterService.getUserDefined(this.filters[0].id) : null;
        }

        if(!this.selectedFilter){ // no filters, so create one
            this.onNewFilterModal();
        } else {
            this.propertiesModal.show();
        }

        this.cd.markForCheck();

    }

    /* interactive events */

     onNewFilterModal() {
        this.sharedChannel.request({type: ChannelRequestType.NewFilter});
        this.propertiesModal.hide();
    }

     onDeleteFilter() {
        if(!this.selectedFilter) {
            return; // no selected filter (as in having no filter at all)
        }

        let message:string = this.languageService.translate(`هل ترغب في حذف التصفية `) + this.selectedFilter.name + this.languageService.translate(" ؟");
        let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: message, caller: this};
        this.sharedChannel.request(confirmationRequest);
        this.propertiesModal.hide();
    }

     onChangeSelectedFilter(filter:Filter){
        this.selectedFilter = filter;
    }

     onChangeCondition(condition:Condition){
        this.selectedFilter.condition = condition;
    }

     onDone(){
        this.filterService.save();
        this.propertiesModal.hide();
        this.sharedChannel.request({type: ChannelRequestType.FilterRefresh});
    }

     onCloseModal() {
        this.selectedFilter = null;
        this.propertiesModal.hide();
    }

     onChangeName(name:string){
        if(name.trim().length) {
            this.selectedFilter.name = name.trim();
        }
    }

}


export interface FilterPropertiesRequest extends ChannelRequest {
    filter?:Filter;
}
