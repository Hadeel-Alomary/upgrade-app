import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractAlert, Accessor, Analysis, AnalysisCenterService, AutoLinkType, ChannelRequestType, Filter, FilterService, LanguageService, MarketBoxOpenRequest, MarketSummaryService, TechnicalScopeQuoteService, News, NewsService, NormalAlert, Quote, QuoteService, TechnicalIndicatorQuoteService, Watchlist, WatchlistType, GridColumn, PredefinedWatchlistService} from '../../services/index';
import {AppBrowserUtils, AppMarketInfoUtils, MarketUtils, Tc} from '../../utils/index';
import {GridBoxType, MarketBox, MarketBoxProperties} from '../shared/grid-box/index';
// import {AlertChannelRequest, AlertChannelRequestCaller, ConfirmationCaller, ConfirmationRequest, NewWatchlistCaller, NewWatchlistRequest} from '../modals/index';
import {FeatureType} from '../../services/auhtorization/feature';
import {bufferTime} from 'rxjs/operators';
import {MarketWatchCategory} from './market-watch-category';
import {GridBoxUtils} from '../shared/grid-box/grid-box-type';
import {TechnicalIndicatorColumns} from '../../services/data/technical-indicator';
import {WatchlistSections} from '../../services/loader/predefined-watchlist-loader/predefined-watchlist-loader.service';
import {ColumnDefinition} from '../../services/slick-grid/slick-grid-columns.service';
import {
  AnnotationDelayedComponent,
  BoxTitleComponent, ContextMenuDirective, ExplainDirective,
  TradingContextMenuComponent,
  WatchlistSelectorComponent
} from '../shared';
import {MarketwatchFilterSelectorComponent} from './marketwatch-filter';
import {BoxContextMenuComponent} from '../shared/box-context-menu/box-context-menu.component';
import {NgFor, NgIf} from '@angular/common';
import cloneDeep from 'lodash/cloneDeep';
// const cloneDeep = require('lodash/cloneDeep');

