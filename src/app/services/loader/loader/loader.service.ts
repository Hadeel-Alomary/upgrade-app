import {BehaviorSubject, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Tc} from '../../../utils/index';
import {Company, CompanyFlag, CompanyTag, Market, Sector} from './market';
import {ContactUsConfig, LoaderConfig, LoaderUrlType, MarketAlertsConfig} from './loader-config';
import {UserInfo} from './user-info';
import {CredentialsStateService} from '../../state/credentials/credentials-state.service';
import {LanguageService} from '../../state/language/language.service';
import {AdvanceMessage, BannerMessage, SimpleMessage} from './loader-messages';
import {Config} from '../../../config/config';
import {ForceLogoutType, LogoutService} from '../../logout/index';
import {AppModeAuthorizationService, AuthorizationService} from '../../auhtorization';
import {MarketsManager} from './markets-manager';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {ProxyService} from './proxy.service';
import {WorkspaceStateService} from '../../state';
import {WorkspaceData} from '../../state/workspace/workspace-data';
import {SnbcapitalLoginInfo} from './snbcapital-login-info';
import {PredefinedWatchlistService} from '../../predefined-watchlist/predefined-watchlist.service';
import {AppModeFeatureType} from '../../auhtorization/app-mode-authorization';
import {AlrajhicapitalLoginInfo} from './alrajhicapital-login-info';
import {AlrajhicapitalLoginChannelRequest, BsfLoginChannelRequest,AlkhabeercapitalLoginChannelRequest, MusharakaLoginChannelRequest} from '../../shared-channel/channel-request';
import {MusharakaLoginInfo} from './musharaka-login-info';
import {BsfLoginInfo} from './bsf-login-info';
import {TcAuthenticatedHttpClient} from '../../../utils/app.tc-authenticated-http-client.service';
import {AlkhabeercapitalLoginInfo} from './alkhabeercapital-login-info';

import sortBy from 'lodash/sortBy';

// const sortBy = require("lodash/sortBy");

@Injectable()
export class Loader {
    private snbcapitalLoginInfo: SnbcapitalLoginInfo;
    private alrajhicapitalLoginInfo: AlrajhicapitalLoginInfo;
    private musharakaLoginInfo: MusharakaLoginInfo;
    private bsfLoginInfo: BsfLoginInfo;
    private alkhabeercapitalLoginInfo: AlkhabeercapitalLoginInfo;

    public isMarketInfoCalled: boolean = false;
    private marketStream: ReplaySubject<Market>;
    private configStream: Subject<LoaderConfig>;

    private loadingDoneStream: Subject<boolean>;

    private generalPurposeStreamerUrl:string;
    private financialStreamerUrl:string;

    private isSubscriber: boolean = false;
    private packageType: PackageType;

    private date: string = null;
    private end_date: string = null;
    private userInfo:UserInfo = null;
    private loaderConfig:LoaderConfig = null;
    private marketTradingMinutesCount:{[marketAbbr:string]:number} = null;

    private advanceMessages:AdvanceMessage[] = [];
    private simpleMessages:SimpleMessage[] = [];

    private bannerMessage: BannerMessage = null;

    private token:string;

