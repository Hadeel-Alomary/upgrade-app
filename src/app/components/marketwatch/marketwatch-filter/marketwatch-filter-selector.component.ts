import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {AppModeAuthorizationService, AuthorizationService, ChannelRequestType, Filter, FilterService, LanguageService, SharedChannel} from '../../../services/index';
// import {FilterPropertiesRequest} from '../../modals/index';
import {FeatureType} from '../../../services/auhtorization/feature';
import {AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';
import {DropdownDirective} from '../../../ng2-bootstrap/components/dropdown/dropdown.directive';
import {DropdownToggleDirective} from '../../../ng2-bootstrap/components/dropdown/dropdown-toggle.directive';
import {DropdownMenuDirective} from '../../../ng2-bootstrap/components/dropdown/dropdown-menu.directive';
import {NgFor, NgIf} from '@angular/common';

@Component({
    standalone:true,
    selector: 'marketwatch-filter-selector',
    templateUrl:'./marketwatch-filter-selector.component.html',
    styleUrls:['./marketwatch-filter-selector.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:[DropdownDirective,DropdownToggleDirective,DropdownMenuDirective,NgIf,NgFor]
})

export class MarketwatchFilterSelectorComponent  {

    @Input() filter:Filter = null;
    @Output() outputFilter = new EventEmitter();

    appModeFeatureType = AppModeFeatureType;

    constructor( public filterService:FilterService,
                 public sharedChannel:SharedChannel,
                 public languageService:LanguageService,
                 public authorizationService:AuthorizationService,
                 public appModeAuthorizationService: AppModeAuthorizationService){}

    /* template helpers */
     get defaultFilter():Filter {
        return this.filterService.getBuiltinFilters()[0];
    }

     get builtinFilters():Filter[] {
        return this.filterService.getBuiltinFilters().slice(1);
    }

     get userDefinedFilters():Filter[] {
        return this.filterService.getUserDefinedFilters();
    }

    getSelectedFilterName():string{
         if(!this.filter){
             return this.languageService.translate('بدون تصفية');
         }

         if(this.filter.builtin){
             return this.languageService.translate(this.filter.name);
         }

         return this.filter.name;
    }

    /* interactive events */
     onSelectFilter(filter:Filter){
        this.filter = filter;
        this.outputFilter.emit(filter);
    }

     onUpdateFilters() {
         this.authorizationService.authorize(FeatureType.UPDATE_WATCHLIST_FILTER, () => {
             // let filterPropertiesRequest:FilterPropertiesRequest = {type: ChannelRequestType.FilterProperties};
             // if(!this.filter.builtin){
             //     filterPropertiesRequest.filter = this.filter;
             // }
             // this.sharedChannel.request(filterPropertiesRequest);
         });
    }

     onNewFilter() {
         this.sharedChannel.request({type: ChannelRequestType.NewFilter});
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

    public isAllowedAddOrEditFilter(): boolean {
        return  this.isAllowedAddNewFilter() || this.isAllowedEditFilter();
    }

    public isAllowedAddNewFilter(): boolean {
       return  this.authorizationService.isProfessionalSubscriber() || this.appModeAllowedFeature(this.appModeFeatureType.MARKET_WATCH_ADD_NEW_FILTER);
    }

    public isAllowedEditFilter(): boolean {
         return this.authorizationService.isProfessionalSubscriber() || this.appModeAllowedFeature(this.appModeFeatureType.MARKET_WATCH_EDIT_FILTER);
    }
}
