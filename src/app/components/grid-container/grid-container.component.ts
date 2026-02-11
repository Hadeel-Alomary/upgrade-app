import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {GridBoxType} from '../shared/grid-box/index';
import {GridComponent} from '../grid/grid.component';
import {AppModeAuthorizationService, AutoLinkService, ChannelRequest, ChannelRequestType, MarketsManager, Page, PageService, SharedChannel, TradingService, WatchlistService} from '../../services/index';
import {SubscriptionLike as ISubscription} from 'rxjs';
import {BrokerType} from '../../services/trading/broker/broker';
import {AppBrowserUtils} from '../../utils';
import {AppModeFeatureType} from '../../services/auhtorization/app-mode-authorization';


@Component({
    selector: 'grid-container',
    templateUrl:'./grid-container.component.html',
    styleUrls:['./grid-container.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class GridContainerComponent implements OnDestroy {

    @Input() selectedPage:Page;

    @ViewChildren(GridComponent) grids:QueryList<GridComponent>;

     pages:Page[];

    showTradingToolbar:boolean;

     subscriptions:ISubscription[] = [];

    @ViewChild('gridContainer') gridContainerElement: ElementRef;

    constructor( public autoLinkService:AutoLinkService,
                 public pageService:PageService,
                 public marketsManager:MarketsManager,
                 public sharedChannel:SharedChannel,
                 public tradingService:TradingService,
                 private watchlistService: WatchlistService,
                 private appModeAuthorizationService: AppModeAuthorizationService,
                 public cd:ChangeDetectorRef){

        this.pages = this.pageService.getPages();

        this.sharedChannel.getRequestStream().subscribe((request:ChannelRequest) => {
            if(request.type == ChannelRequestType.WorkspaceRefresh) {
                this.pages = this.pageService.getPages();
                this.cd.markForCheck();
            }
        })

        this.subscriptions.push(this.tradingService.getSessionStream()
            .subscribe(validSession => this.onTradingSession(validSession)));

        this.subscriptions.push(this.tradingService.getBrokerSelectionStream()
            .subscribe(brokerType => this.onBrokerSelection(brokerType)));

    }

    public gridContainerSize():{width:number,height:number} {
        return {width:this.gridContainerElement.nativeElement.offsetWidth , height:this.gridContainerElement.nativeElement.offsetHeight}
    }

    ngOnDestroy(){
        for(let subscription of this.subscriptions){
            subscription.unsubscribe();
        }
        this.subscriptions = [];
    }

    /* trading */

    onTradingConnect(connect:boolean):void{
        if(!connect && this.grids){
            for(let grid of this.grids.toArray()){
                grid.removeTradingBoxes();
            }
        }
    }

    onTradingSession(validSession:boolean){
        this.showTradingToolbar = validSession;
    }

    /* template events */

     onAddMarketBox(type:GridBoxType) {
        this.grids.toArray().find(grid => grid.page == this.selectedPage)
            .addMarketBox(type, this.watchlistService.getDefaultPredefinedWatchlistId());
    }


     onAddSymbolBox(type:GridBoxType) {
        // MA when opening a symbol box, try to pick a "meaningful" symbol to view initally in the box
        this.grids.toArray().find(grid => grid.page == this.selectedPage)
            .addSymbolBox(type, this.getLastSelectedSymbolOnPage());
    }

    /* misc */
     getLastSelectedSymbolOnPage():string {
        // MA pick last selected symbol on page, and if none, the first symbol in market
        var symbol = this.autoLinkService.getLastSelectedSymbol(this.selectedPage.guid);
        if(!symbol) {
            symbol = this.marketsManager.getDefaultMarket().getFirstSortedCompany().symbol;
        }
        return symbol;
    }

    onBrokerSelection(brokerType: BrokerType): void {
         if(!this.appModeAllowedFeature(AppModeFeatureType.SELECT_DERAYAH_BROKER)) {
             if(brokerType == BrokerType.None) {
                 if(this.grids){
                     for(let grid of this.grids.toArray()){
                         grid.removeTradingBoxes();
                     }
                 }
             }
         }
    }

    private appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

    isDesktop():boolean {
         return AppBrowserUtils.isDesktop();
    }


}