    constructor(private http: HttpClient,
                private appModeAuthorizationService: AppModeAuthorizationService,
                private credentialsService:CredentialsStateService,
                private workspaceStateService:WorkspaceStateService,
                private logoutService:LogoutService,
                private languageService:LanguageService,
                private marketsManager:MarketsManager,
                private authorizationService:AuthorizationService,
                private sharedChannel:SharedChannel,
                private proxyService: ProxyService,
                private tcAuthenticatedHttpClient: TcAuthenticatedHttpClient,
                private predefinedWatchlistService: PredefinedWatchlistService,
               ){

        this.marketStream = new ReplaySubject();
        this.configStream = new BehaviorSubject(null);
        this.loadingDoneStream = new BehaviorSubject(false);

        let username = this.credentialsService.username;
        if(!username){
            //No username => visitor
            if(this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.DERAYAH_LOGOUT)){
                //No visitor mode for Derayah Web
                this.forceLogout(ForceLogoutType.InvalidCredentials);
                return;
            }
            this.loadMarketsInfo(false, false, false);
            return;
        }
        let loginBody = {
            username: this.credentialsService.username,
            password: btoa(this.credentialsService.password)
        };
        this.http.post<HttpResponse<LoginResponse>>(this.toHttps(`https://tickerchart.com/m/v2/tickerchart/web/login?version=${this.getVersion()}&language=${this.getLangauge()}`), loginBody, this.getHttpOptions(true))
            .subscribe(
                (loginResponse) => {

                    let responseBody: LoginResponse = loginResponse.body;
                    if (!responseBody.success) {
                        this.forceLogout(ForceLogoutType.InvalidCredentials);
                        return of(null);
                    }

                    this.packageType = responseBody.response.package.package_type;
                    this.isSubscriber = responseBody.response.package.package_type != PackageType.Free;
                    this.end_date = responseBody.response.package.end_date ? responseBody.response.package.end_date : '';
                    /*if(this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.DERAYAH_MODE_AUTHENTICATION)) {
                        // Derayah Mode: Adding specific users to use Premium subscription

                        // Derayah user --> Tc UserName
                        // 15280696     --> 3AYWTPI   (our office production user 15280696)
                        // 10084911     --> 2TX24LD
                        // 10164440     --> 17GV2X2

                        let premiumDerayahModeTcUserNames: string[] = ["3AYWTPI", "2TX24LD", "17GV2X2"];
                        if(premiumDerayahModeTcUserNames.includes(username.toUpperCase())) {
                            this.packageType = PackageType.Professional;
                        } else {
                            this.packageType = PackageType.Basic;
                        }
                    }*/

                    this.date = responseBody.response.date;
                    this.setTcToken(responseBody.response.token);
                    this.initAuthorizationAccessType(this.packageType);
                    this.processSnbcapitalLoginInfo(responseBody.response.alahli);
                    this.processAlrajhiLoginInfo(responseBody.response.alrajhi);
                    this.processMusharakaLoginInfo(responseBody.response.musharaka);
                    this.processBsfLoginInfo(responseBody.response.bsf);
                    this.processAlkhabeercapitalLoginInfo(responseBody.response.alkhabeer);

                    // let isSnbcapitalSubscriber = responseBody.response.alahli.subscribed;
                    // let snbcapitalSubscriptionChanged: boolean = this.snbcapitalStateService.getIsSubscriptionChanged();
                    //
                    // let isAlrajhiSubscriber = responseBody.response.alrajhi.subscribed;
                    // let alrajhicapitalSubscriptionCanChanged: boolean = this.alrajhicapitalStateService.getIsSubscriptionChanged();
                    //
                    // let isMusharakaSubscriber = responseBody.response.musharaka.subscribed;
                    // let musharakaSubscriptionCanChanged: boolean = this.musharakaStateService.getIsSubscriptionChanged();
                    //
                    // let isBsfSubscriber = responseBody.response.bsf.subscribed;
                    // let bsfSubscriptionCanChanged: boolean =  this.bsfStateService.getIsSubscriptionChanged();
                    //
                    // let isAlkhabeercapitalSubscriber = responseBody.response.alkhabeer.subscribed;
                    // let alkhabeercapitalSubscriptionCanChanged: boolean =  this.alkhabeercapitalStateService.getIsSubscriptionChanged();
                    let shouldLoadMarketInfo: boolean = false;
                    //
                    // if (isSnbcapitalSubscriber) {
                    //     if (snbcapitalSubscriptionChanged) {
                    //         this.snbcapitalStateService.removeIsSubscriptionChanged();
                    //         shouldLoadMarketInfo = true;
                    //     } else {
                    //         this.showSnbcapitalLogin();
                    //         return of(null);
                    //     }
                    // } else if (isAlrajhiSubscriber) {
                    //     if (alrajhicapitalSubscriptionCanChanged) {
                    //         this.showAlrajhicapitalLogin();
                    //         return of(null)
                    //     } else {
                    //         this.showAlrajhicapitalLogin(500);
                    //         return of(null);
                    //     }
                    // }
                    // else if (isMusharakaSubscriber) {
                    //     if (musharakaSubscriptionCanChanged) {
                    //         this.showMusharakaLogin();
                    //         return of(null)
                    //     } else {
                    //         this.showMusharakaLogin(500);
                    //         return of(null);
                    //     }
                    // }
                    // else if (isBsfSubscriber) {
                    //     if (bsfSubscriptionCanChanged) {
                    //         this.showBsfLogin();
                    //         return of(null);
                    //     } else {
                    //         this.showBsfLogin(500);
                    //         return of(null);
                    //     }
                    // }
                    // else if (isAlkhabeercapitalSubscriber) {
                    //     if (alkhabeercapitalSubscriptionCanChanged) {
                    //         this.showAlkhabeercapitalLogin();
                    //         return of(null);
                    //     } else {
                    //         this.showAlkhabeercapitalLogin(500);
                    //         return of(null);
                    //     }
                    // }

                    // else {
                        shouldLoadMarketInfo = true;
                    // }

                    if (shouldLoadMarketInfo) {
                        let isNewProfile: boolean = responseBody.new_profile;
                        this.loadMarketsInfo(true, false, isNewProfile);
                    }
                },
                (error) => {
                    Tc.error('Error during login')
                    this.forceLogout(ForceLogoutType.FailToConnect);

                }
            );
    }

    private loadMarketsInfo(useTcToken: boolean, isSnbCapitalUnauthorized: boolean, isNewProfile: boolean): void {
        this.isMarketInfoCalled = true;
        this.getMarketsInfoSubscription(useTcToken, isSnbCapitalUnauthorized).subscribe(
            (marketsInfo) => {
                this.getWebLoaderSubscription().subscribe(
                    (loaderResponse: HttpResponse<LoaderDataResponse>) => {
                        this.processConfigData(loaderResponse.body);
                        this.getCompaniesAndCategoriesSubscription().subscribe(
                            (companiesAndCategories) => {

                                if (companiesAndCategories) {
                                    const marketsInfoCompaniesCategories: MarketsCompaniesCategories = {
                                        markets: marketsInfo.response.markets,
                                        categories: companiesAndCategories.response.CATEGORIES,
                                        companies: companiesAndCategories.response.COMPANIES
                                    };
                                    this.getStreamingServers(useTcToken).subscribe((streamingServers: StreamersResponse) => {
                                            this.onLoaderResponse(loaderResponse, marketsInfoCompaniesCategories, streamingServers, isNewProfile);
                                        },
                                        (error) => {
                                            Tc.error('Error getting Streaming Servers');
                                            this.forceLogout(ForceLogoutType.FailToConnect);
                                        });
                                }
                            },
                            (error) => {
                                Tc.error('Error getting companies and categories');
                                this.forceLogout(ForceLogoutType.FailToConnect);
                            }
                        );
                    },
                    (error) => {
                        Tc.error('Error getting web loader subscription');
                        this.forceLogout(ForceLogoutType.FailToConnect);
                    }
                );
            },
            (error) => {
                Tc.error('Error getting markets info');
                this.forceLogout(ForceLogoutType.FailToConnect);
            }
        );
    }

    private processSnbcapitalLoginInfo(alahliLoginResponse: LoginSnbcapitalResponse){
        this.snbcapitalLoginInfo = {
            domain: alahliLoginResponse.domain,
            domainStreamer: alahliLoginResponse.domain_streamer,
            subscribed: alahliLoginResponse.subscribed,
            username: alahliLoginResponse.username,
            canChangeUsername: alahliLoginResponse.ccu
        }
    }

    private processAlrajhiLoginInfo(alrajhiResponse: LoginAlrajhiResponse){
        this.alrajhicapitalLoginInfo = {
            authUrl: alrajhiResponse.auth_url,
            baseUrl: alrajhiResponse.base_url,
            isUat: alrajhiResponse.is_uat,
            termsAndConditionsUrl: alrajhiResponse.terms_conditions_url,
            domain: alrajhiResponse.domain,
            domainStreamer: alrajhiResponse.domain_streamer,
            subscribed: alrajhiResponse.subscribed,
            clientId: alrajhiResponse.client_id_portal,
            clientSecret: alrajhiResponse.client_secret_portal
        }
    }

    private processMusharakaLoginInfo(musharaka: LoginMusharakaResponse) {
        this.musharakaLoginInfo = {
            baseUrl: musharaka.base_url,
            encryptionKey: musharaka.encryption_key,
            notificationStreamerDomain: window.location.hostname + musharaka.notification_streamer_domain,
            infoUrl: musharaka.info_url,
            subscribed: musharaka.subscribed
        }
    }

    private processBsfLoginInfo(bsf: LoginBsfResponse) {
        this.bsfLoginInfo = {
            baseUrl: bsf.base_url,
            encryptionKey: atob(bsf.encryption_key),
            notificationStreamerDomain: bsf.notification_streamer_domain,
            infoUrl: bsf.info_url,
            subscribed: bsf.subscribed,
            channel: bsf.channel
        }
    }

    private processAlkhabeercapitalLoginInfo(alkhabeercapital: LoginAlkhabeercapitalResponse) {
        this.alkhabeercapitalLoginInfo = {
            baseUrl: alkhabeercapital.base_url,
            encryptionKey: alkhabeercapital.encryption_key,
            notificationStreamerDomain: alkhabeercapital.notification_streamer_domain,
            infoUrl: alkhabeercapital.info_url,
            subscribed: alkhabeercapital.subscribed,
            channel: alkhabeercapital.channel
        }
    }

    private getHttpOptions(observe: boolean, useTcToken: boolean = true): {[key:string]:Object}{
        // MA if token exists, then pass it to web-loader in order to re-use it again (rather than creating every time a new session
        // at the server side).

        let options:{[key:string]:Object} = {};
        if(observe) {
            options = {observe: 'response'};
        }

        if(useTcToken && this.credentialsService.getToken()) {
            options.headers = new HttpHeaders({
                'Authorization': this.credentialsService.getToken()
            });
        }
        return options;
    }

    private getWebLoaderSubscription(): Observable<Object> {
        let url:string = this.toHttps(`https://tickerchart.com/tickerchart_live/live_loader_json_v3.php?version=${this.getVersion()}&language=${this.getLangauge()}`);
        let httpOptions = this.getHttpOptions(true, this.isSubscriber);//only send TcToken to loader if subscriber not for (visitor or subscriber)
        return (this.http.get(Tc.url(url), httpOptions) as Observable<Object>);
    }

    private getMarketsInfoSubscription(useTcToken: boolean, isSnbCapitalUnauthorized: boolean): Observable<MarketsInfoResponse> {
        let options = useTcToken ? this.getHttpOptions(false) : {};
        let snbParam = isSnbCapitalUnauthorized ? '&snb_unauthorized=1' : '';
        let url = this.toHttps(`https://tickerchart.com/m/v2/tickerchart/web/market-info?version=${this.getVersion()}${snbParam}`);
        return this.http.get<MarketsInfoResponse>(Tc.url(url), options);
    }

    private getCompaniesAndCategoriesSubscription(): Observable<CompaniesAndCategoriesResponse> {
        let url =  LoaderConfig.url(this.getConfig(),LoaderUrlType.CompaniesAndCategories);
        return this.http.get<CompaniesAndCategoriesResponse>(Tc.url(url));
    }

    private getStreamingServers(useTcToken: boolean):Observable<StreamersResponse> {
        let url =  this.getStreamersUrl();
        let options = useTcToken ? this.getHttpOptions(false) : {};
        return this.http.get<StreamersResponse>(Tc.url(url), options);
    }

    public getStreamersUrl(): string {
        return LoaderConfig.url(this.getConfig(),LoaderUrlType.Streamers);
    }

    public callMarketsInfo() {
        if (!this.isMarketInfoCalled) {
            // Currently called from Snbcapital login because in mode (Alahli package subscriber user) the loader is not loading yet.
            this.loadMarketsInfo(true, false, false);
        }
    }

    public callMarketsInfoForUnauthorizedSnbCapital() {
        if (!this.isMarketInfoCalled) {
            // Currently called from Snbcapital login because in mode (Alahli package subscriber user) the loader is not loading yet.
            this.loadMarketsInfo(true, true, false);
        }
    }

    public initVisitorToken () {
        //No username => visitor
        this.http.get<InitWebTokenResponse>(this.toHttps(`https://tickerchart.com/m/tickerchart/web/init-token`)).subscribe((initWebTokenResponse) => {
            //Ehab: when user enters as visitor then tries to register / forget password he need to have a token to complete the process
            this.setTcToken(initWebTokenResponse.response.token);
        });
    }

    private onLoaderResponse(response: HttpResponse<LoaderDataResponse> , marketsAndCompanies: MarketsCompaniesCategories, streamingServers: StreamersResponse,isNewProfile: boolean){
        this.processLoaderData(response.body, marketsAndCompanies, streamingServers, isNewProfile)
    }

    private getVersion(){
        return 'web_' + Config.getVersion();
    }

    private getLangauge(){
        return this.languageService.arabic ? 'ARABIC' : 'ENGLISH';
    }

    private showSnbcapitalLogin() {
        if(this.credentialsService.hasUsername()) {
            window.setTimeout(() => {
                this.sharedChannel.request({type: ChannelRequestType.SnbcapitalConnect});
            }, 500);
        }
    }

    private showAlrajhicapitalLogin(delayTime?: number) {
        let request: AlrajhicapitalLoginChannelRequest = {
            type: ChannelRequestType.AlrajhicapitalConnect,
            startConnectingImmediately: !delayTime,
            isAlrajhiSubscriber: true
        };

        if (delayTime && this.credentialsService.hasUsername()) {
            window.setTimeout(() => {
                this.sharedChannel.request(request);
            }, delayTime);
        } else {
            this.sharedChannel.request(request);
        }}

    private showMusharakaLogin(delayTime?: number) {
        let request: MusharakaLoginChannelRequest = {
            type: ChannelRequestType.MusharakaConnect,
            startConnectingImmediately: !delayTime,
            isMusharakaSubscriber: true
        };

        if (delayTime && this.credentialsService.hasUsername()) {
            window.setTimeout(() => {
                this.sharedChannel.request(request);
            }, delayTime);
        } else {
            this.sharedChannel.request(request);
        }
    }

    private showBsfLogin(delayTime?: number) {
        let request: BsfLoginChannelRequest = {
            type: ChannelRequestType.BsfConnect,
            startConnectingImmediately: !delayTime,
            isBsfSubscriber: true
        };

        if (delayTime && this.credentialsService.hasUsername()) {
            window.setTimeout(() => {
                this.sharedChannel.request(request);
            }, delayTime);
        } else {
            this.sharedChannel.request(request);
        }
    }

    private showAlkhabeercapitalLogin(delayTime?: number) {
        let request: AlkhabeercapitalLoginChannelRequest = {
            type: ChannelRequestType.AlkhabeercapitalConnect,
            startConnectingImmediately: !delayTime,
            isAlkhabeercapitalSubscriber: true
        };

        if (delayTime && this.credentialsService.hasUsername()) {
            window.setTimeout(() => {
                this.sharedChannel.request(request);
            }, delayTime);
        } else {
            this.sharedChannel.request(request);
        }
    }

    private setTcToken(tcToken: string) {
        this.token = tcToken;
        this.credentialsService.setToken(this.token);
        this.tcAuthenticatedHttpClient.setToken(this.token);
    }

    getLoginDate(): string{
        return this.date;
    }

    getSnbcapitalLoginInfo(): SnbcapitalLoginInfo{
        return this.snbcapitalLoginInfo;
    }

    getAlrajhicapitalLoginInfo(): AlrajhicapitalLoginInfo{
        return this.alrajhicapitalLoginInfo;
    }
    getMusharakaLoginInfo(): MusharakaLoginInfo{
        return this.musharakaLoginInfo;
    }

    getBsfLoginInfo(): BsfLoginInfo{
        return this.bsfLoginInfo;
    }

    getAlkhabeercapitalLoginInfo(): AlkhabeercapitalLoginInfo{
        return this.alkhabeercapitalLoginInfo;
    }

    getMarketStream():ReplaySubject<Market> {
        return this.marketStream;
    }

    getConfig():LoaderConfig {
        Tc.assert(this.loaderConfig != null, "try to access loader config while it is null");
        return this.loaderConfig;
    }

    getMarketTradingMinutesCount():{[marketAbbrv:string]:number} {
        Tc.assert(this.marketTradingMinutesCount != null, "try to access loader market trading hours while it is null");
        return this.marketTradingMinutesCount;
    }

    getConfigStream():Subject<LoaderConfig> {
        return this.configStream;
    }

    getPackageType(): string {
        Tc.assert(this.packageType!= null, "wrong subscription type.");
        return this.packageType;
    }

    public getEndDate(): string {
        return this.end_date;
    }

    getUserInfo():UserInfo {
        Tc.assert(this.userInfo != null, "try to access loader userinfo while it is null");
        return this.userInfo;
    }

    getGeneralPurposeStreamerUrl():string{
        return this.generalPurposeStreamerUrl;
    }

    getFinancialStreamerUrl(): string {
        return this.financialStreamerUrl;
    }
    getAdvanceMessages():AdvanceMessage[]{
        return this.advanceMessages;
    }

    getSimpleMessages():SimpleMessage[]{
        return this.simpleMessages;
    }

    getBannerMessage():BannerMessage {
        return this.bannerMessage;
    }

    isLoadingDoneStream(){
        return this.loadingDoneStream;
    }

    private processLoaderData(json:LoaderDataResponse, marketsAndCompanies: MarketsCompaniesCategories, streamingServers: StreamersResponse, isNewProfile: boolean) {

        let successResponse:boolean = 'SUCCESS' in json && json.SUCCESS;

        if(!successResponse) {
            this.forceLogout(this.getLogoutTypeFromInvalidMessage(json));
            return;
        }

        // MA When loader succeeds (authenticate user on TickerChart.com), then we need to authenticate user
        // on LiveWeb server. So, user will have a session on LiveWeb server for further requests.
        this.workspaceStateService.registerLiveWebUser().subscribe( (workspaceData: WorkspaceData) => {
            this.processStreamersData(streamingServers);
            this.processUserInfo(json);
            this.processMarketData(json, marketsAndCompanies, streamingServers);
            this.processMessages(json);
            this.processMarketTradingMinutesCount(json,marketsAndCompanies.markets);

            this.predefinedWatchlistService.setLoaderConfig(this.loaderConfig);
            this.predefinedWatchlistService.loadPredefinedFollowedWatchlists().subscribe(()=>{
                //We must prepare the predefined watchlists before assign (configStream and loadingDoneStream) as ready
                //So app has predefined watchlists from the beginning

                this.configStream.next(this.loaderConfig);

                this.marketsManager.getAllMarkets().forEach(market => {
                    this.marketStream.next(market);
                });

                this.proxyService.init(json.DATA["PROXY_URL"], () => {
                        this.workspaceStateService.init(workspaceData);
                        this.loadingDoneStream.next(true);
                    }
                );
                if(this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.LOADER_SHOW_SIGNIN_MODAL)){
                    this.showLoginIfNeeded();
                }
                this.FollowPredefinedWatchlistsIfNeeded(isNewProfile);
            });
        });

    }

    private initAuthorizationAccessType(packageType: PackageType) {
        let isProfessional = packageType == PackageType.Plus || packageType == PackageType.Professional;
        let isAdvanced = packageType == PackageType.Advanced;
        this.authorizationService.setAccessBasedOnSubscriptionStatus(this.isSubscriber, isProfessional, isAdvanced);
    }

    private processMarketData(json: LoaderDataResponse, marketsAndCompanies: MarketsCompaniesCategories, streamingServers:StreamersResponse){
        console.log(json.DATA);

        let market:Market;
        let companiesData: { [key: number]: string[] } = marketsAndCompanies.companies.values;
        let columns: string[] = marketsAndCompanies.companies.columns;
        let sectorsData: CategoryResponse[] = marketsAndCompanies.categories;
        let marketsData: MarketInfoResponse[] = marketsAndCompanies.markets;
        let companyFlagsData:AnnouncementResponse[] = json.DATA['COMPANY_FLAG'];
        let streamingServerData:{[key:number]: StreamingServerResponse} = streamingServers.response.STREAMING_SERVER;
        let technicalReportStreamingServerData:{[key:number]: TechnicalReportsResponse} = streamingServers.response.TECHNICAL_REPORTS_STREAMER_V2;

        let streamingIndicatorServerData:{[key:number]: StreamingServerResponse} = streamingServers.response.STREAMING_INDICATOR_SERVER;
        for(let key in marketsData) {
            let marketId = marketsData[key].market_id;
            //In Cobranding mode like Derayah we will ignore marktes with no remaining days
            let ignoreMarket: boolean = this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.CHECK_SUBSCRIBED_MARKETS) && !marketsData[key].remaining_days;
            if(ignoreMarket)
                continue;

            let marketData = marketsData[key];
            let marketAbbr = marketData.abb;
            let timeSheet: TimeSheet = marketsData[key].time_sheet;
            let marketDepthByPriceTopic = marketData.data_feed.market_depth_price_topic;
            let marketDepthByOrderTopic = marketData.data_feed.market_depth_order_topic;

            let sectors:Sector[] = this.processMarketSectors(marketAbbr, sectorsData);
            let companies:Company[] = this.processMarketCompanies(marketAbbr, companiesData, columns);
            let companyFlags:CompanyFlag[] = this.processCompanyFlags(marketData.abb, companyFlagsData);

            let streamingUrl:string = streamingServerData[marketId].DOMAIN_NAME ? 'https://' + streamingServerData[marketId].DOMAIN_NAME + '/streamhub/' : 'http://' + streamingServerData[marketId].HOST + ':' + streamingServerData[marketId].PORT + '/streamhub/';
            let technicalReportStreamingUrl:string = technicalReportStreamingServerData[marketId].DOMAIN_NAME ? 'https://' + technicalReportStreamingServerData[marketId].DOMAIN_NAME + '/streamhub/' : 'http://' + technicalReportStreamingServerData[marketId].HOST + ':' + technicalReportStreamingServerData[marketId].PORT + '/streamhub/';

            let technicalIndicatorStreamUrl: string = '';

            if(this.isSubscriber && marketData.data_feed.streamer == "real-time" && streamingIndicatorServerData) {//Indicator Server is for subscriber + real time markets only
                technicalIndicatorStreamUrl = streamingIndicatorServerData[marketId].DOMAIN_NAME ? 'https://' + streamingIndicatorServerData[marketId].DOMAIN_NAME + '/streamhub/' : 'http://' + streamingIndicatorServerData[marketId].HOST + ':' + streamingServerData[marketId].PORT +  '/streamhub/';
            }

            let alertHistoryUrl:string = this.toHttps(json.DATA['EXTERNAL_URLS']['ALERTS_HISTORY_PATH'][marketAbbr]);
            let liquidityHistoryUrl:string = this.toHttps(json.DATA['EXTERNAL_URLS']['HISTORICAL_LIQUIDITY_LINK_NEW_V2'][+marketId]['URL']);
            let historicalPricesUrl:string = this.toHttps(streamingServerData[marketId].HISTORICAL_PRICES_PATH);
            let technicalScopeUrl:string = json.DATA['EXTERNAL_URLS']['TECHNICAL_ALERTS_HISTORY_V2'][+marketId]['URL'];

            market = new Market(+marketId,
                marketAbbr,
                marketData.a_name,
                marketData.name,
                this.languageService.arabic ? marketData.a_name : marketData.name,
                marketData.short_a_name,
                marketData.short_name,
                this.languageService.arabic ? marketData.short_a_name : marketData.short_name,
                historicalPricesUrl,
                streamingUrl,
                technicalReportStreamingUrl,
                timeSheet.start,
                timeSheet.end,
                marketDepthByPriceTopic,
                marketDepthByOrderTopic,
                sectors,
                companies,
                companyFlags,
                alertHistoryUrl,
                liquidityHistoryUrl,
                technicalScopeUrl,
                technicalIndicatorStreamUrl,
                marketData.data_feed.streamer == "real-time",
            );
            this.marketsManager.addMarket(market);
        }

        this.marketsManager.initSelectedMarketForNonSubscribers();
    }

    private processConfigData(json: LoaderDataResponse){

        let marketAlertsData = json.DATA['MARKET_ALARM'];

        let marketAlertsConfig:MarketAlertsConfig = {};

        for(let key in marketAlertsData) {
            marketAlertsConfig[key.toLowerCase()] = {
                key: key,
                english: marketAlertsData[key]['MSG'],
                arabic: marketAlertsData[key]['MSG_A'],
            };
        }

        let contactUsData = this.languageService.arabic ? json.DATA['CONTACT_US']['ARABIC'] : json.DATA['CONTACT_US']['ENGLISH'];

        let contactUs:ContactUsConfig = {
            fromDay:contactUsData['FROM_DAY'],
            toDay:contactUsData['TO_DAY'],
            fromTime:contactUsData['FROM_TIME'],
            toTime:contactUsData['TO_TIME'],
            whatsAppNumber:contactUsData['WHATSAPP_PHONE'],
            insideSaudiNumber:contactUsData['SAUDI_PHONE'],
            outsideSaudiNumber:contactUsData['INTERNATIONAL_PHONE'],
        };

        let brokerUser: string = json.DATA['BROKER_USER'] ? json.DATA['BROKER_USER'] : null;

        let urls:{[key:string]:string} = {};

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AlertsBase)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALERTS_BASE_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AnnouncementSearch)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ANNOUNCEMENT_SEARCH']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AnnouncementLatest)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ANNOUNCEMENT_LATEST']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AnnouncementCategory)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ANNOUNCEMENT_CATEGORY']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.NewsTitle)] = this.toHttps(json.DATA['EXTERNAL_URLS']['NEWS_TITLE']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.Guid)] = this.toHttps(json.DATA['EXTERNAL_URLS']['GUID_PAGE']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.BrokerGuid)] = json.DATA['EXTERNAL_URLS']['BROKER_GUID_PAGE'] ? this.toHttps(json.DATA['EXTERNAL_URLS']['BROKER_GUID_PAGE']) : '';

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.DerayahIntegrationLink)] = this.toHttps(json.DATA['EXTERNAL_URLS']['DIL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.DerayaAuthUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['DERAYAH_AUTHORIZE_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.DerayahOauthBaseUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['DERAYAH_OAUTH_BASE_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.DerayaTokenUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['DERAYAH_TOKEN_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.DerayahClientId)] = atob(json.DATA['EXTERNAL_URLS']['DERAYAH_CLIENT_I']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.DerayahClientSecret)] = atob(json.DATA['EXTERNAL_URLS']['DERAYAH_CLIENT_S']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.DerayahTokenBySessionUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['DERAYAH_TOKEN_BY_SESSION_URL']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.RiyadcapitalBaseUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['RIYAD_CAPITAL_BASE_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.BrokerRegisterLink)] = this.toHttps(json.DATA['EXTERNAL_URLS']['BROKER_REGISTER']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.RiyadcapitalRefreshInterval)] = this.toHttps(json.DATA['EXTERNAL_URLS']['RIYAD_CAPITAL_REFRESH_INTERVAL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteRiyadcapitalInfo)] = this.toHttps(json.DATA['EXTERNAL_URLS']['RIYAD_CAPITAL_INFO']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AlinmainvestBaseUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALINMA_INVEST_BASE_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AlinmainvestOauthBaseUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALINMA_INVEST_OAUTH_BASE_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AlinmainvestRefreshInterval)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALINMA_INVEST_REFRESH_INTERVAL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteAlinmainvestInfo)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALINMA_INVEST_INFO_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AlinmainvestPortfolioBaseUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALINMA_INVEST_PORTFOLIO_BASE_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AlinmainvestOrdersBaseUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALINMA_INVEST_ORDERS_BASE_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AlinmainvestClientId)] = atob(json.DATA['EXTERNAL_URLS']['ALINMA_INVEST_CLIENT_I']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AlinmainvestClientSecret)] = atob(json.DATA['EXTERNAL_URLS']['ALINMA_INVEST_CLIENT_S']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AljaziracapitalBaseUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALJAZIRA_CAPITAL_BASE_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AljaziracapitalRefreshInterval)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALJAZIRA_CAPITAL_REFRESH_INTERVAL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteAljaziracapitalInfo)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALJAZIRA_CAPITAL_INFO']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteAlrajhiInfoUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALRAJHI_INFO_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AlrajhiRefreshInterval)] = this.toHttps(json.DATA['EXTERNAL_URLS']['ALRAJHI_REFRESH_INTERVAL']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.VirtualTradingUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['VIRTUAL_TRADING_URL']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.MarketsTickSize)] = this.toHttps(json.DATA['EXTERNAL_URLS']['MARKETS_TICK_SIZE']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AnalystsList)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_ANALYSTS_BY_MARKET']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AnalysisByMarket)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_ANALYSIS_BY_MARKET']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.AnalysisByCompany)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_ANALYSIS_BY_COMPANY']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityIdeas)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_IDEA_STREAM']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityNotifications)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_PROFILE_NOTIFICATIONS']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityMyIdeas)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_MY_IDEAS']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.MarkNotificationsAsRead)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_NOTIFICATION_READ']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityHomePageUrl)] = this.setLanguage(this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_PORTAL_BASE_PAGE']));
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityIdeaUrl)] = this.setLanguage(this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_PORTAL_IDEA_PAGE']));
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityUserProfileUrl)] = this.setLanguage(this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_PORTAL_PROFILE_PAGE']));
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityCompanyUrl)] = this.setLanguage(this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_PORTAL_COMPANY_PAGE']));
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityMarketUrl)] = this.setLanguage(this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_PORTAL_MARKET_ANALYSIS_PAGE']));

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityPublishChart)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_PUBLISH_IDEA']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityProfileInfo)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_MY_PROFILE']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunitySaveProfile)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_PROFILE_REPLACE']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityNickNameCheck)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_NICK_NAME_CHECK']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityCategoriesList)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_CATEGORIES_LIST']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CommunityTagsSearch)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMMUNITY_API_TAGS_SEARCH']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteUpgradeSubscription)] = this.toHttps(json.DATA['EXTERNAL_URLS']['WEBSITE_UPGRADE_SUBSCRIPTION']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteTokenGenerator)] = this.toHttps(json.DATA['EXTERNAL_URLS']['DAUTH_URL']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteRedirect)] = this.toHttps(json.DATA['EXTERNAL_URLS']['WEBSITE_REDIRECT']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteViewSubscribtions)] = this.toHttps(json.DATA['EXTERNAL_URLS']['WEBSITE_VIEW_SUBSCRIBTION']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteSubscribe)] = this.toHttps(json.DATA['EXTERNAL_URLS']['WEBSITE_SUBSCRIBTION']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteReward)] = this.toHttps(json.DATA['EXTERNAL_URLS']['WEBSITE_ACCOUNT_REWARD']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.Screenshots)] = this.toHttps(json.DATA['EXTERNAL_URLS']['SCREEN_SHOT']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteDerayahInfo)] = this.toHttps(json.DATA['EXTERNAL_URLS']['DERAYAH_INFO']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteSnbcapitalInfo)] = 'https://www.tickerchart.com/m/w/tickerchart-snbcapital';
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteVirtualTradingInfo)] = this.toHttps(json.DATA['EXTERNAL_URLS']['VIRTUAL_TRADING_INFO']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TcWebsiteTradestationInfo)] = this.toHttps(json.DATA['EXTERNAL_URLS']['TRADE_STATION_INFO']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.Shareholders)] = this.toHttps(json.DATA['EXTERNAL_URLS']['MAJOR_STAKEHOLDERS']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.TradestationIntegrationLink)] = this.toHttps(json.DATA['EXTERNAL_URLS']['TSIL']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.DerayahNotifications)] = this.toHttps(json.DATA['EXTERNAL_URLS']['DERAYAH_NOTIFICATIONS']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.FinancialBaseUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['FINANCIAL_BASE_URL']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.CompaniesAndCategories)] = this.toHttps(json.DATA['EXTERNAL_URLS']['COMPANIES_AND_CATEGORIES']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.Streamers)] = this.toHttps(json.DATA['EXTERNAL_URLS']['STREAMERS']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.PredefinedWatchlists)] = this.toHttps(json.DATA['EXTERNAL_URLS']['PREDEFINED_WATCHLISTS_LIST']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.FollowedPredefinedWatchlists)] = this.toHttps(json.DATA['EXTERNAL_URLS']['PREDEFINED_WATCHLISTS_FOLLOWED_LIST']);
        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.SaveFollowingWatchlists)] = this.toHttps(json.DATA['EXTERNAL_URLS']['PREDEFINED_WATCHLISTS_FOLLOW']);

        urls[Tc.enumString(LoaderUrlType, LoaderUrlType.IndexCalculationUrl)] = this.toHttps(json.DATA['EXTERNAL_URLS']['INDEX_CALCULATION']);

        let loaderConfig:LoaderConfig = {
            marketAlerts: marketAlertsConfig,
            contactUs: contactUs,
            guidInterval: +json.DATA['SENDING_GUID_INTERVAL'],
            guidKey: json.DATA['GUID_TAG'],
            urls:urls,
            brokerUser: brokerUser,
            enableAlrajhi: json.DATA['EXTERNAL_URLS']['ENABLE_ALRAJHI']
        };

        Config.urlSigningDate = json.DATA['CURRENT_DATE'];

        this.loaderConfig = loaderConfig;
    }

    private setLanguage(url:string){
        return url.replace('{0}','ar')
    }

    private toHttps(url:string){
        return url.replace("http://", "https://");
    }

    private processUserInfo(json: LoaderDataResponse){

        let personalInformationData = json.DATA['PERSONAL_INFORMATION'];

        let userInfo:UserInfo = {
            userId:json.DATA['U'],
            username: this.credentialsService.username,
            name: personalInformationData['FULL_NAME'] ? personalInformationData['FULL_NAME'] : '',
            email: personalInformationData['EMAIL'] ? personalInformationData['EMAIL'] : '',
            phone: personalInformationData['MOBILE_NUMBER'] ? personalInformationData['MOBILE_NUMBER'] : '',
        };

        this.userInfo = userInfo;

    }

    private processCompanyFlags(marketAbbreviation:string, companyFlagsData:AnnouncementResponse[]):CompanyFlag[] {
        let companyFlags:CompanyFlag[] = [];
        companyFlagsData.forEach((companyFlagData:AnnouncementResponse) => {
            if(companyFlagData.SYMBOL.endsWith('.' + marketAbbreviation)){

                let announcementFlag:string = companyFlagData.FLAG;
                let announcementSummary:string = companyFlagData.ANNOUNCEMENT_SUMMARY.length ? companyFlagData.ANNOUNCEMENT_SUMMARY : this.getDefaultAnnouncementSummary(announcementFlag);

                let companyFlag:CompanyFlag = {
                    symbol: companyFlagData.SYMBOL,
                    flag: announcementFlag,
                    announcement: announcementSummary
                };
                companyFlags.push(companyFlag);
            }
        });
        return companyFlags;
    }

    private processMarketSectors(marketAbbr:string, sectorsData:CategoryResponse[]):Sector[] {
        let sectors:Sector[] = [];
        for(let index in sectorsData){
            let sectorData:CategoryResponse = sectorsData[index];
            if(sectorData["MARKET_ABB"] != marketAbbr){
                continue;
            }
            let sector:Sector = {
                id: +sectorData.CATEGORY_ID,
                english: sectorData.NAME,
                arabic: sectorData.A_NAME
            };
            sectors.push(sector);
        }
        return sortBy(sectors, (sector: Sector) => sector.id);
    }

    private processMarketCompanies(marketAbbr:string, companiesData:{[key:number]: string[]}, columns:string[]): Company[] {

        let mapping:{[column:string]:number} = {};
        for(let index in columns){
            let columnName:string = columns[index];
            mapping[columnName] = +index;
        }


        let companies:Company[] = [];
        for(let index in companiesData){
            let companyData:string[] = companiesData[index];
            if(companyData[mapping['MARKET_ABB']] != marketAbbr){
                continue;
            }
            let company:Company = {
                id: +index,
                symbol: companyData[mapping['TICKER']] + '.' + marketAbbr,
                index: companyData[mapping['IS_INDEX']] == 'YES',
                categoryId: +companyData[mapping['CATEGORY_ID']],
                english: companyData[mapping['NAME']],
                arabic: companyData[mapping['A_NAME']],
                name: this.languageService.arabic ? companyData[mapping['A_NAME']] : companyData[mapping['NAME']],
                generalIndex: companyData[mapping['IS_INDEX']] == 'YES' && +companyData[mapping['CATEGORY_ID']] == 5, // NK 5 is always the id of the market general index
                tags : this.processCompanyTags(companyData[mapping['TAGS']])
            };

            companies.push(company);
        }

        return companies;
    }

    private processCompanyTags(tags: string): CompanyTag[] {
        if(tags == undefined) { return []; }

        let companyTags: CompanyTag[] = [];
        let arrayOfTags = Loader.processCompanyTags(tags);

        if (arrayOfTags.length == 0) { return []; }

        arrayOfTags.forEach(tag => {
            if (tag == 'usa_supported') {
                companyTags.push(CompanyTag.USA_SUPPORTED);
            }
            if (tag == 'dow30') {
                companyTags.push(CompanyTag.USA_DOWJONES);
            }
        });

        return companyTags;
    }

    private static processCompanyTags(tags:string) :string[] {
        if(tags) {
            return tags.split(',');
        }
        return [];
    }

    private processStreamersData(streamingServers: StreamersResponse):void{
        let generalPurposeObject = streamingServers.response.GENERAL_PURPOSE_STREAMER;
        this.generalPurposeStreamerUrl = 'https://' + generalPurposeObject.DOMAIN_NAME + '/streamhub/';
        this.financialStreamerUrl =  'https://' + streamingServers.response.FINANCIAL_STREAMER.DOMAIN_NAME + '/streamhub/';
    }

    private processMessages(json: LoaderDataResponse){
        let simpleMessages = json.DATA['SIMPLE_MESSAGES'];
        for(let simpleMessage of simpleMessages){
            this.simpleMessages.push({body:simpleMessage});
        }

        let advanceMessages = json.DATA['ADVANCE_MESSAGES'];
        for(let advanceMessage of advanceMessages){
            this.advanceMessages.push({
                body:advanceMessage['BODY'],
                button:advanceMessage['BUTTON'],
                title:advanceMessage['TITLE'],
                url:this.toHttps(advanceMessage['URL'])
            })
        }

        this.bannerMessage = json.DATA['BANNER_MESSAGE'] ?
            {
                url: json.DATA['BANNER_MESSAGE']['URL'],
                arabicUrlText: json.DATA['BANNER_MESSAGE']['ARABIC_URL_TEXT'],
                englishUrlText: json.DATA['BANNER_MESSAGE']['ENGLISH_URL_TEXT'],
                imageUrl: json.DATA['BANNER_MESSAGE']['IMAGE_URL'],
                mobileImageUrl: json.DATA['BANNER_MESSAGE']['IMAGE_URL_MOBILE'],
                daysCount: json.DATA['BANNER_MESSAGE']['DAYS_COUNT']
            } : null;

    }

    private processMarketTradingMinutesCount(json: LoaderDataResponse,markets: MarketInfoResponse[]){
        this.marketTradingMinutesCount = {};

        for(let key in markets){
            let market = markets[key];
            //In Cobranding mode like Derayah we will ignore marktes with no remaining days
            let ignoreMarket: boolean = this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.CHECK_SUBSCRIBED_MARKETS) && !market.remaining_days;
            if(ignoreMarket)
                continue;

            this.marketTradingMinutesCount[market.abb] = moment(market.time_sheet.end, 'HH:mm:ss').diff(moment(market.time_sheet.start, 'HH:mm:ss'),'minutes');
        }
    }

    private getLogoutTypeFromInvalidMessage(json: LoaderDataResponse):ForceLogoutType {

        let hasInvalidMessage:boolean = 'SUCCESS' in json && !json.SUCCESS && json.DATA['INVALID'];

        if(!hasInvalidMessage){
            Tc.error('loader returned an invalid response');
        }

        let invalidMessage = json.DATA['INVALID'];
        let type:ForceLogoutType;
        //NK the invalid message sent by Ehab
        switch (invalidMessage) {
            case 'INVALID_AUTH':
                type = ForceLogoutType.InvalidCredentials;
                break;
            case 'UNSUBSCRIBED':
                type = ForceLogoutType.UnsubscripedUser;
                break;
            default:
                type = ForceLogoutType.FailToConnect;
                break;
        }
        return type;
    }

    private forceLogout(type:ForceLogoutType) {
        this.logoutService.forceLogout(type);
    }

    private getDefaultAnnouncementSummary(announcementFlag:string):string{
        switch (announcementFlag){
            case "r"://Red flag
                return "نسبة خسارة الشركة 50% أو أكثر من رأس المال";
            case "o"://Orange flag
                return "تتراوح نسبة خسارة الشركة بين 35% و 50% من رأس المال";
            case "y"://Yellow flag
                return "تتراوح نسبة خسارة الشركة بين 20% و 35% من رأس المال";
        }

        Tc.error("Unknown announcement flag type:  " + announcementFlag);
    }

    private showLoginIfNeeded() {
        // We added some delay to not show modal immediately
        if(this.authorizationService.isVisitor() && this.credentialsService.hasUsername()) {
            window.setTimeout(() => {
                this.sharedChannel.request({type: ChannelRequestType.SignIn});
            }, 500);
        }
    }

    private FollowPredefinedWatchlistsIfNeeded(isNewProfile: boolean) {
        // We added some delay to not show modal immediately
        if(isNewProfile){
            window.setTimeout(() => {
                this.sharedChannel.request({type: ChannelRequestType.FollowPredefinedWatchlists});
            }, 500);
        }
    }

}

