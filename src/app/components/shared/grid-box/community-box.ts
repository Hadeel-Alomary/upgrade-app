import {GridBox, GridBoxProperties} from './grid-box';
import {GridData} from '../slick-grid/slick-grid';
import {Accessor, AutoLinkType, ChannelRequestType, SymbolBoxOpenRequest, Watchlist} from '../../../services';
import {AppBrowserUtils} from '../../../utils';
import {ChangeDetectorRef} from '@angular/core';
import {GridBoxType} from './grid-box-type';

export abstract class CommunityBox<T extends CommunityBoxProperties, D extends CommunityBoxData> extends GridBox<T> {

    contextMenu:{left:number, top:number, item:D} = {left:0, top:0, item: null};
    public inputWatchlistId:string; //@Input


    constructor(public cd: ChangeDetectorRef, public accessor:Accessor) {
        super(accessor);
    }

    protected setInputWatchlistIfExisted(){
        // NK we need this check because we do not save the inputWatchlistId in the state so,
        // after loading the application the existing boxes will come with their watchlists and inputWatchlistId will be null
        if(this.inputWatchlistId){
            this.watchlist = this.accessor.watchlistService.get(this.inputWatchlistId);
            this.cd.markForCheck();
        }
    }

    public openWindow(window:GridBoxType){
        let item:D = this.getContextMenuItem();
        let openRequest:SymbolBoxOpenRequest = {
            type:ChannelRequestType.OpenSymbol,
            gridBoxType:window,
            symbol:item.symbol
        };
        this.accessor.sharedChannel.request(openRequest);
    }

    public get autoLink():AutoLinkType {
        if(!this.communityBoxProperties.autoLink){
            this.communityBoxProperties.autoLink = this.getDefaultAutoLinkType();
        }
        return this.communityBoxProperties.autoLink;
    }

    public set autoLink(autoLink:AutoLinkType) {
        this.communityBoxProperties.autoLink = autoLink;
    }

    autoLinkSelectedCompany(symbol:string) {
        this.accessor.autoLinkService.push(this.autoLink, this.pageId, symbol);
    }

    public getDefaultAutoLinkType():AutoLinkType {
        return AutoLinkType.None;
    }

    public get watchlist():Watchlist {
        if(!this.communityBoxProperties.watchlistId){
            this.communityBoxProperties.watchlistId = this.accessor.watchlistService.getDefaultPredefinedWatchlistId();
        }
        if(this.accessor.watchlistService.isDeleted(this.communityBoxProperties.watchlistId)){
            this.communityBoxProperties.watchlistId = this.accessor.watchlistService.getDefaultPredefinedWatchlistId();
            this.cd.markForCheck();
        }
        return this.accessor.watchlistService.get(this.communityBoxProperties.watchlistId);
    }

    public set watchlist(watchlist:Watchlist) {
        this.communityBoxProperties.watchlistId = watchlist.id;
    }

    public onSelectingWatchlist(watchlist:Watchlist){
        if(watchlist.id == this.watchlist.id) {
            return;
        }
        this.watchlist = watchlist;
    }

    public showContextMenu(event:MouseEvent , item:D) {
        if(AppBrowserUtils.isDesktop()) {
            this.openContextMenu(event.clientX, event.clientY, item);
            this.cd.markForCheck();
        }
    }

    protected openContextMenu(left:number, top:number, item:D) {
        this.contextMenu = {left: left, top: top, item: item};
    }

    public getContextMenuPosition():{x:number, y:number}{
        return {x: this.contextMenu.left, y:this.contextMenu.top};
    }

    protected getContextMenuItem() {
        return this.contextMenu.item;
    }

    get communityBoxProperties():CommunityBoxProperties {
        return <CommunityBoxProperties>this.p;
    }

}

export interface CommunityBoxProperties extends GridBoxProperties {
    autoLink?:AutoLinkType;
    watchlistId?:string;
}

export interface CommunityBoxData extends GridData {
    symbol:string
}
