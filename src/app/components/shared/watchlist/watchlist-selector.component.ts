import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {Accessor, AuthorizationService, ChannelRequestType, PredefinedWatchlistService, Watchlist, WatchlistService, WatchlistType} from '../../../services/index';
// import {NewWatchlistCaller, NewWatchlistRequest} from '../../index';
import {NewWatchlistCaller, NewWatchlistRequest, WatchlistPropertiesRequest} from '../../modals/index';
import {SubscriptionLike as ISubscription} from 'rxjs';
import {FeatureType} from '../../../services/auhtorization/feature';
import {AppBrowserUtils} from '../../../utils';
import {AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';
import {DropdownDirective} from '../../../ng2-bootstrap/components/dropdown/dropdown.directive';
import {DropdownToggleDirective} from '../../../ng2-bootstrap/components/dropdown/dropdown-toggle.directive';
import {DropdownMenuDirective} from '../../../ng2-bootstrap/components/dropdown/dropdown-menu.directive';
import {NgFor, NgIf} from '@angular/common';
import {SubmenuToggleDirective} from '../submenu-toggle/submenu-toggle.directive';

@Component({
    standalone:true,
    selector: 'watchlist-selector',
    templateUrl:'./watchlist-selector.component.html',
    styleUrls:['./watchlist-selector.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:[DropdownDirective,DropdownToggleDirective,DropdownMenuDirective,NgFor,NgIf,SubmenuToggleDirective]
})

export class WatchlistSelectorComponent implements NewWatchlistCaller, OnDestroy {

    @Input() watchlist:Watchlist;
    @Input() includeIndices:boolean = true;
    @Input() includeSectors:boolean = true;
    @Input() includeUserWatchLists:boolean = true;
    @Input() hideGlobalPredefinedWatchlist: boolean = false;
    @Output() outputWatchlist = new EventEmitter();

    private subscriptions:ISubscription[] = [];

    constructor( public watchlistService:WatchlistService,  public accessor:Accessor, public cd: ChangeDetectorRef, public authorizationService:AuthorizationService, private predefinedWatchlistService: PredefinedWatchlistService){
        this.subscriptions.push(
            this.accessor.sharedChannel.getRequestStream().subscribe( request => {
                if(request.type == ChannelRequestType.WatchlistRefresh) {
                    this.cd.markForCheck();
                }
            })
        );
    }

    showFollowPredefinedWatchlists():boolean {
       return this.accessor.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.SHOW_FOLLOW_PREDEFINED_WATCHLISTS)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
    }

    /* channel request callbacks */

    onWatchlistCreated(watchlist:Watchlist) {
        this.outputWatchlist.emit(watchlist);
    }

    /* template events */

    onSelectWatchlist(watchlist:Watchlist) {
        this.watchlist = watchlist;
        this.outputWatchlist.emit(watchlist);
    }

    onFollowPredefinedWatchlists() {
        this.authorizationService.authorize(FeatureType.WATCHLIST_ADD, () => {
            this.accessor.sharedChannel.request({type: ChannelRequestType.FollowPredefinedWatchlists});
        })
    }

    onUpdateWatchlists() {
        this.authorizationService.authorize(FeatureType.WATCHLIST_ADD, () => {
            let watchlistPropertiesRequest:WatchlistPropertiesRequest = {type: ChannelRequestType.WatchlistProperties};
            if( this.watchlist.type == WatchlistType.Predefined ||  this.watchlist.type == WatchlistType.UserDefined) {
                watchlistPropertiesRequest.watchlist = this.watchlist;
            }
            this.accessor.sharedChannel.request(watchlistPropertiesRequest);
        })
    }

    onNewWatchlist() {
        let newWatchlistRequest:NewWatchlistRequest = {type: ChannelRequestType.NewWatchlist, caller: this};
        this.accessor.sharedChannel.request(newWatchlistRequest);
    }

    /* template helpers */
    getUserDefinedWatchlists():Watchlist[] {
        return this.watchlistService.getUserDefinedWatchlists();
    }

    public getPredefinedWatchlists():Watchlist[] {
        if(this.hideGlobalPredefinedWatchlist) {
            return this.watchlistService.getPredefinedFollowedWatchlists().filter(watchlist => watchlist.id != this.predefinedWatchlistService.getGlobalPredefinedWatchlistId())
        }
        return this.watchlistService.getPredefinedFollowedWatchlists();
    }

    getExternalWatchlists():Watchlist[]{
        return this.watchlistService.getTradingWatchlists();
    }

    isDesktop():boolean {
        return AppBrowserUtils.isDesktop();
    }

    getDropdownMaxHeight(element:HTMLElement) {
        let elementRectangle = element.getBoundingClientRect();
        return window.innerHeight - elementRectangle.top - 60;
    }

}
