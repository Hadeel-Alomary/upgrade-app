import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../shared';
import {ChannelRequest, ChannelRequestType, SharedChannel} from '../../../services/shared-channel';
import {Loader} from '../../../services/loader/loader';
import {MarketUtils} from '../../../utils';
import {Accessor} from '../../../services/accessor';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Watchlist, WatchlistService} from '../../../services/settings/watchlist';
import {PredefinedWatchlistService} from '../../../services/predefined-watchlist';
import {SearchStateService} from "../../../services/state/search/search-state.service";
import {LanguageService} from '../../../services';

@Component({
    selector: 'search-company',
    templateUrl: './search-company.component.html',
    styleUrls: ['./search-company.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})
export class SearchCompanyComponent extends ChannelListener<SearchBoxChannelRequest> implements OnInit {

    @ViewChild(ModalDirective) public searchModal: ModalDirective;
    @ViewChild('input') searchField: ElementRef;
    @ViewChild('searchResultContainer') searchResultContainer: ElementRef; // Reference to the container holding search results

    allCompanies: SearchCompany[] = [];
    searchResult: SearchCompany[] = [];
    selectedMarkets: SearchMarket[] = [];
    searchText: string = '';
    searchTerm = new Subject<string>();
    isDropDownOpen: boolean = false;

    isSearching: boolean = false;

    private selectedCompanyIndex: number;

    constructor(public el: ElementRef,
                public accessor: Accessor,
                public sharedChannel: SharedChannel,
                public cd: ChangeDetectorRef,
                public loader: Loader,
                public watchlistService: WatchlistService,
                public predefinedWatchlistService: PredefinedWatchlistService,
                public languageService: LanguageService,
                public searchStateService: SearchStateService) {
        super(sharedChannel, ChannelRequestType.SearchBox);

        this.loader.isLoadingDoneStream().subscribe(loadingDone => {
            if (loadingDone) {
                this.initDataSource();
                this.handleStorageSelectedMarkets();
                this.allCompanies = this.loadCompaniesOrderedByFollowingStatus();
            }
        });
    }

    private initDataSource() {
        this.selectedMarkets.unshift({id: 0, abbreviation:'all', name: this.accessor.languageService.translate('جميع الأسواق'), selected: false});

        this.loader.getMarketStream().subscribe(market => {
            this.selectedMarkets.push({
                id: market.id,
                abbreviation: market.abbreviation,
                name: this.accessor.languageService.arabic ? market.shortArabic: market.shortEnglish,
                selected: false
            });
        });
    }

    protected onChannelRequest() {
        let a = this.selectedCompanyIndex >= 0;
        this.resetSelectedCompany();
        this.searchResult = this.getAllFilteredCompanies(100);

        this.searchModal.show();
        this.searchField.nativeElement.focus();

        this.cd.markForCheck();
    }

    ngOnInit() {
        this.searchTerm.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(250),

            // ignore new term if same as previous term
            distinctUntilChanged(),

            // switch to new search observable each time the term changes
            map((term: string) => {
                this.getSearchResult(term);
                this.isSearching = false;
            }),
        ).subscribe();

    }

    private handleStorageSelectedMarkets(): void {
        let storageSelectedMarkets = this.searchStateService.getSearchSelectedMarkets();
        if (storageSelectedMarkets === null) {
            this.selectAllMarkets();
            return;
        }

        //Take previously selected markets from storage
        this.selectedMarkets.forEach(market => {
            market.selected = storageSelectedMarkets.includes(market.abbreviation);
        });

        this.selectAllMarketsIfNeeded();
    }

    private getPredefinedWatchlistsWithoutGlobalWatchlist(): Watchlist[] {
        let globalPredefinedWatchlistId = this.predefinedWatchlistService.getGlobalPredefinedWatchlistId();
        return this.predefinedWatchlistService.getAllPredefinedWatchlists().filter((watchlist: Watchlist) => watchlist.id != globalPredefinedWatchlistId);
    }

    private loadCompaniesOrderedByFollowingStatus() {
        let followedPredefinedWatchlists: Watchlist[] = this.getPredefinedWatchlistsWithoutGlobalWatchlist();

        let followedCompanies: SearchCompany[] = [];
        let notFollowedCompanies: SearchCompany[] = [];

        this.selectedMarkets.forEach(searchMarket => {
            if(searchMarket.id == 0) {
                return;
            }
            let market = this.accessor.marketsManager.getMarketByAbbreviation(searchMarket.abbreviation);
            market.sortedCompanies.forEach(company => {
                let followedPredefinedWatchlist = followedPredefinedWatchlists.find(w => Object.keys(w.symbols).includes(company.symbol));
                let order = followedPredefinedWatchlist ? +followedPredefinedWatchlist.order : Number.MAX_VALUE;

                let searchCompany = {
                    symbol: company.symbol,
                    arabic: company.arabic,
                    english: company.english,
                    market: this.accessor.languageService.arabic ? market.shortArabic : market.shortEnglish,
                    index: company.index,
                    order: order,
                    selected: false
                };

                followedPredefinedWatchlist ? followedCompanies.push(searchCompany) : notFollowedCompanies.push(searchCompany);
            });
        });

        followedCompanies.sort((a, b) => a.order - b.order);
        notFollowedCompanies.sort((a, b) => a.order - b.order);

        return followedCompanies.concat(notFollowedCompanies);
    }

    private getSearchResult(term: string): void {
        this.searchResult = [];
        if (!term.trim()) {
            this.searchResult = this.getAllFilteredCompanies(100);
            this.cd.markForCheck();
            return;
        }
        this.searchResult.push(...this.search(term, true, 100));
        if (this.searchResult.length < 100) {
            this.searchResult.push(...this.search(term, false,100 - this.searchResult.length));
        }
        this.cd.markForCheck();
    }

    public getCompanyName(company: SearchCompany): string {
        return this.accessor.languageService.arabic? company.arabic : company.english;
    }

    public getAllFilteredCompanies(resultLimit: number = 0): SearchCompany[] {
        let selectedMarketsAbbr: string[] = this.getSelectedMarketsAbbr();
        let companiesCounter = 0;

        let filteredCompanies: SearchCompany[] = [];

        for(let i=0; i < this.allCompanies.length; i++) {
            if (this.channelRequest.ignoreIndices && this.allCompanies[i].index) {
                continue;
            }
            let filterCompany = selectedMarketsAbbr.includes(MarketUtils.marketAbbr(this.allCompanies[i].symbol));
            if(filterCompany){
                filteredCompanies.push(this.allCompanies[i]);
                companiesCounter++;
            }

            if(resultLimit && companiesCounter > resultLimit) {
                break;
            }
        }
        return filteredCompanies;
    }

    private search(term: string, bySymbol: boolean, searchLimit: number) {
        let currentLanguage = this.languageService.arabic ? 'arabic' : 'english';
        let otherLanguage = this.languageService.arabic ? 'english' : 'arabic';
        term = term.toLowerCase();
        let filteredCompanies: SearchCompany[] = [];
        if(bySymbol) {
             filteredCompanies.push(...this.getAllFilteredCompanies().filter(company => {return company.symbol.toLowerCase().includes(term);}));
        } else {
            let currentLanguageSearchCompanies = this.getAllFilteredCompanies().filter(company =>
                company[currentLanguage].toLowerCase().includes(term)
            );

            let otherLanguageSearchCompanies = this.getAllFilteredCompanies().filter(company =>
                //Filter other language result without repeating companies from currentLanguageSearchCompanies result
                company[otherLanguage].toLowerCase().includes(term) && !currentLanguageSearchCompanies.find(currentLanguageCompany => currentLanguageCompany.symbol === company.symbol)
            );

            filteredCompanies = [...currentLanguageSearchCompanies, ...otherLanguageSearchCompanies];
        }
        return this.sortCompany(term, filteredCompanies, bySymbol, currentLanguage).slice(0, searchLimit);
    }

    private sortCompany(term: string, sortedCompanies: SearchCompany[], bySymbol: boolean, currentLanguage: string) {
        sortedCompanies.sort((a, b) => {
            let value1 = bySymbol ? a.symbol.toLowerCase() : a[currentLanguage].toLowerCase();
            let value2 = bySymbol ? b.symbol.toLowerCase() : b[currentLanguage].toLowerCase();

            if (value1.startsWith(term) && !value2.startsWith(term)) {
                return -1;
            } else if (!value1.startsWith(term) && value2.startsWith(term)) {
                return 1;
            } else {
                return value1.localeCompare(value2);
            }
        });

        return sortedCompanies;
    }

    public doSearch() {
        this.isSearching = true;
        this.resetSelectedCompany();
        this.searchTerm.next(this.searchText);
    }

    public onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowUp':
                this.handleArrowKey(-1);
                break;
            case 'ArrowDown':
                this.handleArrowKey(1);
                break;
            case 'Enter':
                //setTimeout because if the user write too quickly then press enter the selected company will be the first company instead of the first company of the search result.
                setTimeout(()=>{
                    this.handleEnterKey();
                }, this.isSearching ? 500 : 0);
        }
    }

    private handleArrowKey(step: number) {
        // Handle selected company by pressing arrow up and arrow down
        if (this.searchResult.length > 0) {
            if (this.selectedCompanyIndex === undefined) {
                this.selectedCompanyIndex = step > 0 ? 0 : this.searchResult.length - 1;
            } else {
                // Apply mod (%) to ensure the index wraps around within the valid range.
                this.selectedCompanyIndex = (this.selectedCompanyIndex + step) % this.searchResult.length;
                if (this.selectedCompanyIndex < 0) {
                    this.selectedCompanyIndex += this.searchResult.length;
                }
            }
            this.updateSelectedCompany();
        }
    }

    private handleEnterKey() {
        // Handle Enter key logic
        if (this.selectedCompanyIndex >= 0) {
            this.onSelectCompany();
        } else if (this.searchText !== '' && this.searchResult.length > 0){
            // if user entered search text then select first company
            this.selectedCompanyIndex = 0;
            this.onSelectCompany();
        }
    }

    private updateSelectedCompany() {
        // Reset selected property for all companies
        this.searchResult.forEach((company) => {
            company.selected = false;
        });

        // Set selected property for the currently selected company
        this.searchResult[this.selectedCompanyIndex].selected = true;

        // Scroll the selected item into view
        const selectedItemElement = this.searchResultContainer.nativeElement.children[this.selectedCompanyIndex];
        if (selectedItemElement) {
            selectedItemElement.scrollIntoView({behavior: 'instant', block: 'nearest'});
        }
    }

    private resetSelectedCompany(){
        if(this.searchResult &&  this.searchResult[this.selectedCompanyIndex]) {
            this.searchResult[this.selectedCompanyIndex].selected = false;
            this.selectedCompanyIndex = undefined;
        }
    }

    public onSelectCompany(selectedCompany?: SearchCompany) {
        if (this.channelRequest.caller) {
            selectedCompany = selectedCompany ? selectedCompany : this.searchResult[this.selectedCompanyIndex];
            this.channelRequest.caller.onSelectCompany(selectedCompany);
            this.searchModal.hide();
        }
    }

    public getSymbolWithoutMarket(symbol: string) {
        return MarketUtils.symbolWithoutMarket(symbol);
    }

    public showDelayedAnnotation(symbol: string) {
        let market = this.accessor.marketsManager.getMarketBySymbol(symbol);
        return !market.isRealTime;
    }

    public onHidden() {
        this.searchText = '';
        this.cd.markForCheck();
    }

    public onSelectMarket(market: SearchMarket) {
        market.selected = !market.selected;

        if (market.id == 0) {
            if (market.selected) {
                this.selectAllMarkets()
            } else {
                this.unselectAllMarkets();
            }
        }
        this.selectAllMarketsIfNeeded();

        this.resetSelectedCompany();

        if (this.searchText) {
            this.getSearchResult(this.searchText);
        } else {
            this.searchResult = this.getAllFilteredCompanies(100);
        }

        this.searchStateService.setSearchSelectedMarkets(this.getSelectedMarketsAbbr());

        this.cd.markForCheck();
    }

    private selectAllMarkets() {
        this.selectedMarkets.forEach(market => {market.selected = true;});
    }

    private unselectAllMarkets() {
        this.selectedMarkets.forEach(market => {market.selected = false;});
        this.searchStateService.setSearchSelectedMarkets([]);
    }

    public onDropDownStatusChange(event: boolean) {
        this.isDropDownOpen = event;
        this.cd.markForCheck();
    }

    public getSelectedMarketsLabel() {
        let selectedMarketsLabel: string = '';

        let count = 0;

        this.selectedMarkets.forEach(market => {
            if (market.id != 0 && market.selected) {
                count++;
            }
        });

        if (count == 0) {
            selectedMarketsLabel = this.accessor.languageService.translate('اختيار سوق');
        } else if (count == 1) {
            selectedMarketsLabel = this.selectedMarkets.find(market => market.selected).name;
        } else if (count == this.selectedMarkets.length - 1) {
            selectedMarketsLabel = this.accessor.languageService.translate('جميع الأسواق');
        } else {
            selectedMarketsLabel = this.accessor.languageService.translate('أسواق محددة');
        }

        return selectedMarketsLabel;
    }

    public selectAllMarketsIfNeeded() {
        this.selectedMarkets[0].selected = this.getSelectedMarketsAbbr().length == this.selectedMarkets.length - 1;
        this.cd.markForCheck();
    }

    private getSelectedMarketsAbbr(): string[] {
        return this.selectedMarkets
            .filter((searchMarket) => searchMarket.selected && searchMarket.abbreviation != 'all')
            .map((searchMarket) => searchMarket.abbreviation);
    }

    public getInValidResultSearch(): string {
        if(this.getSelectedMarketsAbbr().length == 0) {
            return `<div>${this.accessor.languageService.translate('لا يوجد أسواق مختارة')}</div>`
        } else {
            return `<div class="text">${this.searchText}</div><div>${this.accessor.languageService.translate('غير موجود في الأسواق المختارة')}</div>`
        }
    }
}

export interface SearchBoxChannelRequest extends ChannelRequest {
    caller: CompanyPropertiesCaller;
    ignoreIndices:boolean;
}

export interface CompanyPropertiesCaller {
    onSelectCompany(company: SearchCompany): void;
}

export interface SearchMarket {
    id: number,
    abbreviation: string,
    name: string,
    selected: boolean
}

export interface SearchCompany {
    symbol: string;
    arabic: string;
    english: string;
    market: string,
    order: number
    selected: boolean;
    index: boolean;
}
