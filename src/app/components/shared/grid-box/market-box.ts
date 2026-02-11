import {ChangeDetectorRef} from '@angular/core';
import {SlickGridBox, SlickGridBoxProperties} from './slick-grid-box';
import {GridBoxType} from './grid-box-type';
import {Accessor, AutoLinkType, ChannelRequestType, SymbolBoxOpenRequest, Watchlist, WatchlistType} from '../../../services/index';
import {AppBrowserUtils} from '../../../utils';
import {GridData} from '../slick-grid/slick-grid';
import {OverlayBoxesContainerChannelRequest} from '../../../services/shared-channel/channel-request';

export abstract class MarketBox<T extends SlickGridBoxProperties, D extends MarketGridData> extends SlickGridBox<T, D>  {

    constructor(public cd: ChangeDetectorRef, public accessor:Accessor) {
        super(cd, accessor);

        this.subscriptions.push(
            this.accessor.sharedChannel.getRequestStream().subscribe( request => {
                if(request.type == ChannelRequestType.WatchlistRefresh) {
                    if(this.slickGrid) {
                        this.slickGrid.refresh();
                    }
                    this.updateTitle();
                    this.cd.markForCheck();
                }
            })
        );

    }

    /* input watchlist */

    public inputWatchlistId:string; //@Input

    protected setInputWatchlistIfExisted(){
        // NK we need this check because we do not save the inputWatchlistId in the state so,
        // after loading the application the existing boxes will come with their watchlists and inputWatchlistId will be null
        if(this.inputWatchlistId){
            this.watchlist = this.accessor.watchlistService.get(this.inputWatchlistId);
            this.cd.markForCheck();
        }
    }

    getContextMenuItem(): D {
        // in component.html getContextMenuItem()?.symbol in red color with note "Unresolved variable"
        return super.getContextMenuItem();
    }

    /* slick grid host functions */
    showContextMenu(item:D, left:number, top:number, columnId:string) {
        if(AppBrowserUtils.isDesktop()) {
            this.openContextMenu(left, top, item, columnId);
            this.cd.markForCheck();
        }
    }

    onGridMouseOver(item: D, left: number, top: number, target?: EventTarget) {
        let isAnnotationElement = (target as Element).closest('.annotation-delayed-icon');
        let isUpgradeAnnotation =  (target as Element).closest('.upgrade-icon');

        if (isAnnotationElement) {
            this.openAnnotationDelayed(left, top, item);
            this.cd.markForCheck();
        }
        if (isUpgradeAnnotation) {
            this.openUpgradeAnnotation(left, top, item);
            this.cd.markForCheck();
        }
    }


    /* open symbol in window */

    public openWindow(window:GridBoxType){
        let item:D = this.getContextMenuItem();
        let openRequest:SymbolBoxOpenRequest = {
            type:ChannelRequestType.OpenSymbol,
            gridBoxType:window,
            symbol:item.symbol
        };
        this.accessor.sharedChannel.request(openRequest);
    }

    /* auto link */

    public get autoLink():AutoLinkType {
        if(!this.marketProperties.autoLink){
            this.marketProperties.autoLink = this.getDefaultAutoLinkType();
        }
        return this.marketProperties.autoLink;
    }

    public set autoLink(autoLink:AutoLinkType) {
        this.marketProperties.autoLink = autoLink;
    }

    public getDefaultAutoLinkType():AutoLinkType {
        return AutoLinkType.None;
    }

    onGridItemSelected(item:D){
        // wire AutoLink to Grid selection
        this.accessor.autoLinkService.push(this.autoLink, this.pageId, item.symbol);
    }

    /* watchlist */

    public get watchlist():Watchlist {
        if(!this.marketProperties.watchlistId){ // if the watchlist is not set then show default watchlist
            this.marketProperties.watchlistId = this.accessor.watchlistService.getDefaultPredefinedWatchlistId();
        }
        if(this.accessor.watchlistService.isDeleted(this.marketProperties.watchlistId)){
            this.marketProperties.watchlistId = this.accessor.watchlistService.getDefaultPredefinedWatchlistId();
            this.cd.markForCheck();
        }
        return this.accessor.watchlistService.get(this.marketProperties.watchlistId);
    }
    public set watchlist(watchlist:Watchlist) {
        this.marketProperties.watchlistId = watchlist.id;
        if(watchlist.symbols && Object.keys(watchlist.symbols).length == 0 && watchlist.type == WatchlistType.UserDefined) {
            this.onSelectingEmptyWatchlist();
        }
    }

    public onSelectingEmptyWatchlist(){}

    public reloadHistoricalData(){}

    protected onAfterSelectingWatchList(): void {}

    public onSelectingWatchlist(watchlist:Watchlist){
        if(watchlist.id == this.watchlist.id) {
            return;
        }

        let needUpdateData:boolean = !this.accessor.watchlistService.doBelongToSameMarket(watchlist, this.watchlist);
        this.watchlist = watchlist;
        if(needUpdateData) {
            this.reloadHistoricalData();
        }

        // HA : update quotes then refresh grid .
        this.onAfterSelectingWatchList();

        if(this.slickGrid) {
            this.slickGrid.refresh();
        }
        this.updateTitle();

    }

    onGridClick(item: MarketGridData, left: number, top: number, row: number, column: number, target?: EventTarget) {
        if (AppBrowserUtils.isMobile()) {
            this.showOverlayBoxesContainer(item.symbol, OverlayBoxesContainerEventType.CLICK);
        }
    }

    onGridLongPress(item: MarketGridData, row: number, column: number) {
        if (AppBrowserUtils.isMobile())
            this.showOverlayBoxesContainer(item.symbol, OverlayBoxesContainerEventType.CLICK);
    }

    private showOverlayBoxesContainer(symbol:string, eventType:OverlayBoxesContainerEventType) {
        let channelRequest:OverlayBoxesContainerChannelRequest = {type: ChannelRequestType.OverlayBoxesContainer , symbol:symbol , eventType:eventType};
        this.accessor.sharedChannel.request(channelRequest);
    }

    /* properties */

     get marketProperties():MarketBoxProperties {
        return <MarketBoxProperties>this.p;
    }

    protected updateTitle(): void {}

    //Watchlist ContextMenu functions
    getWatchlistContextMenuData(): { left: number, top: number, name: string, symbol: string } {
        let data = {left: 0 ,top: 0, name: '', symbol: ''};
        let contextMenu = this.contextMenu;
        let contextMenuItem = this.getContextMenuItem();

        if (this.contextMenu) {
            data.left = contextMenu.left;
            data.top = contextMenu.top;
        }
        if (contextMenuItem) {
            data.name = (contextMenuItem as D & { name: string }).name;
            data.symbol = contextMenuItem.symbol;
        }
        return data;
    }

    changeWatchlist(watchlist:Watchlist) {
        this.watchlist = watchlist;
    }

    onWatchListUpdated() {
        this.onAfterSelectingWatchList();
    }



}

export interface MarketBoxProperties extends SlickGridBoxProperties {
    autoLink?:AutoLinkType;
    watchlistId?:string;
}

export interface MarketGridData extends GridData {
    symbol:string
}

export enum OverlayBoxesContainerEventType {
    CLICK = 1,
    HIDE
}