interface LoaderDataResponse {
    SUCCESS: boolean,
    DATA:Object
}

interface AnnouncementResponse {
    ANNOUNCEMENT_SUMMARY: string,
    FLAG: string,
    SYMBOL: string
}

interface StreamingServerResponse {
    ABB: string,
    DOMAIN_NAME: string,
    HISTORICAL_PRICES_PATH: string,
    HOST: string,
    PORT: string
}

interface TechnicalReportsResponse {
    ABB: string,
    DOMAIN_NAME: string,
    HOST: string,
    PORT: string
}

interface MarketTimeResponse {
    END_TIME: string,
    MARKET_ID: string,
    START_TIME: string
}

interface InitWebTokenResponse {
    success: boolean,
    response: {
        token: string
    }
}

interface LoginResponse {
    success: boolean,
    response: {
        token: string,
        date: string,
        alahli: LoginSnbcapitalResponse,
        alrajhi: LoginAlrajhiResponse,
        musharaka:LoginMusharakaResponse,
        bsf:LoginBsfResponse,
        alkhabeer:LoginAlkhabeercapitalResponse,

        package: LoginPackageResponse,
    },
    new_profile: boolean
}

export enum PackageType {
    //todo we have to remove (lite and plus) after deployed new subscription mode
    Plus = "PLUS",
    Free = "FREE",
    Lite = "LITE",
    Professional = 'PROFESSIONAL',
    Advanced = "ADVANCED",
    Basic = 'BASIC',
    DerayahBasic = 'DERAYAH_LITE',
}

