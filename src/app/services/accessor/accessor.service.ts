import {Injectable} from "@angular/core";
import {SharedChannel} from "../shared-channel/shared-channel.service";
import {Loader} from "../loader/loader/loader.service";
import {AutoLinkService} from "../auto-link/auto-link.service";
import {WatchlistService} from "../settings/watchlist/watchlist.service";
import {PageService} from "../page/page.service";
import {MiscStateService} from "../state/misc/misc-state.service";
import {MarketsManager} from "../loader/loader/markets-manager";
import {LanguageService} from '../state/language/index';
import {SlickGridColumnsService, SlickGridFormatterService} from "../slick-grid/index";
import {AppModeAuthorizationService, AuthorizationService} from '../auhtorization';

@Injectable()
export class Accessor {

    constructor(public sharedChannel:SharedChannel,
                public loader:Loader,
                public autoLinkService:AutoLinkService,
                public watchlistService:WatchlistService,
                public pageService:PageService,
                public miscStateService:MiscStateService,
                public marketsManager:MarketsManager,
                public languageService:LanguageService,
                public slickGridColumnsService:SlickGridColumnsService,
                public slickGridFormatterService:SlickGridFormatterService,
                public authorizationService:AuthorizationService,
                public appModeAuthorizationService: AppModeAuthorizationService) {}

}

