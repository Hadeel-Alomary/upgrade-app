import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation} from '@angular/core';

import {TimeAndSaleFilter} from './time-and-sale-filter';
import {AuthorizationService} from '../../../services/auhtorization';
import {FeatureType} from '../../../services/auhtorization/feature';

const cloneDeep = require("lodash/cloneDeep");

@Component({
    selector: 'time-and-sale-filter-selector',
    templateUrl:'./time-and-sale-filter-selector.component.html',
    styleUrls:['./time-and-sale-filter-selector.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class TimeAndSaleFilterSelectorComponent implements OnChanges {
    
    @Input() inFilter:TimeAndSaleFilter;
    @Output() outputFilter = new EventEmitter();

     filter:TimeAndSaleFilter = TimeAndSaleFilter.newFilter();
    
     isDropDownOpen:boolean;

     constructor(public authorizationService:AuthorizationService){}

    ngAfterViewInit() {}

    ngOnChanges() {
        this.filter = cloneDeep(this.inFilter);
    }
    
     onApply():void{
        this.authorizationService.authorize(FeatureType.FILTER_SETTINGS, () => {
            this.filter.active = true;
            this.hideDropdownMenu();
            this.outputFilter.emit(this.filter);
        })
    }

     onCancel():void{
        this.filter = TimeAndSaleFilter.newFilter(); // cancel filter, reset it to default
        this.hideDropdownMenu();
        this.outputFilter.emit(this.filter);
    }

     onClose():void{
        this.hideDropdownMenu();
    }

     hideDropdownMenu():void{
        this.isDropDownOpen = false;
    }

}


