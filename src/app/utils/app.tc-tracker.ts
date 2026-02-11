import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TcUrlUtils,EnumUtils ,ChartLibTechnicalIndicatorType} from 'tc-web-chart-lib';
import {GridBoxType} from "../components/shared/grid-box/grid-box-type";
import {Config} from '../config/config';
import {CredentialsStateService} from "../services/state/credentials/credentials-state.service";
import {ForceLogoutType} from "../services/logout/force-logout-type";
import {FontSize} from "../services/state/misc/misc-state.service";
import {IntervalType, PeriodType , ChartLibPriceStyleType} from 'tc-web-chart-lib';
import {AppBrowserUtils} from './app.browser.utils';

@Injectable()
export class AppTcTracker {

    private tracks:string[] = [];

    private static instance:AppTcTracker;

    constructor(private http:HttpClient, private credentialsService:CredentialsStateService) {
        window.setInterval(() => this.sendToServer(), 30 * 1000);
        AppTcTracker.instance = this;
        window.setInterval(() => AppTcTracker.trackConnected(), 5 * 60 * 1000);
    }

    static isEnabled():boolean {
        return AppTcTracker.instance != null;
    }

    /* track on login */
    static trackUserAgent(userAgent:string){
        AppTcTracker.instance.track('browser', userAgent);
    }

    static trackScreenSize(width:number, height:number){
        AppTcTracker.instance.track('screen', width + '-' + height);
    }

    static trackLoggedIn() {
        AppTcTracker.instance.track('login');
    }

    static trackLoggedOut() {
        AppTcTracker.instance.track('logout');
    }

    static trackForceLogout(type:ForceLogoutType) {
        AppTcTracker.instance.track('logout', 'error', EnumUtils.enumValueToString(ForceLogoutType, type).toLowerCase());
    }

    static trackFontSize(fontSize:FontSize) {
        AppTcTracker.instance.track('font', EnumUtils.enumValueToString(FontSize, fontSize).toLowerCase());
    }

    static trackCampaignId(campaignId: string, trackingId:string) {
        AppTcTracker.instance.track('cid', campaignId);
        AppTcTracker.instance.track('cid-trading-id', trackingId);
    }

    /* pulse */
    static trackConnected(){
        AppTcTracker.instance.track('connected');
    }

    /* track on loading workspace */
    static trackLoadWorkspace(){
        AppTcTracker.instance.track('workspace', 'load');
    }
    static trackFiltersCount(count:number) {
        AppTcTracker.instance.track('filters', 'c', count + '');
    }
    static trackWatchlistsCount(count:number) {
        AppTcTracker.instance.track('watchlists', 'c', count + '');
    }
    static trackUserDefinedIntervalsCount(count:number) {
        AppTcTracker.instance.track('userDefinedIntervals', 'c', count + '');
    }
    static trackPagesCount(count:number) {
        AppTcTracker.instance.track('pages', 'c', count + '');
    }
    static trackBoxesCount(count:number) {
        AppTcTracker.instance.track('boxes', 'c', count + '');
    }

    /* track news */
    static trackViewNews() {
        AppTcTracker.instance.track('news', 'view');
    }

    static trackViewAnalysis(){
        AppTcTracker.instance.track('analysis', 'view');
    }

    /* track mult-screen actions */
    static trackToggleToolbar() {
        AppTcTracker.instance.track('toolbar', 'toggle');
    }
    static trackAutoLink() {
        AppTcTracker.instance.track('autolink');
    }
    static trackToggleMaximizeBox() {
        AppTcTracker.instance.track('maximize-box', 'toggle');
    }
    static trackToggleMaximizeScreen() {
        AppTcTracker.instance.track('maximize-screen', 'toggle');
    }
    static trackToggleMarketDetails() {
        AppTcTracker.instance.track('market-details', 'toggle');
    }
    static trackDocking() {
        AppTcTracker.instance.track('docking', 'dock');
    }

    /* track chart operations */
    static trackChartScreenshot() {
        AppTcTracker.instance.track('chart', 'screenshot');
    }
    static trackChartPriceStyle(type:ChartLibPriceStyleType) {
        AppTcTracker.instance.track('chart', 'pricestyle', EnumUtils.enumValueToString(ChartLibPriceStyleType, type).toLowerCase());
    }
    static trackChartPeriod(type:PeriodType){
        AppTcTracker.instance.track('chart', 'period', EnumUtils.enumValueToString(PeriodType, type).toLowerCase());
    }
    static trackChartInterval(type:IntervalType) {
        AppTcTracker.instance.track('chart', 'interval', EnumUtils.enumValueToString(IntervalType, type).toLowerCase());
    }
    static trackChartIndicator(type:ChartLibTechnicalIndicatorType) {
        AppTcTracker.instance.track('chart', 'indicator', EnumUtils.enumValueToString(ChartLibTechnicalIndicatorType, type).toLowerCase());
    }
    static trackChartMovingAverage(type:ChartLibTechnicalIndicatorType, period:number) {
        AppTcTracker.instance.track('chart', 'avg', EnumUtils.enumValueToString(ChartLibTechnicalIndicatorType, type).toLowerCase() + '-' + period);
    }