interface LoginSnbcapitalResponse {
    domain: string,
    domain_streamer: string,
    subscribed: true,
    username: string,
    ccu: boolean
}

interface LoginAlrajhiResponse {
    base_url: string,
    auth_url: string,
    desktop_auth_url: string,
    domain: string,
    domain_streamer: string,
    subscribed: boolean,
    is_uat: boolean,
    terms_conditions_url: string,
    client_id_portal: string,
    client_secret_portal: string
}
interface LoginMusharakaResponse {
    base_url: string,
    encryption_key: string,
    notification_streamer_domain: string,
    info_url: string,
    subscribed: boolean
}

interface LoginBsfResponse {
    base_url: string,
    encryption_key: string,
    notification_streamer_domain: string,
    info_url: string,
    subscribed: boolean
    channel: string
}

interface LoginAlkhabeercapitalResponse {
    base_url: string,
    encryption_key: string,
    notification_streamer_domain: string,
    info_url: string,
    subscribed: boolean,
    channel: string
}

interface LoginPackageResponse {
    package_id: string,
    package_type: PackageType,
    package_name_ar: string,
    package_name_en: string,
    start_date: string,
    end_date: string,
    remaining_days: number
}

interface TadawulServicesResponse {
    derivatives: TadawulService,
    nomu: TadawulService,
    sukuk_bonds: TadawulService
}

