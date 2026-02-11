import {TimeAndSale} from "../../../services/index";
import {FilterCondition} from "../filter-condition/filter-condition";

export class TimeAndSaleFilter {
    constructor(public priceFilter:FilterCondition,
                public volumeFilter:FilterCondition ,
                public amountFilter:FilterCondition ,
                public active:boolean) {}


    static newFilter():TimeAndSaleFilter {
        return new TimeAndSaleFilter(FilterCondition.newFilter(),
                                     FilterCondition.newFilter(),
                                     FilterCondition.newFilter(),
                                     false);        
    }


    static filter(timeAndSale:TimeAndSale, filter:TimeAndSaleFilter):boolean {

        if(!filter.active) { return true; }
        
        return FilterCondition.filter(filter.priceFilter, timeAndSale.price) &&
            FilterCondition.filter(filter.volumeFilter, timeAndSale.volume) &&
            FilterCondition.filter(filter.amountFilter, timeAndSale.amount);
        
    }
    
}