@Component({
    standalone:true,
    selector: 'marketwatch',
    templateUrl:'./marketwatch.component.html',
    styleUrls:['./marketwatch.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    inputs: [ 'width', 'height', 'id', 'page', 'inputWatchlistId'],
    outputs: [ 'close'],
    imports:[BoxTitleComponent,WatchlistSelectorComponent,MarketwatchFilterSelectorComponent,TradingContextMenuComponent,
      BoxContextMenuComponent , AnnotationDelayedComponent , ContextMenuDirective , ExplainDirective,NgIf,NgFor]
})

export class MarketwatchComponent extends MarketBox<MarketwatchProperties, Quote> implements AfterViewInit, OnChanges, OnInit, OnDestroy {

     isGlobalPredefinedWatchListSelected: boolean = false;
     quotes:Quote[];
     subscribedSymbols:string[];

     displayWatchlistTooltip:boolean = false;
     FeatureType = FeatureType;


    iconColumns:{[column:string]:string} = {
        'flag': 'الشركات ذات الخسائر',
        'alert': 'التنبيهات',
        'news': 'الإعلانات',
        'analysis': 'التحليلات'
    };

     selectedColumns: GridColumn[] = [];

    constructor( public quoteService:QuoteService,
                 public newsService:NewsService,
                 public filterService:FilterService,
                 public analysisService:AnalysisCenterService,
                 public cd: ChangeDetectorRef,
                 public accessor:Accessor,
                 public marketSummaryService:MarketSummaryService,
                 public analysisCenterService:AnalysisCenterService,
                 public technicalIndicatorQuoteService: TechnicalIndicatorQuoteService,
                 public technicalScopeQuoteService: TechnicalScopeQuoteService,
                 private languageService:LanguageService,
                 public predefinedWatchlistService: PredefinedWatchlistService) {

        super(cd, accessor);

        this.subscriptions.push(
            this.accessor.sharedChannel.getRequestStream().subscribe( (request)=> {
                if(request.type == ChannelRequestType.UserDefinedWatchListUpdated || request.type == ChannelRequestType.PredefinedWatchlistUpdated) {
                    this.onWatchListUpdated();
                }
            })
        );

        this.subscriptions.push(
            this.accessor.sharedChannel.getRequestStream().subscribe( request => {
                if(request.type == ChannelRequestType.FilterRefresh) {
                    this.slickGrid.refresh();
                    this.cd.markForCheck();
                }
            })
        );
        this.adjustSlickGridWidthOnMarketOpenForMobile();

        this.accessor.sharedChannel.getRequestStream().subscribe(request => {
            if(request.type == ChannelRequestType.SwitchTheme) {
                this.slickGrid.refresh();
                this.slickGrid.invalidate();
                this.cd.markForCheck();
            }
        });
    }

    private adjustSlickGridWidthOnMarketOpenForMobile() {
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // MA for mobile, we size the grid column width based on the data width. During market opening, the width of the columns
        // keep changing rapidly in the first minute as new data is pouring in, which can cause column width to be smaller than data width.
        // To handle this, and only for the first minute after market open, we are going to schedule 12 timers, each for 5 secs, to resize
        // column width based on data available.
        if (AppBrowserUtils.isMobile()) {
            this.marketSummaryService.getMarketStatusChangeStream().subscribe((summary) => {
                // if(summary.status == MarketSummaryStatus.OPEN) {
                //     // for coming minute (5sec * i), keep resizing column width as more data are coming in
                //     for (let i = 0; i < 12; ++i) {
                //         window.setTimeout(() => {
                //             this.slickGrid.resizeColumnWidthsBasedOnTheirData();
                //         }, 5000 * i);
                //     }
                // }
            });
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    ngOnInit() {
        if(this.loadProperties()){
            // after load properties
        }

        this.title = this.watchlist.type  == WatchlistType.UserDefined ? this.watchlist.name : this.accessor.languageService.translate(this.watchlist.name);
        this.isGlobalPredefinedWatchListSelected = this.watchlist.id == this.predefinedWatchlistService.getGlobalPredefinedWatchlistId();
    }

    public hideNameColumnDelayedAnnotation(): boolean{
        //Ehab: In slick grid when we have symbol column, we show delayed annotation in symbol cells
        // otherwise we show the delayed annotation on company name cells
        let gridColumns: ColumnDefinition[] = this.getColumns();
        let symbolColumnFound = gridColumns && gridColumns.find((column: ColumnDefinition) => column.id == 'symbol');
        return symbolColumnFound ? true : false;
    }

    public isTitleShown():boolean {
        return this.isDesktop() || this.isOverlayBox() || GridBoxUtils.isTradingBox(this.type)
    }

    ngOnChanges() {
        Tc.info("OnChanges MarketwatchComponent");
        this.resizeSlickGrid();
    }

    ngOnDestroy() {
        this.subscribedSymbolsColumnsChanged(this.subscribedSymbols, [], this.selectedColumns, []);
        this.slickGrid.destroy();
        this.onDestroy();
    }

    ngAfterViewInit() {
        let self = this;
        let gridRowStyle = function(entry:Quote): object {
            if(entry.isSectionRow){
                return {
                    'columns': {
                        0: {
                            'colspan': '*'
                        }
                    },
                    'cssClasses': 'section-row'
                };
            }

            if(entry.limitUpReached) {
                return { 'cssClasses' : 'limit-up'};
            } else if(entry.limitDownReached) {
                return {'cssClasses' :'limit-down'};
            } else if(entry.index && !self.isGlobalPredefinedWatchListSelected) {//Ehab Don't coloring indexes rows on global watchlist
                return {'cssClasses': 'is-index'}
            }
            return null;
        };

        this.initSlickGrid({forceFitColumns: this.forceFitColumns()}, gridRowStyle);

        this.slickGrid.grid.registerPlugin(new Slick.AutoColumnSize());

        this.setInputWatchlistIfExisted();

        this.initQuote();

        this.subscribeWithData();

        this.updateColumnSortingDependingOnWatchlist(this.watchlist);

        this.subscribedSymbols = this.accessor.watchlistService.getWatchListSymbols(this.watchlist);
        this.selectedColumns = this.slickGridBoxProperties.gridColumns;
        this.subscribedSymbolsColumnsChanged([], this.subscribedSymbols, [], this.selectedColumns);

        this.slickGrid.refresh();
    }

    /* channel request callbacks */

    onAlertModalClose(alert: AbstractAlert):void {}

    onWatchlistCreated(watchlist:Watchlist) {
        let message:string = this.accessor.languageService.translate("هل تريد عرض لائحة أسهمي الجديدة؟");
        // let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: message, param: watchlist, caller: this};
        // this.accessor.sharedChannel.request(confirmationRequest);
    }

    onConfirmation(confirmed:boolean, param:unknown){
        if(confirmed) {
            if(param) { // view created watchlist
                this.watchlist = param as Watchlist;
                this.isGlobalPredefinedWatchListSelected = this.watchlist.id == this.predefinedWatchlistService.getGlobalPredefinedWatchlistId();
                this.onAfterSelectingWatchList();
                this.slickGrid.refresh();
                this.cd.markForCheck();
            } else { // create watchlist to remove company
                let symbols = this.quotes.map(quote => quote.symbol);
                let removedSymbol = (this.getContextMenuItem() as Quote).symbol;
                symbols.splice(symbols.indexOf(removedSymbol), 1);
                // let newWatchlistRequest:NewWatchlistRequest = {type: ChannelRequestType.NewWatchlist, caller: this, symbols: symbols};
                // this.accessor.sharedChannel.request(newWa/tchlistRequest);
            }
        }
    }

    protected getExcludedColumns():string[] {
        return this.excludedIconColumns;
    }


    /* auto link */
    public getDefaultAutoLinkType():AutoLinkType {
        return AutoLinkType.Green;
    }

    /* slick grid host functions */

    filterGrid(quote: Quote): boolean {
        if(this.isGlobalPredefinedWatchListSelected){
            return true;
        }

        let inWatchlist: boolean = this.accessor.watchlistService.filter(this.watchlist, quote.symbol);
        let inDerivativesSector:boolean =  quote.sector.id == 346;
        return this.filter.condition? inWatchlist && !inDerivativesSector && this.filter.run(quote) : inWatchlist;
    }

    onGridDoubleClick(item:Quote, columnId:string, row:number, cell:number) {

        this.slickGrid.removeTooltip();

        if (columnId == 'alert') {
            this.accessor.authorizationService.authorize(FeatureType.ALERT, () => {
                let alert:NormalAlert = item.alert;
                if(!alert) {
                    let language = this.accessor.languageService.arabic ? 'arabic' : 'english';
                    alert = NormalAlert.createNewAlert(language, this.accessor.marketsManager.getCompanyBySymbol(item.symbol));
                }
                // let channelRequest:AlertChannelRequest = {type: ChannelRequestType.Alert, caller:this, alert:alert};
                // this.accessor.sharedChannel.request(channelRequest);
            })
        }
        else if(columnId == 'news'){
            this.openNewsOrAnalysisScreen(item);
        }
    }

    public getSymbol(symbol: string): string {
        return MarketUtils.symbolWithoutMarket(symbol);
    }

    public getMarket(symbol: string): string {
        let market = this.accessor.marketsManager.getMarketBySymbol(symbol);
        return  AppMarketInfoUtils.getMarketNameByAbbreviation(market.abbreviation,this.languageService.arabic)
    }
    /* grid box type */

    get type():GridBoxType{
        return GridBoxType.Marketwatch;
    }


    /* Open analysis center box */

     openAnalysisCenter(analysis:Analysis) {
         // MA for users that cannot do docking, open a modal to show analysis. Otherwise, open analysis center.
         if (this.accessor.authorizationService.isProfessionalSubscriber()) {
             let openRequest: MarketBoxOpenRequest = {
                 type: ChannelRequestType.OpenMarket,
                 gridBoxType: GridBoxType.AnalysisCenter,
                 watchlistId: this.watchlist.id,
             };
             this.accessor.sharedChannel.request(openRequest);
         } else {
             let url = this.analysisCenterService.communityCompaniesUrl(analysis.company.id);
             window.open(url, '_blank');
         }
    }

    /* new watchlist help */
    public onSelectingEmptyWatchlist(){
        this.displayWatchlistTooltip = true;
        this.cd.markForCheck();
    }

    /* interactive events */

     onSelectingFilter(filter:Filter){
        this.filter = filter;
        this.slickGrid.refresh();
        this.updateTitle();
    }

     onSelectingSymbol(symbol:string){

         // MA if user defined watchlist that not contains symbol, then add it
         if(this.watchlist.type == WatchlistType.UserDefined) {
             if(!(symbol in this.watchlist.symbols)){
                 this.accessor.watchlistService.addSymbolToWatchlist(this.watchlist, symbol);
                 this.slickGrid.refresh();
             }
         } else {
             let quote:Quote = this.quotes.find(quote => quote.symbol == symbol);
             if(!quote) {
                 let newSymbols: string[] = [];
                 this.getWatchlistQuotes().forEach(quote => newSymbols.push(quote.symbol));
                 newSymbols.push(symbol);
                 // let newWatchlistRequest:NewWatchlistRequest = {type: ChannelRequestType.NewWatchlist, caller: this, symbols:newSymbols};
                 // this.accessor.sharedChannel.request(newWatchlistRequest);
             }
         }
         let quote:Quote = this.quoteService.getQuotes().list.find(quote => quote.symbol == symbol);
         this.slickGrid.selectItem(quote.id);
    }

     onAddingSelectedSymbolToWatchlist(watchlist:Watchlist) {
         let symbol = this.getContextMenuItem().symbol;
         if(!(symbol in watchlist.symbols)){
             this.accessor.watchlistService.addSymbolToWatchlist(watchlist, symbol);
         }
    }

     onNewAlert() {
         // this.accessor.authorizationService.authorize(FeatureType.ALERT, () => {
         //     let company = this.accessor.marketsManager.getCompanyBySymbol(this.getContextMenuItem().symbol);
         //     let channelRequest: AlertChannelRequest = {
         //         type: ChannelRequestType.Alert,
         //         caller: this,
         //         alert: NormalAlert.createNewAlert(this.accessor.languageService.arabic ? 'arabic' : 'english', company)
         //     };
         //     this.accessor.sharedChannel.request(channelRequest);
         // })
    }

     onNewWatchlist() {
         let symbol = this.getContextMenuItem().symbol;
         // let newWatchlistRequest:NewWatchlistRequest = {type: ChannelRequestType.NewWatchlist, caller: this, symbols:[symbol]};
         // this.accessor.sharedChannel.request(newWatchlistRequest);
    }

     onRemoveCompany() {
         let symbol = this.getContextMenuItem().symbol;
         if(this.watchlist.type != WatchlistType.UserDefined) {
             let line1:string = this.accessor.languageService.translate("يمكنك الاضافة أو الحذف من لائحة أسهمي الخاصة بك.");
             let line2:string = this.accessor.languageService.translate("هل تريد إنشاء لائحة أسهمي جديدة؟");
             // let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: line1, messageLine2:line2, caller: this};
             // this.accessor.sharedChannel.request(confirmationRequest);
         } else {
             this.accessor.watchlistService.removeSymbolFromWatchlist(this.watchlist, symbol);
             this.slickGrid.refresh();
         }
     }

     onToggleIconColumn(column:string) {
        if(this.excludedIconColumns.includes(column)) {
            this.excludedIconColumns.splice(this.excludedIconColumns.indexOf(column), 1);
        } else {
            this.excludedIconColumns.push(column);
        }
        this.slickGrid.setColumns(this.getColumns());
        this.cd.markForCheck();
    }

    /* Data related */

    subscribeWithData(){

        this.subscriptions.push(
            this.quoteService.getSnapshotStream()
                .subscribe(
                    quotes => {
                            this.slickGrid.refresh();
                            this.slickGrid.invalidate();
                            window.setTimeout(() => {
                                if(AppBrowserUtils.isMobile()) {
                                    this.slickGrid.resizeColumnWidthsBasedOnTheirData();
                                }
                            }, 100)

                        },
                    error => Tc.error(error)
                )
        );

         this.subscriptions.push(
             this.quoteService.getUpdateStream()
                 .pipe(bufferTime(this.accessor.marketsManager.hasUsaMarket() ? 500 : 200)).subscribe(
                 (symbols: string[]) => {
                     if(0 < symbols.length) {
                         this.onRowUpdate(symbols)
                     }
                 },
                 error => Tc.error(error)
             )
         );
    }

    onWatchListUpdated(): void {
        this.onAfterSelectingWatchList();
    }

    protected onAfterSelectingWatchList(): void {
        let lastSubscribedSymbols = cloneDeep(this.subscribedSymbols);
        this.initQuote();
        this.subscribedSymbols = this.accessor.watchlistService.getWatchListSymbols(this.watchlist);
        this.subscribedSymbolsColumnsChanged(lastSubscribedSymbols, this.subscribedSymbols, this.selectedColumns, this.selectedColumns);
    }

    private initQuote() {
        this.setQuotes();
        this.initDataSource();
    }

    private setQuotes() {
        this.quotes = this.getWatchlistQuotes();
    }

    getWatchlistQuotes() {
        const quoteMap = new Map();
        this.quoteService.getQuotes().list.forEach(q => {
            quoteMap.set(q.symbol, q);
        });
        // Then map watchlist symbols to quotes
        let quotes:Quote[] = [];
        Object.keys(this.watchlist.symbols).forEach(symbol => {
            const quote = quoteMap.get(symbol);
            if (quote) {
                quotes.push(quote);
            }
        });
        return quotes;
    }

    private onRowUpdate(symbols:string[]){
         this.slickGrid.beginUpdate();
         symbols.forEach(symbol => {
             let quote:Quote = this.quotes.find(quote => quote.symbol == symbol);
             if(quote) {
                 this.slickGrid.updateItem(quote);
                 this.slickGrid.sortIfNeeded(quote.changeSet);
             }
         });
         this.slickGrid.endUpdate();

         symbols.forEach(symbol => {
             let quote:Quote = this.quotes.find(quote => quote.symbol == symbol);
             if(quote) {
                 this.slickGrid.flash(quote, quote.flashing.up, quote.flashing.down);
             }
         });

         this.updateTitle();
    }

    private initDataSource() {
        if(this.isGlobalPredefinedWatchListSelected) {
            this.quotes = this.getGlobalWatchlistQuotes();
        }

        this.slickGrid.setItems(this.quotes);
    }

    getGlobalWatchlistQuotes(): Quote[] {
        let globalWatchListQuotes = [];
        let sections = this.predefinedWatchlistService.getWatchListTemplate()[0].sections;
        let columns = this.getColumns();
        let firstColumnId = columns[0].id

        for(let section of sections) {
            let sectionQuote = this.getSectionQuote(section, firstColumnId);

            globalWatchListQuotes.push(sectionQuote);

            for(let company of section.companies) {
                let symbol  = this.accessor.marketsManager.getCompanyById(+company).symbol;
                let quote = this.quotes.find(quote => quote.symbol == symbol);
                if(quote){
                    globalWatchListQuotes.push(quote);
                }            }
        }
        return globalWatchListQuotes;
    }

    private getSectionQuote(section: WatchlistSections, firstColumnId: string): Quote {
        let sectionQuote: Quote = {
            id: section.id,
            arabic: '',
            english:'',
            name:'',
            symbol:``,
            index: false,
            sector: null,

            isSectionRow: true,
            flag: ``,
            flagAnnouncement:'',

            flashing: null,
            changeSet: null,

            open:0,
            high:0,
            low:0,
            close:0,
            last:0,
            lastVolume:0,
            previousClose:0,
            previousHigh:0,
            previousLow:0,
            volume:0,
            amount:0,
            trades:0,

            direction:'',
            change:0,
            changePercent:0,

            askVolume:0,
            askPrice:0,
            bidPrice:0,
            bidVolume:0,
            totalAskVolume:0,
            totalBidVolume:0,

            liquidityInflowValue:0,
            liquidityOutflowValue:0,
            liquidityInflowOrders:0,
            liquidityOutflowOrders:0,
            liquidityInflowVolume:0,
            liquidityOutflowVolume:0,
            liquidityNet:0,
            liquidityFlow:0,
            liquidityInflowPercent:0,

            date:'',
            time:'',

            week52High:0,
            week52Low:0,

            preOpenPrice:0,
            preOpenVolume:0,
            preOpenChange:0,
            preOpenChangePercentage:0,

            fairPrice:0,

            priceInIndex:0,
            changeInIndex:0,
            weightInIndex:0,
            weightInSector:0,
            effectOnIndex:0,
            effectOnSector:0,

            effectIndex: 0,
            effectSector: 0,

            limitUp:0,
            limitDown:0,
            maxLastVolume: 0,

            openingValue:0,
            openingVolume:0,
            openingTrades:0,

            valueOnClosingPrice:0,
            volumeOnClosingPrice:0,
            tradesOnClosingPrice:0,

            limitUpReached:false,
            limitDownReached:false,

            alert:null,
            news:null,
            analysis:null,

            issuedshares:0,
            freeshares:0,

            parvalue: 0,

            pivot:0,
            range:0,

            support1:0,
            support2:0,
            support3:0,
            support4:0,
            resistance1:0,
            resistance2:0,
            resistance3:0,
            resistance4:0,

            phigh:0,
            plow:0,
            alerttype:'',
            alertev:'',
            alerttime:'',
            marketalerts:null,
            technicalscope: null,

            isSubscriber: false,
            isRealTimeMarket: true,
        }

        let sectionName: string = this.accessor.languageService.arabic ? section.aname: section.name;

        sectionQuote[firstColumnId] = sectionName;

        return sectionQuote;
    }

    public onSelectingWatchlist(watchlist: Watchlist) {
        this.isGlobalPredefinedWatchListSelected = watchlist.id == this.predefinedWatchlistService.getGlobalPredefinedWatchlistId();

        super.onSelectingWatchlist(watchlist);
        this.updateColumnSortingDependingOnWatchlist(watchlist)
    }

    private updateColumnSortingDependingOnWatchlist(watchlist: Watchlist){
        if(watchlist.id == this.predefinedWatchlistService.getGlobalPredefinedWatchlistId()) {
            this.applySortingForColumns(false);
        }else {
            this.applySortingForColumns(true);
        }
    }

    private applySortingForColumns(sort: boolean) {
        let columns = this.getColumns();
        columns.forEach(column => {column.sortable = sort;});
        this.slickGrid.setColumns(columns)
    }

    /* filter property */

     get filter():Filter {
        if(!this.marketwatchProperties.filterId){
            this.marketwatchProperties.filterId = this.filterService.getDefaultFilter().id;
        }
        if(this.filterService.isDeleted(this.marketwatchProperties.filterId)){
            this.marketwatchProperties.filterId = this.filterService.getDefaultFilter().id;
            this.cd.markForCheck();
        }
        return this.filterService.get(this.marketwatchProperties.filterId);
    }
     set filter(filter:Filter) {
        this.marketwatchProperties.filterId = filter.id;
    }

    /* excluded icon columns */

     get excludedIconColumns():string[] {
        if(!this.marketwatchProperties.excludedIconColumns){
            this.marketwatchProperties.excludedIconColumns = [];
        }
        return this.marketwatchProperties.excludedIconColumns;
    }
     set excludedIconColumns(excludedIconColumns:string[]) {
        this.marketwatchProperties.excludedIconColumns = excludedIconColumns;
    }

    /* template helpers */
    getContextMenuWatchlists():Watchlist[] {
        let watchlists = this.accessor.watchlistService.getUserDefinedWatchlists().slice(0); // clone
        let index = watchlists.indexOf(this.watchlist);
        if(index !== -1) {
            watchlists.splice(index, 1);
        }
        return watchlists;
    }

    get iconColumnIds():string[] {
        return Object.keys(this.iconColumns);
    }

    isVisitor():boolean {
         return this.accessor.authorizationService.isVisitor();
    }

    isDesktop():boolean {
         return AppBrowserUtils.isDesktop();
    }

    isMobile():boolean {
        return AppBrowserUtils.isMobile();
    }

    /* title */
    updateTitle() {
         let title:string;
        // MA if grid has a filter, then append number of rows in the grid to the title
        if(this.slickGrid && (this.filter.id != 'no-filter') ) {
            title = this.watchlist.type == WatchlistType.UserDefined ? `${this.watchlist.name} [${this.slickGrid.numberOfRows()}]` : `${this.accessor.languageService.translate(this.watchlist.name)} [${this.slickGrid.numberOfRows()}]`;
        } else {
            title = this.watchlist.type == WatchlistType.UserDefined ? `${this.watchlist.name}` : this.accessor.languageService.translate(this.watchlist.name);
        }
        if(this.title != title) {
            this.title = title; // don't change ref unless title is changed
            this.cd.markForCheck();
        }
    }

    /* news and analysis */

    private openNewsOrAnalysisScreen(quote: Quote): void {
        /*
            NK Priority rules:
               1. not-viewed news.
               2. not-viewed analysis.
               3. viewed news.
               4. viewed analysis.
        */

        let openNews:boolean = false,
            openAnalysis:boolean = false,
            news:News = quote.news,
            analysis:Analysis = quote.analysis;

        let nonViewedNews: boolean = news && !news.viewed;
        let viewedNews: boolean = news && news.viewed;
        let nonViewedAnalysis: boolean = analysis && !analysis.viewed;
        let viewedAnalysis: boolean = analysis && analysis.viewed;

        if (nonViewedNews) {
            openNews = true;
        } else if (nonViewedAnalysis) {
            openAnalysis = true;
        } else if (viewedNews) {
            openNews = true;
        } else if (viewedAnalysis) {
            openAnalysis = true;
        }

        if(openNews){
            this.openNews(quote);
        }else if(openAnalysis){
            this.openAnalysis(quote);
        }
    }

    private openNews(quote:Quote):void{
        // let channelRequest:NewsDetailsRequest = {type: ChannelRequestType.News, news:quote.news};
        // this.accessor.sharedChannel.request(channelRequest);
        // this.newsService.markAsViewed(quote.news);
        // this.slickGrid.updateItem(quote);
    }

    private openAnalysis(quote:Quote):void{
        this.openAnalysisCenter(quote.analysis);
        this.analysisService.markAnalysisAsViewed(quote.analysis);
        this.cd.markForCheck();
    }

    get marketwatchProperties(): MarketwatchProperties {
        return <MarketwatchProperties>this.p;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    // MA THIS IS JUST ADDED TO AUTOMATICALLY forceFitColumns ON MINI MARKET WATCH THAT IS USED
    // AS WATCHLIST FOR OTHER SCREENS (LIKE THE CHART)

    private forceFitColumns(columnIds?:string[]):boolean {
        if(!columnIds) {
            columnIds = this.getColumns().map(column => column.id);
        }
        let forceFitColumnIds = ['flag', 'alert', 'news', 'symbol', 'name', 'close', 'last'];
        for(let i = 0; i < columnIds.length; ++i){
            if(!forceFitColumnIds.includes(columnIds[i])){
                return false;
            }
        }
        return true;
    }

    protected afterGridColumnsChange(): void {
        let lastSubscribedColumns = cloneDeep(this.selectedColumns);
        this.selectedColumns = this.slickGridBoxProperties.gridColumns;
        this.subscribedSymbolsColumnsChanged(this.subscribedSymbols, this.subscribedSymbols, lastSubscribedColumns, this.selectedColumns);
    }

    /* Subscription */
    private subscribedSymbolsColumnsChanged(lastSubscribedSymbols: string[], newSubscribedSymbols: string[], lastSubscribedColumns: GridColumn[], newSubscribedColumns: GridColumn[]): void {
        let removeSymbols = lastSubscribedSymbols.filter(symbol => !newSubscribedSymbols.includes(symbol));
        if(removeSymbols.length > 0) {
            this.quoteService.unSubscribeQuotes(removeSymbols);
        }

        let addSymbols = newSubscribedSymbols.filter(symbol => !lastSubscribedSymbols.includes(symbol));
        if(addSymbols.length > 0) {
            this.quoteService.subscribeQuotes(addSymbols);
        }

        let lastColumns = lastSubscribedColumns.map(col => col.id);
        let newColumns = newSubscribedColumns.map(col => col.id);

        // handle technical indicator columns
        let removeColumns = lastColumns.filter(colId => !newColumns.includes(colId));
        for (let columnId of removeColumns) {
            let technicalIndicatorColumns = TechnicalIndicatorColumns.getColumnByName(columnId);
            if (technicalIndicatorColumns) {
                this.accessor.marketsManager.getAllMarkets().forEach(market => {
                    this.technicalIndicatorQuoteService.unSubscribeTopic(market.abbreviation, technicalIndicatorColumns.topic);
                });
            }
        }

        let addColumns = newColumns.filter(colId => !lastColumns.includes(colId));
        for (let columnId of addColumns) {
            let technicalIndicatorColumns = TechnicalIndicatorColumns.getColumnByName(columnId);
            if (technicalIndicatorColumns) {
                this.accessor.marketsManager.getAllMarkets().forEach(market => {
                    this.technicalIndicatorQuoteService.subscribeTopic(market.abbreviation, technicalIndicatorColumns.topic);
                });
            }
        }

        // handle technical scope columns
        let technicalScopeColumnId = 'technicalscope';
        let hasTechnicalScopeColumn = lastColumns.includes(technicalScopeColumnId) || newColumns.includes(technicalScopeColumnId);
        if(hasTechnicalScopeColumn) {
            let symbolsChanged: boolean = removeSymbols.length > 0 || addSymbols.length > 0;
            if(symbolsChanged) {
                if(removeSymbols.length > 0) {
                    this.technicalScopeQuoteService.unSubscribeTopic(removeSymbols);
                }
                if(addSymbols.length > 0) {
                    this.technicalScopeQuoteService.subscribeTopic(addSymbols);
                }
            } else {
                if(removeColumns.includes(technicalScopeColumnId) && lastSubscribedSymbols.length > 0) {
                    this.technicalScopeQuoteService.unSubscribeTopic(lastSubscribedSymbols);
                }
                if(newColumns.includes(technicalScopeColumnId) && newSubscribedSymbols.length > 0) {
                    this.technicalScopeQuoteService.subscribeTopic(newSubscribedSymbols);
                }
            }
        }
    }

    public getSymbolSelectorPlaceHolderText() {
        return this.languageService.translate('أدخل إسم أو رمز الشركة للبحث عنها أو إضافتها');
    }

    protected getColumnsCategories(): MarketWatchCategory[] {
        return MarketWatchCategory.getAllCategories();
    }

    isMiniMarketWatch(){
        return this.marketwatchProperties.miniMarketWatch;
    }

    public isColumnEditingAllowed(): boolean {
        if(this.accessor.authorizationService.isRegistered()) {
            return !this.isMiniMarketWatch()
        }
        return this.accessor.authorizationService.isSubscriber();
    }

    showContextMenu(item: Quote, left: number, top: number, columnId:string ): void {
        if (item.isSectionRow) {
            return; //Menu will not show in sections
        }
        super.showContextMenu(item, left, top, columnId);
    }

    isAuthorizedGridBox(featureType: FeatureType) {
        return this.accessor.authorizationService.authorizeFeature(featureType);
    }
}

interface MarketwatchProperties extends MarketBoxProperties {
    filterId?:string;
    excludedIconColumns?:string[],
    miniMarketWatch?: boolean // Chart market watch --> in Default workspace only
}
