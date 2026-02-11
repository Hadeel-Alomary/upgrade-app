import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';

import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';

import {AuthorizationService, ChannelRequest, ChannelRequestType, Filter, FilterService, SharedChannel,} from '../../../../services/index';

import {FilterPropertiesRequest} from '../filter-properties/filter-properties.component';

import {ChannelListener} from '../../shared/channel-listener';
import {FeatureType} from '../../../../services/auhtorization/feature';

@Component({
    selector: 'new-filter',    
    templateUrl:'./new-filter.component.html',
    styleUrls:['./new-filter.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class NewFilterComponent extends ChannelListener<ChannelRequest> implements OnDestroy {
    
     name:string;
    
    @ViewChild(ModalDirective) public newModal: ModalDirective;
    

    constructor( public filterService:FilterService,
                 public el:ElementRef,
                 public sharedChannel:SharedChannel,
                 public authorizationService: AuthorizationService){
        super(sharedChannel, ChannelRequestType.NewFilter);
    }

    ngOnDestroy() {
        this.onDestroy();
    }
    
    /* channel requests */
    
    protected onChannelRequest() {
        this.name = '';
        this.newModal.show();
    }


    /* template events */
    
     onShown() {
        this.el.nativeElement.getElementsByTagName("input")[0].focus();
    }

    
     onSubmit() {
         let isAuthorized =  this.authorizationService.authorize(FeatureType.WATCHLIST_FILTER, ()=> {}, true, this.filterService.getUserDefinedFilters().length);
         if(isAuthorized) {
             if(this.name) {
                 let filter:Filter = this.filterService.createEmptyFilter(this.name);
                 let filterPropertiesRequest:FilterPropertiesRequest = {type: ChannelRequestType.FilterProperties, filter: filter};
                 this.sharedChannel.request(filterPropertiesRequest);
             }
             this.newModal.hide();
         }else {
             this.newModal.hide();
         }
    }
}


