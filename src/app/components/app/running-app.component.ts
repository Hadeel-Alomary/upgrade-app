import {ChangeDetectorRef, Component, ErrorHandler, EventEmitter, OnDestroy, Output, ViewEncapsulation} from '@angular/core';

import {
  Accessor,
  AlertLoader,
  AlertService,
  AlertStateService,
  // SearchStateService,
  AnalysisCenterLoaderService,
  CommunityLoaderService,
  AnalysisCenterService,
  AuthorizationService,
  AutoLinkService,
  BannerService,
  BigTradeLoader,
  BigTradeService,
  ChannelRequestType,
  CredentialsStateService,
  FilterService,
  ForceLogoutRequest,
  ForceLogoutType,
  GuidService,
  BrokerGuidService,
  LiquidityLoaderService,
  Loader,
  MarketAlertLoader,
  MarketAlertService,
  TechnicalScopeLoader,
  TechnicalScopeService,
  MarketDepthByOrderService,
  MarketDepthByPriceService,
  MarketPreOpenFilterService,
  MarketsManager,
  AppMarketsManager,
  MarketsTickSizeLoaderService,
  MarketsTickSizeService,
  AppMarketsTickSizeService,
  MarketSummaryService,
  MiscStateService,
  MyDrawingsLoader,
  NewsLoader,
  NewsService,
  Page,
  PageService,
  QuoteService,
  SharedChannel,
  Streamer,
  StreamerLoader,
  TimeAndSaleService,
  UserLoaderService,
  UserService,
  WatchlistLoader,
  PredefinedWatchlistLoaderService,
  PredefinedWatchlistService,
  WatchlistService,
  // WhatIsNewService,
  WorkspaceLoader,
  WorkspaceStateService,
  CommunityService,
  UpgradeMessageService,
  UpgradeMessageLoaderService,
  TcWebsiteService,
  TradesSummaryService,
  ShareholdersService,
  ShareholdersLoaderService,
  IntervalService,
  TechnicalIndicatorQuoteService,
  TechnicalScopeQuoteService,
  FinancialLoaderService,
  AppModeStateService,
  AppModeAuthorizationService,
  // CompanyFinancialDataStateService
} from '../../services/index';

import {ComponentsHelper} from '../../ng2-bootstrap/ng2-bootstrap';
import {TcAuthenticatedHttpClient} from '../../utils/app.tc-authenticated-http-client.service';
import {Config} from '../../config/config';
import {SubscriptionLike as ISubscription} from 'rxjs';
// import {FlashMessageService} from '../../services/message/flash-message.service';
import {SignatureLoader} from '../../services/loader/signature-loader/signature-loader.service';
import {AppMobileDebugger} from '../../utils/app.mobile-debugger';
import {NgFor, NgIf} from '@angular/common';
import {GridContainerComponent} from '../grid-container';
import {FooterComponent} from '../footer';
// import {ModalsContainerComponent} from '../modals';
import {DisablePageZoomDirective} from '../shared';
import {AppTcTracker, Tc, TcErrorHandler} from '../../utils';

