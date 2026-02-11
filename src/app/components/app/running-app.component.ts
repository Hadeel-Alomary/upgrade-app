import {ChangeDetectorRef, Component, ErrorHandler, EventEmitter, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {NgIf} from '@angular/common';

// import {
//   Accessor,
//   AlertLoader,
//   AlertService,
//   AlertStateService,
//   SearchStateService,
//   AnalysisCenterLoaderService,
//   CommunityLoaderService,
//   AnalysisCenterService,
//   AuthorizationService,
//   AutoLinkService,
//   BannerService,
//   BigTradeLoader,
//   BigTradeService,
//   ChannelRequestType, ChartStateService,
//   CredentialsStateService,
//   DerayahErrorService,
//   DerayahClientService,
//   DerayahHttpClientService,
//   DerayahLogoutService,
//   DerayahLoaderService,
//   DerayahOrdersService,
//   DerayahPositionsService,
//   DerayahService,
//   DerayahStateService,
//   SnbcapitalErrorService,
//   SnbcapitalOrdersService,
//   SnbcapitalPositionsService,
//   SnbcapitalService,
//   SnbcapitalStateService,
//   RiyadcapitalErrorService,
//   RiyadcapitalOrdersService,
//   RiyadcapitalPositionsService,
//   RiyadcapitalService,
//   RiyadcapitalStateService,
//   AlinmainvestErrorService,
//   AlinmainvestOrdersService,
//   AlinmainvestPositionsService,
//   AlinmainvestService,
//   AlinmainvestStateService,
//   AljaziracapitalErrorService,
//   AljaziracapitalOrdersService,
//   AljaziracapitalPositionsService,
//   AljaziracapitalService,
//   AljaziracapitalStateService,
//   AlinmainvestClientService,
//   AlrajhicapitalErrorService,
//   AlrajhicapitalOrdersService,
//   AlrajhicapitalPositionsService,
//   AlrajhicapitalService,
//   AlrajhicapitalStateService,
//   MusharakaErrorService,
//   MusharakaOrdersService,
//   MusharakaPositionsService,
//   MusharakaService,
//   MusharakaStateService,
//   BsfErrorService,
//   BsfOrdersService,
//   BsfPositionsService,
//   BsfService,
//   BsfStateService,
//   AlkhabeercapitalErrorService,
//   AlkhabeercapitalOrdersService,
//   AlkhabeercapitalPositionsService,
//   AlkhabeercapitalService,
//   AlkhabeercapitalStateService,
//   FilterService,
//   ForceLogoutRequest,
//   ForceLogoutType,
//   GuidService,
//   BrokerGuidService,
//   LiquidityLoaderService,
//   LiquidityService,
//   Loader,
//   MarketAlertLoader,
//   MarketAlertService,
//   TechnicalScopeLoader,
//   TechnicalScopeService,
//   MarketDepthByOrderService,
//   MarketDepthByPriceService,
//   MarketPreOpenFilterService,
//   MarketsManager,
//   AppMarketsManager,
//   MarketsTickSizeLoaderService,
//   MarketsTickSizeService,
//   AppMarketsTickSizeService,
//   MarketSummaryService,
//   MiscStateService,
//   MyDrawingsLoader,
//   MyDrawingsService,
//   NewsLoader,
//   NewsService,
//   Page,
//   PageService,
//   PublishLoader,
//   QuoteService,
//   SharedChannel,
//   Streamer,
//   StreamerLoader,
//   TimeAndSaleService,
//   TradingService,
//   UserLoaderService,
//   UserService,
//   VirtualTradingErrorService,
//   VirtualTradingLoader,
//   VirtualTradingOrdersService,
//   VirtualTradingPositionsService,
//   VirtualTradingService,
//   VolumeProfilerService,
//   FinancialIndicatorService,
//   FinancialDataService,
//   FinancialIndicatorStreamerService,
//   WatchlistLoader,
//   PredefinedWatchlistLoaderService,
//   PredefinedWatchlistService,
//   WatchlistService,
//   WhatIsNewService,
//   WorkspaceLoader,
//   WorkspaceStateService,
//   CommunityService,
//   UpgradeMessageService,
//   UpgradeMessageLoaderService,
//   IntradayChartUpdaterService,
//   DailyChartUpdaterService,
//   TcWebsiteService,
//   TradesSummaryService,
//   ShareholdersService,
//   ShareholdersLoaderService,
//   IntervalService,
//   TradestationService,
//   TechnicalIndicatorQuoteService,
//   TechnicalScopeQuoteService,
//   TradestationLogoutService,
//   TradestationClientService,
//   TradestationHttpClientService,
//   TradestationLoaderService,
//   TradestationStateService,
//   TradestationOrdersService,
//   TradestationPositionsService,
//   TradestationBalancesService,
//   TradestationAccountsService,
//   BrokerRegisterLoaderService,
//   FinancialLoaderService,
//   AppModeStateService,
//   AppModeAuthorizationService,
//   CompanyFinancialDataStateService
// } from '../../services/index';
//
// import {ComponentsHelper} from '../../ng2-bootstrap/ng2-bootstrap';
// import {Tc, TcErrorHandler, AppTcTracker} from '../../utils/index';
// import {TcAuthenticatedHttpClient} from '../../utils/app.tc-authenticated-http-client.service';
// import {Config} from '../../config/config';
// import {SubscriptionLike as ISubscription} from 'rxjs';
// import {TradingStateService} from '../../services/state/trading/trading-state-service';
// import {FlashMessageService} from '../../services/message/flash-message.service';
// import {SignatureService} from '../../services/settings/signature/signature.service';
// import {SignatureLoader} from '../../services/loader/signature-loader/signature-loader.service';
// import {PublishService} from '../../services/publisher/publish.service';
// import {AppMobileDebugger} from '../../utils/app.mobile-debugger';
// import {SnbcapitalLoaderService} from '../../services/loader/trading/snbcapital-loader/snbcapital-loader.service';
// import {SnbcapitalHttpClientService} from '../../services/trading/snbcapital/snbcapital-http-client-service';
// import {RiyadcapitalLoaderService} from '../../services/loader/trading/riyadcapital-loader/riyadcapital-loader.service';
// import {RiyadcapitalHttpClientService} from '../../services/trading/riyadcapital/riyadcapital-http-client.service';
// import {AlinmainvestLoaderService} from '../../services/loader/trading/alinmainvest-loader/alinmainvest-loader.service';
// import {AlinmainvestHttpClientService} from '../../services/trading/alinmainvest/alinmainvest-http-client.service';
// import {AljaziracapitalHttpClientService} from '../../services/trading/aljaziracapital/aljaziracapital-http-client.service';
// import {AljaziracapitalLoaderService} from '../../services/loader/trading/aljaziracapital-loader/aljaziracapital-loader.service';
// import {AlrajhicapitalLoaderService} from '../../services/loader/trading/alrajhicapital-loader/alrajhicapital-loader.service';
// import {AlrajhicapitalHttpClientService} from '../../services/trading/alrajhicapital/alrajhicapital-http-client.service';
// import {MusharakaHttpClientService} from '../../services/trading/musharaka/musharaka-http-client.service';
// import {MusharakaLoaderService} from '../../services/loader/trading/musharaka-loader/musharaka-loader.service';
// import {AppModeFeatureType } from '../../services/auhtorization/app-mode-authorization/app-mode-feature';
// import {BsfHttpClientService} from '../../services/trading/bsf/bsf-http-client.service';
// import {BsfLoaderService} from '../../services/loader/trading/bsf-loader/bsf-loader.service';
// import {AlkhabeercapitalHttpClientService} from '../../services/trading/alkhabeercapital/alkhabeercapital-http-client.service';
// import {AlkhabeercapitalLoaderService} from '../../services/loader/trading/alkhabeercapital-loader/alkhabeercapital-loader.service';

@Component({
  selector: 'running-app',
  standalone:true,
  templateUrl:'./running-app.component.html',
  styleUrls: ['./running-app.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports:[NgIf],
  // MA Add here all providers that application needs (those providers will be restarted on login/logout)
  providers: [
    // AlertLoader,
    // AlertService,
    // AlertStateService,
    // SearchStateService,
    // AutoLinkService,
    // BigTradeLoader,
    // BigTradeService,
    // ComponentsHelper,
    // Loader,
    // WorkspaceLoader,
    // WatchlistLoader,
    // PredefinedWatchlistLoaderService,
    // PredefinedWatchlistService,
    // MyDrawingsLoader,
    // MarketAlertLoader,
    // MarketAlertService,
    // TechnicalScopeLoader,
    // TechnicalScopeService,
    // MarketDepthByOrderService,
    // MarketDepthByPriceService,
    // MarketSummaryService,
    // NewsLoader,
    // NewsService,
    // PageService,
    // QuoteService,
    // WorkspaceStateService,
    // Streamer,
    // StreamerLoader,
    // TimeAndSaleService,
    // IntradayChartUpdaterService,
    // DailyChartUpdaterService,
    // WatchlistService,
    // IntervalService,
    // FilterService,
    // MyDrawingsService,
    // Accessor,
    // GuidService,
    // BrokerGuidService,
    // WhatIsNewService,
    // MarketPreOpenFilterService,
    // { provide: MarketsManager, useClass: AppMarketsManager },
    // AnalysisCenterLoaderService,
    // CommunityLoaderService,
    // AnalysisCenterService,
    // DerayahLoaderService,
    // DerayahService,
    // DerayahStateService,
    // DerayahErrorService,
    // DerayahClientService,
    // DerayahHttpClientService,
    // DerayahLogoutService,
    // DerayahOrdersService,
    // DerayahPositionsService,
    // SnbcapitalLoaderService,
    // SnbcapitalService,
    // SnbcapitalStateService,
    // SnbcapitalErrorService,
    // SnbcapitalOrdersService,
    // SnbcapitalPositionsService,
    // SnbcapitalHttpClientService,
    // RiyadcapitalLoaderService,
    // RiyadcapitalService,
    // RiyadcapitalStateService,
    // RiyadcapitalErrorService,
    // RiyadcapitalOrdersService,
    // RiyadcapitalPositionsService,
    // RiyadcapitalHttpClientService,
    // AlinmainvestLoaderService,
    // AlinmainvestService,
    // AlinmainvestStateService,
    // AlinmainvestClientService,
    // AlinmainvestErrorService,
    // AlinmainvestOrdersService,
    // AlinmainvestPositionsService,
    // AljaziracapitalLoaderService,
    // AljaziracapitalErrorService,
    // AljaziracapitalOrdersService,
    // AljaziracapitalPositionsService,
    // AljaziracapitalService,
    // AljaziracapitalStateService,
    // AljaziracapitalHttpClientService,
    // AlinmainvestHttpClientService,
    // AlrajhicapitalLoaderService,
    // AlrajhicapitalService,
    // AlrajhicapitalStateService,
    // AlrajhicapitalErrorService,
    // AlrajhicapitalOrdersService,
    // AlrajhicapitalPositionsService,
    // AlrajhicapitalHttpClientService,
    // MusharakaLoaderService,
    // MusharakaService,
    // MusharakaStateService,
    // MusharakaErrorService,
    // MusharakaOrdersService,
    // MusharakaPositionsService,
    // MusharakaHttpClientService,
    // BsfLoaderService,
    // BsfService,
    // BsfStateService,
    // BsfErrorService,
    // BsfOrdersService,
    // BsfPositionsService,
    // BsfHttpClientService,
    // AlkhabeercapitalLoaderService,
    // AlkhabeercapitalService,
    // AlkhabeercapitalStateService,
    // AlkhabeercapitalErrorService,
    // AlkhabeercapitalOrdersService,
    // AlkhabeercapitalPositionsService,
    // AlkhabeercapitalHttpClientService,
    // CommunityService,
    // { provide: MarketsTickSizeService, useClass: AppMarketsTickSizeService },
    // MarketsTickSizeLoaderService,
    // TradingService,
    // VirtualTradingService,
    // TradingStateService,
    // VirtualTradingErrorService,
    // VirtualTradingLoader,
    // VirtualTradingOrdersService,
    // VirtualTradingPositionsService,
    // UserService,
    // UserLoaderService,
    // FlashMessageService,
    // LiquidityService,
    // LiquidityLoaderService,
    // VolumeProfilerService,
    // FinancialIndicatorService,
    // FinancialDataService,
    // FinancialIndicatorStreamerService,
    // BannerService,
    // CompanyFinancialDataStateService,
    // SignatureService,
    // PublishLoader,
    // SignatureLoader,
    // PublishService,
    // ChartStateService,
    // AppMobileDebugger,
    // UpgradeMessageService,
    // UpgradeMessageLoaderService,
    // TcWebsiteService,
    // TcAuthenticatedHttpClient,
    // TradesSummaryService,
    // ShareholdersService,
    // ShareholdersLoaderService,
    // TechnicalIndicatorQuoteService,
    // TechnicalScopeQuoteService,
    // TradestationService,
    // TradestationLogoutService,
    // TradestationClientService,
    // TradestationHttpClientService,
    // TradestationLoaderService,
    // TradestationStateService,
    // TradestationOrdersService,
    // TradestationPositionsService,
    // TradestationBalancesService,
    // TradestationAccountsService,
    // BrokerRegisterLoaderService,
    // FinancialLoaderService
  ],

})

export class RunningAppComponent  {

  @Output() outputLogout = new EventEmitter();
  @Output() outputOnFailToLogin = new EventEmitter();
  @Output() outputReload = new EventEmitter();

  loading:boolean = true;
  //
  // subscriptions:ISubscription[] = [];
  //
  // enablePageNavigationGuide:boolean = false;
  //
  // constructor(public loader: Loader,
  //             public stateService: WorkspaceStateService,
  //             public pageService: PageService,
  //             public streamer: Streamer,
  //             public sharedChannel: SharedChannel,
  //             public miscStateService: MiscStateService,
  //             public errorHandler: ErrorHandler,
  //             public guidService: GuidService,
  //             public brokerGuidService: BrokerGuidService,
  //             public marketsManager: MarketsManager,
  //             public tradingService: TradingService,
  //             public authorizationService: AuthorizationService,
  //             public appModeAuthorizationService: AppModeAuthorizationService,
  //             public cd: ChangeDetectorRef,
  //             private credentialsService: CredentialsStateService,
  //             private userService: UserService
  // ) {
  //
  //   if(this.appModeAllowedFeature(AppModeFeatureType.BROKER_MODE_GUID_SERVICE)) {
  //     this.brokerGuidService.init();
  //   } else {
  //     this.guidService.init();
  //   }
  //
  //   this.subscriptions.push(
  //     this.loader.isLoadingDoneStream().subscribe(loadingDone => {
  //       if (loadingDone) {
  //         Config.appStartTime = Date.now();
  //         this.trackOnLogin();
  //         if (this.authorizationService.isVisitor()) {
  //           this.stateService.loadVisitorWorkspace(this.marketsManager.getDefaultMarket().abbreviation)
  //             .subscribe(res => {
  //               this.loading = false;
  //               this.showSignInForVisitorAfterOneMinitue();
  //               if (!this.authorizationService.isVisitor() && !this.miscStateService.isPageNavigationGuideShown()) {
  //                 this.enablePageNavigationGuide = true;
  //                 this.miscStateService.markPageNavigationGuideAsShown();
  //                 this.cd.markForCheck();
  //               }
  //             });
  //         } else {
  //           this.loading = false;
  //         }
  //       }
  //     }, error => Tc.error(error))
  //   );
  //
  //   this.subscriptions.push(
  //     this.sharedChannel.getRequestStream().subscribe(channelRequest => {
  //       if(channelRequest.type == ChannelRequestType.Reload){
  //         this.stateService.save(); // save state before reloading (so, it won't be lost)
  //         this.outputReload.emit();
  //       } else if(channelRequest.type == ChannelRequestType.ForceLogout) {
  //         let type:ForceLogoutType = (<ForceLogoutRequest>channelRequest).forceLogoutType;
  //         if(type == ForceLogoutType.OtherMachineLoggedIn) {
  //           this.stateService.save(); // save state before
  //         } else if(type == ForceLogoutType.InvalidCredentials) {
  //           this.credentialsService.clearPassword();
  //         }
  //         this.tradingService.onLogout();
  //         this.outputOnFailToLogin.emit(type);
  //       } else if(channelRequest.type == ChannelRequestType.Logout) {
  //         this.onLogout();
  //       }
  //     })
  //   );
  //
  //
  //   // MA if the session expires on server side, then we need to "reload"
  //   this.subscriptions.push(
  //     (<TcErrorHandler>this.errorHandler).getUnauthorizedRequestStream().subscribe( () => {
  //       // MA we are operating from exception context, and this is why I needed setTimeout
  //       window.setTimeout(() => {
  //         this.sharedChannel.request({type:ChannelRequestType.Reload});
  //       }, 0);
  //     })
  //   );
  //
  //
  // }
  //
  // private showSignInForVisitorAfterOneMinitue() {
  //   setTimeout(() => {
  //     if(!this.userService.getVisitorSignInModalShown()) {
  //       this.sharedChannel.request({type: ChannelRequestType.SignInOrSignUp});
  //       this.streamer.onDestroy();
  //     }
  //   }, 60 * 1000)
  // }
  //
  // ngOnDestroy() {
  //   if(!this.loading) {
  //     this.streamer.onDestroy();
  //     this.guidService.onDestroy();
  //   }
  //   this.subscriptions.forEach(subscription => subscription.unsubscribe());
  //   this.subscriptions = null;
  // }
  //
  // /* template helpers */
  //
  // get selectedPage():Page {
  //   return this.pageService.getActivePage();
  // }
  //
  // showPageNavigationGuide():boolean {
  //   return this.enablePageNavigationGuide;
  // }
  //
  // /* interactive events */
  //
  // onSelectPage(page:Page) {
  //   this.pageService.setActivePage(page);
  // }
  //
  // onDeletePage(page:Page) {
  //   this.pageService.deletePage(page);
  // }
  //
  // onLogout() {
  //   AppTcTracker.trackLoggedOut();
  //   this.tradingService.onLogout();
  //   this.stateService.save();
  //   this.outputLogout.emit();
  // }
  //
  // private appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
  //   return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
  // }
  //
  // /* tracker */
  //
  // trackOnLogin(){
  //   AppTcTracker.trackLoggedIn();
  //   AppTcTracker.trackUserAgent(Tc.getBrowserVersion());
  //   AppTcTracker.trackScreenSize(screen.height, screen.width);
  //   AppTcTracker.trackFontSize(this.miscStateService.getFontSize());
  //   AppTcTracker.trackTheme(this.miscStateService.isDarkTheme() ? "dark" : "light");
  //   if(this.miscStateService.getCampaignId()) {
  //     AppTcTracker.trackCampaignId(this.miscStateService.getCampaignId(), this.credentialsService.trackingId);
  //   }
  //   //AppTcTracker.trackReferer();
  //   AppTcTracker.sendNow();
  // }

}
