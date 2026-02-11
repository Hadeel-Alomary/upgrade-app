import {Injectable} from '@angular/core';

@Injectable()
export class SearchStateService {

    private static STORAGE_KEY: string = 'TC_SEARCH';

    private storageData: string[];

    constructor() {
        if(localStorage.getItem(SearchStateService.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(SearchStateService.STORAGE_KEY));
        } else {
            this.storageData = null;
        }
    }

    getSearchSelectedMarkets(): string [] {
        return this.storageData;
    }

    setSearchSelectedMarkets(selectedMarket: string[]) { // make this take an array of strings
        this.storageData = selectedMarket;
        this.write();
    }

    private write(){
        localStorage[SearchStateService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }

}

interface SearchState {
    selectedMarkets : string;
}
