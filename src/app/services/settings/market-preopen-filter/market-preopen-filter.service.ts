import {Injectable} from '@angular/core';
import {MarketPreOpenFilterFactory} from './market-preopen-filter-factory';
import{
    Filter
} from '../filter/index';

@Injectable()
export class MarketPreOpenFilterService{

    private filters:Filter[] = [];
    constructor(){
        this.filters = MarketPreOpenFilterFactory.create();
    }

    getAllFilters():Filter[]{
        return this.filters.filter(filter => filter.condition !== null); // NK exclude no-filter
    }

    get(id:string):Filter{
        return this.filters.find(filter => filter.id == id);
    }

    getDefaultFilter(){
        return this.filters[0];
    }

}