import {Component, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, Input, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {AutoLinkService, AutoLinkType, ChannelRequestType, LanguageService, Loader, Market, MarketsManager, SharedChannel} from '../../../services/index';
import {Observable} from 'rxjs/internal/Observable';
import {Subscription} from 'rxjs/internal/Subscription';
import {CompanyPropertiesCaller, SearchBoxChannelRequest, SearchCompany} from '../../modals/search-company/search-company.component';

@Component({
    selector: 'symbol-selector',
    templateUrl:'./symbol-selector.component.html',
    styleUrls:['./symbol-selector.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SymbolSelectorComponent implements CompanyPropertiesCaller, OnInit, OnDestroy {

    @Output() outputSymbol = new EventEmitter<string>();
    @Input() clearEvent: Observable<void>;
    @Input() placeHolderText: string = '';
    @Input() disabled: boolean = false;
    @Input() ignoreIndices: boolean = false;
    @ViewChild('input') input: ElementRef;

    private selectedSymbol: string = '';
    public selectedCompanyText: string = '';

    private clearEventsSubscription: Subscription;

    public symbols: string[] = [];
    public placeHolder: string;

    public constructor(public loader:Loader,  public sanitizer: DomSanitizer,public languageService:LanguageService, public sharedChannel: SharedChannel, public cd: ChangeDetectorRef, public marketsManager: MarketsManager, private autoLinkService: AutoLinkService) {
        loader.getMarketStream()
            .subscribe((market: Market) => {
                market.companies.forEach(company => {
                    this.symbols.push(`${company.symbol} - ${company.name}`);
                });
            });

        this.autoLinkService.getStream()
            .subscribe(autoLinkInfo => {
                this.onAutoLink(autoLinkInfo);
                this.clearSelected();
            });
    }

    ngOnInit(): void {
        if(this.clearEvent) {
            this.clearEventsSubscription = this.clearEvent.subscribe(() => this.clearSelected());
        }
        this.placeHolder = this.placeHolderText;
    }

    ngOnDestroy(): void {
        if(this.clearEventsSubscription) {
            this.clearEventsSubscription.unsubscribe();
        }
    }

    public openSearchModal(){
        let request:SearchBoxChannelRequest = {type: ChannelRequestType.SearchBox, caller: this , ignoreIndices:this.ignoreIndices}
        this.sharedChannel.request(request);
    }

    public onSelectCompany(company: SearchCompany) {
        let name = this.languageService.arabic ? company.arabic: company.english
        this.selectedCompanyText = `${company.symbol} - ${name}`;
        this.selectedSymbol = company.symbol;
        this.outputSymbol.emit(company.symbol);
        // Focus element input to match desktop behaviour we focus input after company selection so when user click enter key the search modal will appear again.
        // So we make it easier to add multiple companies by writing a company symbol then enter key then another symbol then enter key and so on.
        this.input.nativeElement.focus();
        this.cd.markForCheck();
    }

    public onAutoLink(autoLink: {autoLinkType: AutoLinkType, pageId: string, symbol: string}) {
        if(this.selectedSymbol == '') {
            return;
        }
        if(this.selectedSymbol != autoLink.symbol){
            this.selectedCompanyText = '';
            this.cd.markForCheck();
        }
    }

    public clearSelected() {
        this.placeHolder = '';
    }

}
