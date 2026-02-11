import {Injectable} from '@angular/core';
import {SharedChannel, ChannelRequestType} from '../../shared-channel/index';
import {StringUtils} from '../../../utils';


@Injectable()
export class MiscStateService {

    private static STORAGE_KEY:string = "TC_MISC";
    private static INIT_SYMBOL_STORAGE_KEY:string = "TC_INIT_SYMBOL";
    private static INIT_MARKET_STORAGE_KEY:string = "TC_INIT_MARKET";
    private static LOAD_IDEA_STORAGE_KEY:string = "TC_LOAD_IDEA";
    private static CAMPAIGN_ID_STORAGE_KEY:string = "cid";

    private storageData:MiscData;
    private initialSymbol:string;
    private initialMarket:string;

    constructor(private sharedChannel:SharedChannel) {
        if(localStorage.getItem(MiscStateService.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(MiscStateService.STORAGE_KEY));
            // MA backward compatibility, drop later
            if(!("showNewsOnChart" in this.storageData)) {
                (this.storageData as MiscData).showNewsOnChart = true;
                this.write();
            }
            if(!("showBonusSharesOnChart" in this.storageData)) {
                (this.storageData as MiscData).showBonusSharesOnChart = true;
                this.write();
            }
            if(!("showAddSignatureDialog" in this.storageData)) {
                (this.storageData as MiscData).showAddSignatureDialog = true;
                this.write();
            }
            if(!("darkTheme" in this.storageData)) {
                (this.storageData as MiscData).darkTheme = false;
                this.write();
            }
            if(!("g" in this.storageData)) {
                (this.storageData as MiscData).g = StringUtils.guid();
                this.write();
            }
            if(!("locks" in this.storageData)) {
                (this.storageData as MiscData).locks = {};
                this.write();
            }

        } else {
            this.storageData = {
                fontSize: FontSize.Normal,
                viewedNews:[],
                hiddenMessageIds:[],
                selectedMarket:'',
                viewedAnalysis: [],
                pageNavigationGuideShown:false,
                showNewsOnChart: true,
                showBonusSharesOnChart: true,
                showAddSignatureDialog:true,
                darkTheme: false,
                g:StringUtils.guid(),
                locks: {},
            };
            this.write();
        }
        // MA if there is an initial symbol, then load it and delete it
        if(localStorage.getItem(MiscStateService.INIT_SYMBOL_STORAGE_KEY)) {
            this.initialSymbol = localStorage.getItem(MiscStateService.INIT_SYMBOL_STORAGE_KEY);
            localStorage.removeItem(MiscStateService.INIT_SYMBOL_STORAGE_KEY);
        }
        if(localStorage.getItem(MiscStateService.INIT_MARKET_STORAGE_KEY)) {
            this.initialMarket = localStorage.getItem(MiscStateService.INIT_MARKET_STORAGE_KEY);
            localStorage.removeItem(MiscStateService.INIT_MARKET_STORAGE_KEY);
        }

        this.applyFontToHtml();

        // on every run, update guid
        this.updateGuid();

    }

    getCampaignId():string {
        return localStorage.getItem(MiscStateService.CAMPAIGN_ID_STORAGE_KEY);
    }

    /* init symbol */
    hasInitialSymbol():boolean {
        return this.initialSymbol != null;
    }

    getInitialSymbol():string {
        return this.initialSymbol;
    }

    hasInitialMarket():boolean {
        return this.initialMarket != null;
    }

    getInitialMarket():string {
        return this.initialMarket;
    }


    /* load idea*/

    hasPendingIdeaToLoad():boolean {
        return localStorage.getItem(MiscStateService.LOAD_IDEA_STORAGE_KEY) != null;
    }

    getIdeaIdentifier():string {
        let ideaIdentifier = localStorage.getItem(MiscStateService.LOAD_IDEA_STORAGE_KEY);
        localStorage.removeItem(MiscStateService.LOAD_IDEA_STORAGE_KEY);
        return ideaIdentifier;
    }

    /* fontSize */

    getFontSize():FontSize {
        return this.storageData.fontSize;
    }

    setFontSize(size:FontSize) {
        this.storageData.fontSize = size;
        this.write();
        this.applyFontToHtml();
        // MA needed in refresh for to change grid row height
        this.sharedChannel.request({type:ChannelRequestType.WorkspaceRefresh});
    }

    /* viewed news */

    resetViewedNews() {
        this.storageData.viewedNews = [];
        this.write();
    }

    addViewedNews(id:string){
        this.getViewedNews().push(id);
        this.write();
    }