interface TadawulService {
    enabled: boolean
    category_id: string
}

interface MarketsInfoResponse {
    success: boolean;
    response: {
        markets: [MarketInfoResponse];
    };
}

interface MarketInfoResponse {
    market_id: string,
    abb: string,
    name: string,
    short_name: string,
    a_name: string,
    short_a_name: string,
    data_feed: DataFeedResponse,
    time_sheet: TimeSheet,
    start_date: string,
    end_date: string,
    remaining_days: number,
    market_service_type_ar: string,
    market_service_type_en: string
}

interface DataFeedResponse {
    streamer: string,
    market_depth_order_topic: string,
    market_depth_price_topic: string
}

interface TimeSheet {
    start: string,
    end: string,
    hours: string
}

interface CompaniesAndCategoriesResponse {
    success: boolean;
    response: {
        COMPANIES: CompaniesResponse;
        CATEGORIES: CategoryResponse[];
    };
}

interface CompaniesResponse{
    columns: string[];
    values: {[key: number]: string[]};
}

interface CategoryResponse {
    A_NAME: string,
    CATEGORY_ID: string,
    MARKET_ABB: string,
    NAME: string
}

interface MarketsCompaniesCategories {
    markets: MarketInfoResponse[];
    categories: CategoryResponse[];
    companies: CompaniesResponse;
}

// streaming servers interfaceS
export interface StreamersResponse {
    success: boolean;
    response: {
        STREAMING_SERVER: {[key:number]: StreamingServerResponse},
        STREAMING_INDICATOR_SERVER?: {[key:number]: StreamingServerResponse}, //Optional for subscribers only
        GENERAL_PURPOSE_STREAMER: Streamer,
        TECHNICAL_REPORTS_STREAMER?: Streamer, //Optional for subscribers only
        TECHNICAL_REPORTS_STREAMER_V2?: {[key:number]: TechnicalReportsResponse},
        FINANCIAL_STREAMER: Streamer,
    };
}

export interface Streamer {
    ABB: string;
    HOST: string;
    PORT: string;
    DOMAIN_NAME: string;
    HISTORICAL_PRICES_PATH?: string; // This property is for only MARKET
}