    /* track volume profiler */
    static trackVolumeProfilerRequest() {
        AppTcTracker.instance.track('volume-profiler', 'request');
    }

    static trackFinancialRequest() {
        AppTcTracker.instance.track('financial', 'request');
    }

    /* track connection */
    static trackConnectTo(hostname:string){
        AppTcTracker.instance.track('streamer', 'connect', hostname);
    }
    static trackHeartbeatDisconnection(market:string) {
        AppTcTracker.instance.track('heartbeat:' + market, 'disconnection');
    }
    static trackHeartbeatReloading(market:string) {
        AppTcTracker.instance.track('heartbeat:' + market, 'reloading');
    }

    /* track user operation */
    static trackContactUs() {
        AppTcTracker.instance.track('support', 'contactus');
    }

    /* track open screen */
    static trackAddBox(type:GridBoxType) {
        AppTcTracker.instance.track('grid', 'add-box', EnumUtils.enumValueToString(GridBoxType, type).toLowerCase());
    }
    static trackCloseBox(type:GridBoxType) {
        AppTcTracker.instance.track('grid', 'close-box', EnumUtils.enumValueToString(GridBoxType, type).toLowerCase());
    }
    static trackOpenWatchlistProperties() {
        AppTcTracker.instance.track('watchlist', 'properties');
    }
    static trackOpenAlertCenter() {
        AppTcTracker.instance.track('alert', 'center');
    }
    static trackOpenFilterProperties() {
        AppTcTracker.instance.track('filter', 'properties');
    }

    /* track cloud watchlist */
    static trackCreateSyncCloudWatchlist() {
        AppTcTracker.instance.track('watchlist-sync-cloud', 'create');
    }
    static trackDeleteSyncCloudWatchlist() {
        AppTcTracker.instance.track('watchlist-sync-cloud', 'delete');
    }
    static trackDeleteNonSyncedCloudWatchlist() {
        AppTcTracker.instance.track('watchlist-sync-cloud', 'delete-non-synced');
    }
    static trackUpdateSyncCloudWatchlist() {
        AppTcTracker.instance.track('watchlist-sync-cloud', 'update');
    }
    static trackRefreshSyncCloudWatchlist() {
        AppTcTracker.instance.track('watchlist-sync-cloud', 'refresh');
    }
    static trackDeleteCloudWatchlist() {
        AppTcTracker.instance.track('watchlist-cloud', 'delete');
    }
    static trackCreateOrUpdateCloudWatchlist() {
        AppTcTracker.instance.track('watchlist-cloud', 'create-or-update');
    }

    /* track watchlist */
    static trackCreateWatchlist() {
        AppTcTracker.instance.track('watchlist', 'create');
    }
    static trackDeleteWatchlist() {
        AppTcTracker.instance.track('watchlist', 'delete');
    }

    /* track filters */
    static trackCreateFilter() {
        AppTcTracker.instance.track('filter', 'create');
    }
    static trackDeleteFilter() {
        AppTcTracker.instance.track('filter', 'delete');
    }

    /* track pages */
    static trackChangePage() {
        AppTcTracker.instance.track('page', 'change');
    }
    static trackCreatePage() {
        AppTcTracker.instance.track('page', 'create');
    }
    static trackDeletePage() {
        AppTcTracker.instance.track('page', 'delete');
    }

    /* track drawings */
    static trackSaveDrawing() {
        AppTcTracker.instance.track('drawing', 'save');
    }
    static trackLoadDrawing() {
        AppTcTracker.instance.track('drawing', 'load');
    }
    static trackDeleteDrawing() {
        AppTcTracker.instance.track('drawing', 'delete');
    }

    /* track alert */
    static trackSaveAlert() {
        AppTcTracker.instance.track('alert', 'save');
    }
    static trackUpdateAlert() {
        AppTcTracker.instance.track('alert', 'update');
    }
    static trackDeleteAlert() {
        AppTcTracker.instance.track('alert', 'delete');
    }