    isViewedNews(id:string):boolean{
        return this.getViewedNews().indexOf(id) !== -1;
    }

    /* viewed analysis */

    addViewedAnalysis(id:string){
        this.getViewedAnalysis().push(id);
        this.write();
    }

    isViewedAnalysis(id:string):boolean{
        return this.getViewedAnalysis().indexOf(id) !== -1;
    }

    /* hidden message ids */
    isMessageHidden(id:string):boolean {
        return this.storageData.hiddenMessageIds.includes(id);
    }

    hideMessage(id:string) {
        this.storageData.hiddenMessageIds.push(id);
        this.write();
    }

    /* selected Market */
    setSelectedMarket(marketAbbreviation:string):void{
        this.storageData.selectedMarket = marketAbbreviation;
        this.write();
    }

    getSelectedMarket():string{
        return this.storageData.selectedMarket;
    }

    /* first login */
    markPageNavigationGuideAsShown():void{
        this.storageData.pageNavigationGuideShown = true;
        this.write();
    }

    isPageNavigationGuideShown():boolean{
        return this.storageData.pageNavigationGuideShown;
    }

    /* show news on chart */
    setShowNewsOnChart(show: boolean) {
        this.storageData.showNewsOnChart = show;
        this.write();
    }

    getShowNewsOnChart(): boolean {
        return this.storageData.showNewsOnChart;
    }

    setShowBonusSharesOnChart(show: boolean) {
        this.storageData.showBonusSharesOnChart = show;
        this.write();
    }

    getShowBonusSharesOnChart(): boolean {
        return this.storageData.showBonusSharesOnChart;
    }

    setShowAddSignatureDialog(show: boolean) {
        this.storageData.showAddSignatureDialog = show;
        this.write();
    }

    getShowAddSignatureDialog(): boolean {
        return this.storageData.showAddSignatureDialog;
    }

    /* theme */
    isDarkTheme():boolean {
        return this.storageData.darkTheme;
    }

    setDarkTheme(darkTheme:boolean) {
        this.storageData.darkTheme = darkTheme;
        this.write();
    }

    /* guid */
    getGuid():string {
        this.reloadStorage(); // could be changed by a different tab
        return this.storageData.g;
    }

    updateGuid() {
        this.reloadStorage(); // could be changed by a different tab
        this.storageData.g = StringUtils.guid();
        this.write();
    }

    /* locks */
    isLockedByOtherTab(workspaceId:string, lockId:string) {
        this.reloadStorage(); // other tabs change lock, so we must reload storage
        return this.storageData.locks[workspaceId] != null && this.storageData.locks[workspaceId] != lockId;
    }

    lockWorkspaceByThisTab(workspaceId:string, lockId:string) {
        this.reloadStorage(); // other tabs change lock, so we must reload storage
        this.storageData.locks[workspaceId] = lockId;
        this.write();
    }

    unlockWorkspaceFromThisTab(workspaceId:string, lockId:string) {
        this.reloadStorage(); // other tabs change lock, so we must reload storage
        if(!this.isLockedByOtherTab(workspaceId, lockId)) {
            delete this.storageData.locks[workspaceId];
            this.write();
        }
    }

    private reloadStorage() {
        this.storageData = JSON.parse(localStorage.getItem(MiscStateService.STORAGE_KEY));
    }



    private write(){
        localStorage[MiscStateService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }

    private applyFontToHtml() {

        let fontBase:string;

        switch(this.getFontSize()){
        case FontSize.Small:
            fontBase = '9px';
            break;
        case FontSize.Normal:
            fontBase = '10px';
            break;
        case FontSize.Large:
            fontBase = '12px';
            break;
        }

        $("html").css('font-size', fontBase);

    }

    private getViewedNews():string[] {
        return this.storageData.viewedNews;
    }

    private getViewedAnalysis():string[]{
        //NK for compatibility
        if(!this.storageData.viewedAnalysis){
            this.storageData.viewedAnalysis = [];
            this.write();
        }

        return this.storageData.viewedAnalysis;
    }
}

interface MiscData {
    fontSize:FontSize;
    viewedNews:string[],
    hiddenMessageIds:string[],
    selectedMarket:string,
    viewedAnalysis:string[],
    pageNavigationGuideShown?:boolean,
    showNewsOnChart: boolean,
    showBonusSharesOnChart: boolean,
    showAddSignatureDialog:boolean,
    darkTheme:boolean,
    g:string,
    locks:{[key:string]:string}
}

export enum FontSize {
    Small = 1,
    Normal,
    Large
}
