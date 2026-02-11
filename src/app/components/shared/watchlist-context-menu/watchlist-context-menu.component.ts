import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {GridBoxType} from '../grid-box';
import {AbstractAlert, Accessor, ChannelRequestType, NormalAlert, Watchlist, WatchlistType} from '../../../services';
import {FeatureType} from '../../../services/auhtorization/feature';
import {AlertChannelRequest, AlertChannelRequestCaller, ConfirmationCaller, ConfirmationRequest, NewWatchlistCaller, NewWatchlistRequest} from '../../modals';
import {TradingContextMenuComponent} from '../trading-context-menu';
import {BoxContextMenuComponent} from '../box-context-menu/box-context-menu.component';
import {ContextMenuDirective} from '../context-menu/context-menu.directive';
import {NgIf, NgIfContext} from '@angular/common';

@Component({
    standalone:true,
    selector:'watchlist-context-menu',
    templateUrl:'./watchlist-context-menu.component.html',
    styleUrls:['./watchlist-context-menu.component.css'],
    encapsulation:ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:[TradingContextMenuComponent,BoxContextMenuComponent,ContextMenuDirective,NgIf]
})

export class WatchlistContextMenuComponent  implements  AlertChannelRequestCaller , NewWatchlistCaller , ConfirmationCaller  {

    @Input() canRemoveCompany:boolean = true;
    @Input()  isToolbarShown: boolean;
    @Input()  watchlist: Watchlist;
    @Input() contextMenuData : {left:number,top:number,name:string,symbol:string};

    @Output() onWatchListUpdated = new EventEmitter();
    @Output() onChangeWatchlist:EventEmitter<Watchlist> = new EventEmitter<Watchlist>();
    @Output() onRefreshSlickGrid = new EventEmitter();

    @Output() outputBoxType:EventEmitter<GridBoxType> = new EventEmitter<GridBoxType>();
    @Output() onToggleToolbarVisibility = new EventEmitter();
    public FeatureType = FeatureType;


    constructor(public accessor: Accessor) {
        this.accessor.sharedChannel.getRequestStream().subscribe((request) => {
            if (request.type == ChannelRequestType.UserDefinedWatchListUpdated || request.type == ChannelRequestType.PredefinedWatchlistUpdated) {
                this.onWatchListUpdated.emit();
            }
        });
    }

    public isVisitor():boolean {
        return this.accessor.authorizationService.isVisitor();
    }

    private getWatchListSymbols():string[] {
        return this.accessor.watchlistService.getWatchListSymbols(this.watchlist);
    }

    public onNewAlert() {
        this.accessor.authorizationService.authorize(FeatureType.ALERT, () => {
            let company = this.accessor.marketsManager.getCompanyBySymbol(this.contextMenuData.symbol);
            let channelRequest: AlertChannelRequest = {
                type: ChannelRequestType.Alert,
                caller: this,
                alert: NormalAlert.createNewAlert(this.accessor.languageService.arabic ? 'arabic' : 'english', company)
            };
            this.accessor.sharedChannel.request(channelRequest);
        })
    }

    onAlertModalClose(alert: AbstractAlert):void {}

    public getContextMenuWatchlists():Watchlist[] {
        let watchlists = this.accessor.watchlistService.getUserDefinedWatchlists().slice(0); // clone

        if(this.watchlist) {
            let index = watchlists.indexOf(this.watchlist);
            if(index !== -1) {
                watchlists.splice(index, 1);
            }
        }

        return watchlists;
    }

    public onAddingSelectedSymbolToWatchlist(watchlist:Watchlist) {
        let symbol = this.contextMenuData.symbol;
        if(!(symbol in watchlist.symbols)){
            this.accessor.watchlistService.addSymbolToWatchlist(watchlist, symbol);
        }
    }

    public onNewWatchlist() {
        if (!this.canRemoveCompany) {
            return;
        }
        let symbol = this.contextMenuData.symbol;
        let newWatchlistRequest:NewWatchlistRequest = {type: ChannelRequestType.NewWatchlist, caller: this, symbols:[symbol]};
        this.accessor.sharedChannel.request(newWatchlistRequest);
    }

    onWatchlistCreated(watchlist:Watchlist) {
        let message:string = this.accessor.languageService.translate("هل تريد عرض لائحة أسهمي الجديدة؟");
        let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: message, param: watchlist, caller: this};
        this.accessor.sharedChannel.request(confirmationRequest);
    }

    onConfirmation(confirmed:boolean, param:unknown){
        if(confirmed) {
            if(param) { // view created watchlist
                this.onChangeWatchlist.emit(param as Watchlist);
                this.onWatchListUpdated.emit();
                this.onRefreshSlickGrid.emit();
            } else { // create watchlist to remove company
                let symbols = this.getWatchListSymbols();
                let removedSymbol = this.contextMenuData.symbol;
                symbols.splice(symbols.indexOf(removedSymbol), 1);
                let newWatchlistRequest:NewWatchlistRequest = {type: ChannelRequestType.NewWatchlist, caller: this, symbols: symbols};
                this.accessor.sharedChannel.request(newWatchlistRequest);
            }
        }
    }

    public onRemoveCompany() {
        let symbol = this.contextMenuData.symbol;
        if(this.watchlist.type != WatchlistType.UserDefined) {
            let line1:string = this.accessor.languageService.translate("يمكنك الاضافة أو الحذف من لائحة أسهمي الخاصة بك.");
            let line2:string = this.accessor.languageService.translate("هل تريد إنشاء لائحة أسهمي جديدة؟");
            let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: line1, messageLine2:line2, caller: this};
            this.accessor.sharedChannel.request(confirmationRequest);
        } else {
            this.accessor.watchlistService.removeSymbolFromWatchlist(this.watchlist, symbol);
            this.onRefreshSlickGrid.emit();
        }
    }

    public openWindow(boxType:GridBoxType): void {
        this.outputBoxType.emit(boxType)
    }

    public toggleToolbarVisibility() : void {
        this.onToggleToolbarVisibility.emit();
    }

    public isAuthorizedGridBox(featureType: FeatureType) {
        return this.accessor.authorizationService.authorizeFeature(featureType);
    }
}