    /* track workspace */
    static trackUpdateWorkspace() {
        AppTcTracker.instance.track('workspace', 'update');
    }
    static trackSelectWorkspace() {
        AppTcTracker.instance.track('workspace', 'select');
    }
    static trackResetWorkspace() {
        AppTcTracker.instance.track('workspace', 'reset');
    }
    static trackMigrateWorkspace() {
        AppTcTracker.instance.track('workspace', 'migrate');
    }
    static trackDeleteWorkspace() {
        AppTcTracker.instance.track('workspace', 'delete');
    }

    static trackCreateWorkspace() {
        AppTcTracker.instance.track('workspace', 'create');
    }

    static trackMarkDefaultWorkspace() {
        AppTcTracker.instance.track('workspace', 'mark-default');
    }

    /* track performance */
    static trackSlowRequest(request:string, duration:number) {
        AppTcTracker.instance.track('perf', request, '' + duration);
    }

    /* track derayah */

    static trackConnectedToDerayah(){
        AppTcTracker.instance.track('api', 'enabled');
    }

    /* track snbcapital */

    static trackConnectedToSnbcapital(){
        AppTcTracker.instance.track('api', 'enabled');
    }

    /* track alrajhicapital */

    static trackConnectedToAlrajhicapital(){
        AppTcTracker.instance.track('api', 'enabled');
    }

    /* track riyadcapital */

    static trackConnectedToRiyadcapital(){
        AppTcTracker.instance.track('api', 'enabled');
    }

    /* track alinmainvest */

    static trackConnectedToAlinmainvest(){
        AppTcTracker.instance.track('api', 'enabled');
    }

    static trackConnectedToAljaziracapital(){
        AppTcTracker.instance.track('api', 'enabled');
    }

    static trackConnectedToMusharaka(){
        AppTcTracker.instance.track('api', 'enabled');
    }

    static trackConnectedToBsf(){
        AppTcTracker.instance.track('api', 'enabled');
    }

    static trackConnectedToAlkhabeercapital(){
        AppTcTracker.instance.track('api', 'enabled');
    }

    /* track virtual trading */
    static trackConnectedToVirtualTrading():void{
        AppTcTracker.instance.track("virtual-trading", "enabled");
    }

    static trackVirtualTradingAddBuyFromChart():void{
        AppTcTracker.instance.track("virtual-trading-chart", "add-buy");
    }

    static trackVirtualTradingAddStopFromChart():void{
        AppTcTracker.instance.track("virtual-trading-chart", "add-stop");
    }

    static trackVirtualTradingAddSellFromChart():void{
        AppTcTracker.instance.track("virtual-trading-chart", "add-sell");
    }

    static trackVirtualTradingUpdateOrderFromChart():void{
        AppTcTracker.instance.track("virtual-trading-chart", "update-order");
    }

    static trackVirtualTradingUpdateTakeProfitFromChart():void{
        AppTcTracker.instance.track("virtual-trading-chart", "update-take-profit");
    }

    static trackVirtualTradingUpdateStopLossFromChart():void{
        AppTcTracker.instance.track("virtual-trading-chart", "update-stop-loss");
    }

    static trackVirtualTradingSellPositionFromChart():void{
        AppTcTracker.instance.track("virtual-trading-chart", "position-sell");
    }

    static trackVirtualTradingDeleteOrderFromChart():void {
        AppTcTracker.instance.track("virtual-trading-chart", "delete-order");
    }

    static trackVirtualTradingCancelTakeProfitFromChart():void {
        AppTcTracker.instance.track("virtual-trading-chart", "cancel-take-profit");
    }

    static trackVirtualTradingCancelStopLossFromChart():void {
        AppTcTracker.instance.track("virtual-trading-chart", "cancel-stop-loss");
    }

    static trackVirtualTradingAddManualOrder():void{
        AppTcTracker.instance.track("virtual-trading-manual-order", "add");
    }

    static trackVirtualTradingAddCapital():void{
        AppTcTracker.instance.track("virtual-trading-capital", "add");
    }

    static trackVirtualTradingAddOrder():void{
        AppTcTracker.instance.track("virtual-trading-order", "add");
    }

    static trackVirtualTradingUpdateOrder():void{
        AppTcTracker.instance.track("virtual-trading-order", "update");
    }

    static trackVirtualTradingDeleteOrder():void{
        AppTcTracker.instance.track("virtual-trading-order", "delete");
    }

    static trackVirtualTradingDeleteAccount():void{
        AppTcTracker.instance.track("virtual-trading-account", "delete");
    }

    static trackVirtualTradingCreateAccount():void{
        AppTcTracker.instance.track("virtual-trading-account", "create");
    }

