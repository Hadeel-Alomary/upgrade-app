import {Injectable} from '@angular/core';
import {Watchlist, WatchlistType} from './watchlist';
import {StringUtils, Tc, AppTcTracker} from '../../../utils/index';
import {WatchlistLoader} from '../../loader/watchlist-loader';
import {Market} from '../../loader/loader/market';
import {LanguageService, StateKey, WorkspaceStateService} from '../../state/index';
// import {ArrayUtils} from 'tc-web-chart-lib';
import {MarketsManager} from '../../loader/loader/markets-manager';
import {Loader} from '../../loader/loader';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {AuthorizationService} from '../../auhtorization';
// import {MessageBoxRequest} from '../../../components/modals/popup/message-box';
import {PredefinedWatchlistService} from '../../predefined-watchlist';
import {FeatureType} from '../../auhtorization/feature';

import remove from 'lodash/remove';
import isEqual from 'lodash/isEqual';

// const remove = require("lodash/remove");
// const isEqual = require("lodash/isEqual");

@Injectable()
export class WatchlistService {

    private userDefinedWatchlists:Watchlist[] = [];
    private predefinedFollowedWatchlists:Watchlist[] = [];

    private tradingWatchlists:Watchlist[] = [];

    constructor(private loader:Loader,
                private stateService:WorkspaceStateService,
                private marketsManager:MarketsManager,
                private languageService:LanguageService,
                private watchlistLoader:WatchlistLoader,
                private predefinedWatchlistService: PredefinedWatchlistService,
                private sharedChannel:SharedChannel,
                private authorizationService:AuthorizationService) {

        this.loader.isLoadingDoneStream().subscribe(loadingDone => {
            if (loadingDone) {
                this.initWatchlists();
                this.syncCloudWatchlists();
            }
        });
    }

    private syncCloudWatchlists() {
        this.predefinedFollowedWatchlists = this.predefinedWatchlistService.getPredefinedFollowedWatchlists();
        this.save();
        this.sharedChannel.request({type: ChannelRequestType.WatchlistRefresh});
        if (!this.authorizationService.isVisitor()) {
            this.watchlistLoader.loadWatchlists().subscribe(serverWatchlists => {
                if (this.syncCloudWatchlistsWithUserDefinedOnes(serverWatchlists.deleted, serverWatchlists.active)) {
                    AppTcTracker.trackRefreshSyncCloudWatchlist();
                    this.sharedChannel.request({type: ChannelRequestType.WatchlistRefresh});
                }
            });
        }
    }

    private initWatchlists() {
        if (this.stateService.has(StateKey.Watchlist)) {
            let watchlists: Watchlist[] = this.stateService.get(StateKey.Watchlist) as Watchlist[];
            for (let watchlist of watchlists) {
                if (watchlist.type == WatchlistType.Predefined){
                    this.predefinedFollowedWatchlists.push(watchlist);
                } else if (watchlist.type == WatchlistType.UserDefined) {
                    this.userDefinedWatchlists.push(watchlist);
                } else if (watchlist.type == WatchlistType.Trading) {
                    this.tradingWatchlists.push(watchlist);
                }
            }
        }
    }

    create(name:string) {
        AppTcTracker.trackCreateWatchlist();
        let watchlist:Watchlist = {type:WatchlistType.UserDefined, id:StringUtils.guid(), name:name, symbols: {}};
        this.userDefinedWatchlists.push(watchlist);
        this.save();
        this.watchlistLoader.saveWatchlist(watchlist);
        return watchlist;
    }

    get(id:string):Watchlist {
        let watchlist:Watchlist = this.getUserDefined(id);
        if(watchlist == null){
            watchlist = this.getPredefinedFollowedWatchlistById(id);
        }
        if(watchlist == null){
            watchlist = this.getTradingWatchlist(id);
        }
        return watchlist;
    }

    getUserDefined(id:string):Watchlist {
        return this.userDefinedWatchlists.find(watchlist => watchlist.id == id);
    }

    public getPredefinedFollowedWatchlistById(id:string):Watchlist {
        return this.predefinedFollowedWatchlists.find(watchlist => watchlist.id == id);
    }