@Component({
  standalone:true,
  selector: 'running-app',
  templateUrl:'./running-app.component.html',
  styleUrls: ['./running-app.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports:[GridContainerComponent , FooterComponent ,DisablePageZoomDirective,NgIf],
  // MA Add here all providers that application needs (those providers will be restarted on login/logout)
  providers: [
    AlertLoader,
    AlertService,
    AlertStateService,
    // SearchStateService,
    AutoLinkService,
    BigTradeLoader,
    BigTradeService,
    ComponentsHelper,
    Loader,
    WorkspaceLoader,
    WatchlistLoader,
    PredefinedWatchlistLoaderService,
    PredefinedWatchlistService,
    MyDrawingsLoader,
    MarketAlertLoader,
    MarketAlertService,
    TechnicalScopeLoader,
    TechnicalScopeService,
    MarketDepthByOrderService,
    MarketDepthByPriceService,
    MarketSummaryService,
    NewsLoader,
    NewsService,
    PageService,
    QuoteService,
    WorkspaceStateService,
    Streamer,
    StreamerLoader,
    TimeAndSaleService,
    WatchlistService,
    IntervalService,
    FilterService,
    Accessor,
    GuidService,
    BrokerGuidService,
    // WhatIsNewService,
    MarketPreOpenFilterService,
    { provide: MarketsManager, useClass: AppMarketsManager },
    AnalysisCenterLoaderService,
    CommunityLoaderService,
    AnalysisCenterService,
    CommunityService,
    { provide: MarketsTickSizeService, useClass: AppMarketsTickSizeService },
    MarketsTickSizeLoaderService,
    UserService,
    UserLoaderService,
    // FlashMessageService,
    LiquidityLoaderService,
    BannerService,
    // CompanyFinancialDataStateService,
    SignatureLoader,
    AppMobileDebugger,
    UpgradeMessageService,
    UpgradeMessageLoaderService,
    TcWebsiteService,
    TcAuthenticatedHttpClient,
    TradesSummaryService,
    ShareholdersService,
    ShareholdersLoaderService,
    TechnicalIndicatorQuoteService,
    TechnicalScopeQuoteService,
    FinancialLoaderService
  ],

})

export class RunningAppComponent implements OnDestroy {

  @Output() outputLogout = new EventEmitter();
  @Output() outputOnFailToLogin = new EventEmitter();
  @Output() outputReload = new EventEmitter();

  loading:boolean = true;

  subscriptions:ISubscription[] = [];

  enablePageNavigationGuide:boolean = false;

  constructor(public loader: Loader,
              public stateService: WorkspaceStateService,
              public pageService: PageService,
              public streamer: Streamer,
              public sharedChannel: SharedChannel,
              public miscStateService: MiscStateService,

              public errorHandler: ErrorHandler,
              public guidService: GuidService,
              public brokerGuidService: BrokerGuidService,
              public marketsManager: MarketsManager,
              public authorizationService: AuthorizationService,
              public appModeAuthorizationService: AppModeAuthorizationService,
              public cd: ChangeDetectorRef,
              private credentialsService: CredentialsStateService,
              private userService: UserService
  ) {

    // if(this.appModeAllowedFeature(AppModeFeatureType.BROKER_MODE_GUID_SERVICE)) {
      // this.brokerGuidService.init();
    // } else {
      this.guidService.init();
    // }

    this.subscriptions.push(
      this.loader.isLoadingDoneStream().subscribe(loadingDone => {
        if (loadingDone) {
          Config.appStartTime = Date.now();
          this.trackOnLogin();
          if (this.authorizationService.isVisitor()) {
            this.stateService.loadVisitorWorkspace(this.marketsManager.getDefaultMarket().abbreviation)
              .subscribe(res => {
                this.loading = false;
                this.showSignInForVisitorAfterOneMinitue();
                if (!this.authorizationService.isVisitor() && !this.miscStateService.isPageNavigationGuideShown()) {
                  this.enablePageNavigationGuide = true;
                  this.miscStateService.markPageNavigationGuideAsShown();
                  this.cd.markForCheck();
                }
              });
          } else {
            this.loading = false;
          }
        }
      }, error => {})
    );

    this.subscriptions.push(
      this.sharedChannel.getRequestStream().subscribe(channelRequest => {
        if(channelRequest.type == ChannelRequestType.Reload){
          this.stateService.save(); // save state before reloading (so, it won't be lost)
          this.outputReload.emit();
        } else if(channelRequest.type == ChannelRequestType.ForceLogout) {
          let type:ForceLogoutType = (<ForceLogoutRequest>channelRequest).forceLogoutType;
          if(type == ForceLogoutType.OtherMachineLoggedIn) {
            this.stateService.save(); // save state before
          } else if(type == ForceLogoutType.InvalidCredentials) {
            this.credentialsService.clearPassword();
          }
          // this.tradingService.onLogout();
          this.outputOnFailToLogin.emit(type);
        } else if(channelRequest.type == ChannelRequestType.Logout) {
          this.onLogout();
        }
      })
    );


    // MA if the session expires on server side, then we need to "reload"
    // this.subscriptions.push(
    //   (<TcErrorHandler>this.errorHandler).getUnauthorizedRequestStream().subscribe( () => {
    //     // MA we are operating from exception context, and this is why I needed setTimeout
    //     window.setTimeout(() => {
    //       this.sharedChannel.request({type:ChannelRequestType.Reload});
    //     }, 0);
    //   })
    // );


  }

  private showSignInForVisitorAfterOneMinitue() {
    setTimeout(() => {
      if(!this.userService.getVisitorSignInModalShown()) {
        this.sharedChannel.request({type: ChannelRequestType.SignInOrSignUp});
        this.streamer.onDestroy();
      }
    }, 60 * 1000)
  }

  ngOnDestroy() {
    if(!this.loading) {
      this.streamer.onDestroy();
      this.guidService.onDestroy();
    }
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = null;
  }

  /* template helpers */

  get selectedPage():Page {
    return this.pageService.getActivePage();
  }

  showPageNavigationGuide():boolean {
    return this.enablePageNavigationGuide;
  }

  /* interactive events */

  onSelectPage(page:Page) {
    this.pageService.setActivePage(page);
  }

  onDeletePage(page:Page) {
    this.pageService.deletePage(page);
  }

  onLogout() {
    AppTcTracker.trackLoggedOut();
    // this.tradingService.onLogout();
    this.stateService.save();
    this.outputLogout.emit();
  }

  // private appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
  //   return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
  // }

  /* tracker */

  trackOnLogin(){
    AppTcTracker.trackLoggedIn();
    AppTcTracker.trackUserAgent(Tc.getBrowserVersion());
    AppTcTracker.trackScreenSize(screen.height, screen.width);
    AppTcTracker.trackFontSize(this.miscStateService.getFontSize());
    AppTcTracker.trackTheme(this.miscStateService.isDarkTheme() ? "dark" : "light");
    if(this.miscStateService.getCampaignId()) {
      AppTcTracker.trackCampaignId(this.miscStateService.getCampaignId(), this.credentialsService.trackingId);
    }
    //AppTcTracker.trackReferer();
    AppTcTracker.sendNow();
  }

}