    static trackVirtualTradingShowTransactions():void{
        AppTcTracker.instance.track("virtual-trading-transactions", "view");
    }

    static trackTradestationShowTransactions(): void{
        AppTcTracker.instance.track("tradestation-transactions", "view");
    }
    static trackTradestationShowOrderDetails(): void{
        AppTcTracker.instance.track("tradestation-order-details", "view");
    }

    static trackTradestationDeleteOrder():void{
        AppTcTracker.instance.track("tradestation-order", "delete");
    }

    static trackVirtualTradingShowOrderDetails():void{
        AppTcTracker.instance.track("virtual-trading-order-details", "view");
    }

    /* language */

    static trackLanguage(language:string):void{
        AppTcTracker.instance.track("language", language);
    }

    /* theme */

    static trackTheme(theme:string):void{
        AppTcTracker.instance.track("theme", theme);
    }

    static trackSwitchTheme(theme:string):void{
        AppTcTracker.instance.track("switch-theme", theme);
    }

    /* device */
    static trackDevice(device:string):void{
        AppTcTracker.instance.track("device", device);
    }

    /* subscription messages */
    static trackSubscriptionMessage(messageType:string):void{
        AppTcTracker.instance.track("subscription-message", messageType);
    }

    static trackSubscriptionMessageAction(messageType:string):void{
        AppTcTracker.instance.track("subscription-message-action", messageType);
    }

    /* user tier */
    static trackTier(tier:string):void{
        AppTcTracker.instance.track("tier", tier);
    }

    /* messages */
    static trackUrgentMessage(message:string) {
        AppTcTracker.instance.track('message', message);
        AppTcTracker.instance.sendToServer(); // urgent message, sends immediately
    }

    static trackMessage(message:string) {
        AppTcTracker.instance.track('message', message);
    }

    /* login */
    static trackSignin() {
        AppTcTracker.instance.track('login', 'signin');
    }

    static trackSignup() {
        AppTcTracker.instance.track('login', 'signup');
    }

    /* what is new */
    static trackWhatIsNewAction() {
        AppTcTracker.instance.track('what-is-new', 'action');
    }

    /* proxy */
    static trackProxyNoCache() {
        AppTcTracker.instance.track('proxy-cache-enabled', 'no-cache');
    }

    static trackProxyEnabled() {
        AppTcTracker.instance.track('proxy-cache-enabled', 'true');
    }

    static trackProxyDisabled() {
        AppTcTracker.instance.track('proxy-cache-enabled', 'false');
    }

    static trackProxyTimeout() {
        AppTcTracker.instance.track('proxy-cache-enabled', 'timeout');
    }

    /* signature */
    static trackSaveSignature() {
        AppTcTracker.instance.track('signature', 'save');
    }
    static trackHasSignature(available:boolean) {
        AppTcTracker.instance.track('has-signature', available.toString());
    }
    static trackDeleteSignature() {
        AppTcTracker.instance.track('signature', 'delete');
    }

    /* sendNow */
    static sendNow(){
        AppTcTracker.instance.sendToServer();
    }

    /* report critical errors via email */
    static reportCriticalError(subject: string, message: string) {
        AppTcTracker.instance.http.post(TcUrlUtils.url('/m/liveweb/report/error'),
            JSON.stringify({subject: subject, message: message}))
            .subscribe(() => {}, error => {});
    }

    /* referer */
    // static trackReferer() {
    //     if(Tc.getParameterByName('r')) {
    //         let referer:string = Tc.getParameterByName('r');
    //         AppTcTracker.instance.track('referer', referer, this.instance.credentialsService.username);
    //     }
    // }

    /* tracking function */
    private track(feature:string, action:string = null, parameter:string = null){
        let entry:string = feature;
        if(action) {
            entry += ':' + action;
        }
        if(parameter) {
            entry += ':' + parameter;
        }
        console.log("Track:" + entry);
        this.tracks.push(entry);
    }

    private sendToServer() {
        if(this.tracks.length) {
            let username:string = this.credentialsService.trackingId;
            let version:string = Config.getVersion();
            if(Config.isProd()) {
                let loggingDomain = AppBrowserUtils.isMobile() ? 'https://netmobile-log.tickerchart.net' : 'https://netdesktop-log.tickerchart.net';
                this.http.post(TcUrlUtils.url(loggingDomain + `/l/r/v/${version}/u/${username}`), JSON.stringify(this.tracks)).subscribe(() => {}, error => {});
            } else {
                console.log("track: " + JSON.stringify(this.tracks));
            }
            this.tracks = [];
        }
    }



}