    public getPredefinedWatchlistById(id: string ) {
        return this.predefinedWatchlistService.getAllPredefinedWatchlists().find(watchlist => watchlist.id == id);
    }

    remove(watchlist:Watchlist) {
        AppTcTracker.trackDeleteWatchlist();
        remove(this.userDefinedWatchlists, (w: Watchlist) => w === watchlist);
        this.watchlistLoader.deleteWatchlist(watchlist);
        this.save();
        this.emitUserDefinedWatchListUpdated();
    }

    isDeleted(id:string):boolean {
        return this.get(id) == null;
    }

    save() {
        let storedWatchlists = this.predefinedFollowedWatchlists.concat(this.userDefinedWatchlists).concat(this.tradingWatchlists);
        this.stateService.set(StateKey.Watchlist, storedWatchlists);
    }
    getUserDefinedWatchlists():Watchlist[] {
        return this.userDefinedWatchlists;
    }

    public getPredefinedFollowedWatchlists():Watchlist[] {
        return this.predefinedFollowedWatchlists;
    }

    filter(watchlist:Watchlist, symbol:string):boolean {

        let company = this.marketsManager.getCompanyBySymbol(symbol);

        if(watchlist.type == WatchlistType.Predefined || watchlist.type == WatchlistType.UserDefined || watchlist.type == WatchlistType.Trading ) {
            return company.symbol in watchlist.symbols;
        }
        return false;
    }

    public getWatchListSymbols(watchList: Watchlist): string[] {
            return Object.keys(watchList.symbols);
    }

    updateWatchlistName(watchlist: Watchlist, name: string) {
        watchlist.name = name;
        this.save();
        this.watchlistLoader.saveWatchlist(watchlist);
    }

    addSymbolToWatchlist(watchlist:Watchlist, symbol:string){
        this.addSymbolsToWatchlist(watchlist, [symbol]);
    }

    private showExceedMessage(): void {
        let message: string = this.languageService.translate('لا يمكن إضافة جميع الشركات المختارة إلى لائحة الأسهم .');
        let message2:string = this.languageService.translate('عدد الشركات في لائحة الأسهم سيتجاوز الحد المسموح به وهو (700) شركة , الرجاء حذف بعض الشركات من اللائحة لتتمكن من إضافة شركات اخرى .');
        // let request: MessageBoxRequest = {type: ChannelRequestType.MessageBox, messageLine: message,messageLine2: message2};
        // this.sharedChannel.request(request);
    }

    addSymbolsToWatchlist(watchlist:Watchlist, symbols:string[]){
        this.authorizationService.authorize(FeatureType.WATCHLIST_ADD_SYMBOL, () => {
            Tc.assert(watchlist.type == WatchlistType.UserDefined, "can only add symbol to user defined watchlist");
            symbols.forEach(symbol => watchlist.symbols[symbol] = symbol);
            this.save();
            this.watchlistLoader.saveWatchlist(watchlist);
            this.emitUserDefinedWatchListUpdated();
        }, true, Object.keys(watchlist.symbols).length + symbols.length - 1 )
    }

    removeSymbolFromWatchlist(watchlist:Watchlist, symbol:string){
        this.removeSymbolsFromWatchlist(watchlist, [symbol]);
    }

    removeSymbolsFromWatchlist(watchlist:Watchlist, symbols:string[]){
        Tc.assert(watchlist.type == WatchlistType.UserDefined, "can only add symbol to user defined watchlist");
        symbols.forEach(symbol => delete watchlist.symbols[symbol]);
        this.save();
        this.watchlistLoader.saveWatchlist(watchlist);
        this.emitUserDefinedWatchListUpdated();
    }

    private emitUserDefinedWatchListUpdated() : void {
        this.sharedChannel.request(({type: ChannelRequestType.UserDefinedWatchListUpdated}));
    }

    doBelongToSameMarket(watchlist1:Watchlist, watchlist2:Watchlist):boolean { // todo: create a get market for predefined watchlist

        if(!this.marketsManager.subscribedInMultipleMarkets()) {
            return true;
        }

        if(watchlist1.type == WatchlistType.UserDefined || watchlist2.type == WatchlistType.UserDefined) {
            return false;
        }

        if(watchlist1.type == WatchlistType.Trading || watchlist2.type == WatchlistType.Trading) {
            return false;
        }
        let marketAbbr1: Market[] = this.getMarketsForWatchlist(watchlist1);
        let marketAbbr2: Market[] = this.getMarketsForWatchlist(watchlist2);

        return marketAbbr1 === marketAbbr2;

    }

