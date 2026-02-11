import {ChangeDetectorRef} from '@angular/core';
import {SlickGridBox, SlickGridBoxProperties} from './slick-grid-box';
import {GridBoxType} from './grid-box-type';
import {Accessor, AutoLinkType, ChannelRequestType, Company, Market, SymbolBoxOpenRequest} from '../../../services/index';
import {AppBrowserUtils, Tc} from '../../../utils/index';
import {Subscription} from 'rxjs/internal/Subscription';
import {GridData} from '../slick-grid/slick-grid';
import {AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';

export abstract class SymbolBox<T extends SymbolBoxProperties,  D extends GridData> extends SlickGridBox<T, D>  {

    autoLinkSubscription: Subscription;
    private isOverlayMaximized:boolean = false;

    constructor(public cd: ChangeDetectorRef, public accessor:Accessor) {
        super(cd, accessor);
    }

    /* properties */

    protected loadProperties():boolean {
        let result:boolean = super.loadProperties();

        this.handleSelectedSymbol();

        if(result && this.symbolProperties.autoLink) {
            this.subscribeAutoLink();
        }
        return result;
    }

    private handleSelectedSymbol() : void {
        if (this.symbolProperties.selectedSymbol) {
            if (!this.accessor.marketsManager.getMarketBySymbol(this.symbolProperties.selectedSymbol)) {
                this.symbolProperties.selectedSymbol = this.accessor.marketsManager.getDefaultSymbol();
            }
        }

        // Added due to a client error where the workspace has a selectedSymbol = "" , in (CompanyFinancialStatementsComponent) specifically .
        if(this.symbolProperties.selectedSymbol == "") {
            this.symbolProperties.selectedSymbol = this.accessor.marketsManager.getDefaultSymbol();
        }
    }

     get symbolProperties():SymbolBoxProperties {
        return <SymbolBoxProperties> this.p;
    }

    /* loading symbol */

    loadSymbol: string; // @input

    protected abstract onSymbolChange():void;

    previousSymbol:string;
    company: Company;
    market: Market;

    public onSelectingSymbol(symbol:string, pushAutoLink:boolean = true){
        if(!symbol){
            return;
        }
        // MA with multi-market, we may get a symbol from previous subscription (for which market is not subscribed with anymore)
        // for this case, ignore the selection of this symbol
        let market = this.accessor.marketsManager.getMarketBySymbol(symbol);
        if(!market){
            Tc.warn('Unknown market for symbol: ' + symbol);
            return;
        }

        this.previousSymbol = this.symbolProperties.selectedSymbol;
        this.symbolProperties.selectedSymbol = symbol;
        this.company = this.accessor.marketsManager.getCompanyBySymbol(symbol);
        this.market = this.accessor.marketsManager.getMarketBySymbol(symbol);
        this.onSymbolChange();

        if(pushAutoLink) {
            this.accessor.autoLinkService.push(this.symbolProperties.autoLink, this.pageId, this.symbolProperties.selectedSymbol);
        }

    }

    public initSymbolSelection() {
        if(this.loadSymbol) {
            this.onSelectingSymbol(this.loadSymbol);
            this.loadSymbol = null;
            window.setTimeout(() => this.cd.markForCheck(), 0);
        } else if(this.accessor.miscStateService.hasInitialSymbol() && this.accessor.marketsManager.hasCompany(this.accessor.miscStateService.getInitialSymbol())) {
            this.onSelectingSymbol(this.accessor.miscStateService.getInitialSymbol());
            window.setTimeout(() => this.cd.markForCheck(), 0);
        } else if(this.symbolProperties.selectedSymbol){
            this.mapSymbolToIndexIfNoSubscriptionExists();
            this.onSelectingSymbol(this.symbolProperties.selectedSymbol);
            window.setTimeout(() => this.cd.markForCheck(), 0);
        }
    }

    private mapSymbolToIndexIfNoSubscriptionExists() {
        // MA if user is not subscribed anymore to the symbol's market, then map the symbol to the index
        if (!this.accessor.marketsManager.getMarketBySymbol(this.symbolProperties.selectedSymbol)) {
            this.symbolProperties.selectedSymbol = this.accessor.marketsManager.getDefaultMarket().getGeneralIndex().symbol;
        }
    }

    showContextMenu(item:D,left:number, top:number,columnId:string) {
        if(AppBrowserUtils.isDesktop()) {
            this.openContextMenu(left, top, item , columnId);
            this.cd.markForCheck();
        }
    }

    /* auto link */

    public get autoLink():AutoLinkType {
        if(!this.symbolProperties.autoLink){
            this.symbolProperties.autoLink = AutoLinkType.None;
        }
        return this.symbolProperties.autoLink;
    }

    public set autoLink(autoLink:AutoLinkType) {
        this.symbolProperties.autoLink = autoLink;
        this.subscribeAutoLink();
    }

    /* open another window window */

    public openWindow(window:GridBoxType){
        let openRequest:SymbolBoxOpenRequest = {
            type:ChannelRequestType.OpenSymbol,
            gridBoxType:window,
            symbol:this.symbolProperties.selectedSymbol
        };
        this.accessor.sharedChannel.request(openRequest);
    }

     subscribeAutoLink() {

        let autoLink:AutoLinkType = this.symbolProperties.autoLink;

        if(this.autoLinkSubscription) {
            this.autoLinkSubscription.unsubscribe();
        }

        if(autoLink != AutoLinkType.None){
            this.autoLinkSubscription = this.accessor.autoLinkService.getStream()
                .subscribe(autolinkInfo => {
                    // MA for mobile, auto-link work across tabs (or pages)
                    if((AppBrowserUtils.isMobile() || autolinkInfo.pageId == this.pageId) &&
                        autoLink == autolinkInfo.autoLinkType &&
                        this.symbolProperties.selectedSymbol != autolinkInfo.symbol) {
                        this.onSelectingSymbol(autolinkInfo.symbol, false);
                    }
                });
        }
    }

    /* onDestroy */

    protected onDestroy() {
        super.onDestroy();
        if(this.autoLinkSubscription) {
            this.autoLinkSubscription.unsubscribe();
            this.autoLinkSubscription = null;
        }
    }

    public onToggleOverlayBoxMaximized(maximized: boolean) {
        if (this.slickGrid) {
            this.slickGrid.toggleScrollable(maximized);
        }
        maximized ? this.showToolbar() : this.hideToolbar();
        this.isOverlayMaximized = maximized;
        this.toggleOverlayBoxMaximized.emit({maximized: maximized, id: this.id});
    }

    public isOverlayBoxMaximized():boolean {
        return this.isOverlayMaximized;
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.accessor.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

}

export interface SymbolBoxProperties extends SlickGridBoxProperties {
    selectedSymbol?:string;
    autoLink?:AutoLinkType;
}