    getMarketsForWatchlist(watchlist:Watchlist):Market[] {
        let markets:Market[] = [];

        if( watchlist.type == WatchlistType.Predefined || watchlist.type == WatchlistType.UserDefined || watchlist.type == WatchlistType.Trading) {
            Object.keys(watchlist.symbols).forEach(symbol => {
               let market:Market = this.marketsManager.getMarketBySymbol(symbol);
               if(!markets.includes(market)) {
                   markets.push(market);
               }
            });
        }

        return markets;
    }


    /* trading watchlists */

    public getTradingWatchlists():Watchlist[]{
        return this.tradingWatchlists;
    }
    public addTradingWatchlist(watchlist: Watchlist): void {
        this.tradingWatchlists.push(watchlist);
        this.save();
    }

    public removeTradingWatchlist(watchlist:Watchlist):void {
        remove(this.tradingWatchlists, (w: Watchlist) => w === watchlist);
        this.save();
    }

    public removeAllTradingWatchlists(): void {
        this.tradingWatchlists = [];
        this.save();
    }

    private getTradingWatchlist(id:string):Watchlist{
        return this.tradingWatchlists.find(watchlist => watchlist.id == id);
    }

    private syncCloudWatchlistsWithUserDefinedOnes(deletedServerWatchlists:string[], activeServerWatchlists: Watchlist[]):boolean {

        let syncChanged:boolean = false;

        // 1) delete any local watchlists that is deleted on server
        deletedServerWatchlists.forEach(serverWatchlistId => {
            let userDefinedWatchlist = this.getUserDefined(serverWatchlistId);
            if (userDefinedWatchlist) {
                remove(this.userDefinedWatchlists, (w: Watchlist) => w === userDefinedWatchlist);
                AppTcTracker.trackDeleteSyncCloudWatchlist();
                syncChanged = true;
            }
        })

        // 2) sync server watchlists with local ones
        activeServerWatchlists.forEach(serverWatchlist => {
            let userDefinedWatchlist = this.getUserDefined(serverWatchlist.id);
            if (!userDefinedWatchlist) {
                this.userDefinedWatchlists.push({
                    type: WatchlistType.UserDefined,
                    id: serverWatchlist.id,
                    name: serverWatchlist.name,
                    symbols: serverWatchlist.symbols
                });
                AppTcTracker.trackCreateSyncCloudWatchlist();
                syncChanged = true;
            } else {
                let needsUpdate =
                    (userDefinedWatchlist.name != serverWatchlist.name) ||
                    !isEqual(userDefinedWatchlist.symbols, serverWatchlist.symbols);
                if(needsUpdate){
                    userDefinedWatchlist.name = serverWatchlist.name;
                    userDefinedWatchlist.symbols = serverWatchlist.symbols;
                    AppTcTracker.trackUpdateSyncCloudWatchlist();
                    syncChanged = true;
                }
            }
        })

        // 3) delete local watchlists (non-sycned) that do not exist on the cloud
        this.getUserDefinedWatchlists().slice(0).forEach(userDefinedWatchlist => {
            if(!activeServerWatchlists.find(w => w.id == userDefinedWatchlist.id)) {
                remove(this.userDefinedWatchlists, (w: Watchlist) => w === userDefinedWatchlist);
                AppTcTracker.trackDeleteNonSyncedCloudWatchlist();
                syncChanged = true;
            }
        });

        if(syncChanged) {
            this.save();

            this.emitUserDefinedWatchListUpdated();
        }

        return syncChanged;
    }

    public getDefaultPredefinedWatchlistId() : string { // get first watchlist as default watchlist
        return this.predefinedWatchlistService.getDefaultWatchlist();
    }

    public setPredefinedFollowedWatchlists(): void {
        this.predefinedFollowedWatchlists = this.predefinedWatchlistService.getPredefinedFollowedWatchlists();
        this.sharedChannel.request(({type: ChannelRequestType.PredefinedWatchlistUpdated}));
    }
}

