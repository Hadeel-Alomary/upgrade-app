import {Injectable} from '@angular/core';
import {AppBrowserUtils, StringUtils, Tc, AppTcTracker} from '../../utils/index';
import {GridConfigData} from '../../components/grid/grid.component';
import {StateKey, WorkspaceStateService} from '../state/workspace/workspace-state.service';
import {LanguageService} from '../state/language/language.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {WorkspaceLoader} from '../loader/workspace-loader';
import {AlertService} from '../data/alert';
// import {OverlayBoxesPage} from '../../components/mobile/overlay-boxes-page';
import {BehaviorSubject} from 'rxjs';
import {Loader} from '../loader';
import {GridBoxType} from '../../components/shared/grid-box/grid-box-type';
import {AppModeAuthorizationService, AuthorizationService} from '../auhtorization';
import {GridBox} from '../../components/shared/grid-box';

import remove from 'lodash/remove';
// const remove = require("lodash/remove");

@Injectable()
export class PageService {
private activePageChangedStream: BehaviorSubject<Page>;

    constructor(private stateService: WorkspaceStateService,
                private languageService:LanguageService,
                private workspaceLoader:WorkspaceLoader,
                private alertService:AlertService,
                private loader: Loader,
                private appModeAuthorizationService: AppModeAuthorizationService,
                private authorizationService: AuthorizationService) {

        this.activePageChangedStream = new BehaviorSubject(null);

        this.loader.isLoadingDoneStream().subscribe(loadingDone => {
            //On startup when the active page is ready.
            this.setActivePageChanged();
        });
    }

    get pageWordAsString(){
        return this.languageService.translate('صفحة');
    }

    getPages():Page[] {
        return this.pages;
    }

    public setActivePageChanged(){
        /* Ehab: We are using this function to inform that the active page is changed.
           Page changed when: (1) Select / Add page , (2) grid box is opened / closed
         */
        this.activePageChangedStream.next(this.getActivePage());
    }

    public getChangedActivePageStream(): BehaviorSubject<Page> {
        return this.activePageChangedStream;
    }

    addNewPage() {
        AppTcTracker.trackCreatePage();
        this.inactivatePages();
        this.pages.push({
            guid:StringUtils.guid(),
            title: this.generateNewPageTitle(),
            active: true,
            grid:{}
        });
    }

    mobileMenuPages():Page[] {
      let pageExcludedTags = ['chart','marketwatch','trading', 'company-financial-data'];
      return this.pages.filter(page => page.tag && !pageExcludedTags.includes(page.tag));//Ehab some old mobile pages didn't contain .tag property, so we need to ignore them
    }

    deletePage(page:Page) {
        AppTcTracker.trackDeletePage();
        this.deleteAlertsHostedByPage(page);
        let pageIndex = this.pages.indexOf(page);

        //Todo we must use this.setActivePage instead of this
        this.inactivatePages();
        remove(this.pages, (p: Page) => p === page);
        if(pageIndex == this.pages.length) {
            pageIndex -= 1;
        }
        this.pages[pageIndex].active = true;

        this.setActivePageChanged();
    }

    private deleteAlertsHostedByPage(page:Page) {
        this.alertService.getAlertsHostedByPage(page.guid).forEach(alert => {
            this.alertService.deleteAlert(alert);
        });
    }

    hasOnePage():boolean {
        return this.pages.length == 1;
    }

    getActivePage():Page {
        return this.pages.find(page => page.active) || this.pages[0];//Ehab bug happened some client workspaces has no active page, so we take this.pages[0]
    }

    setActivePage(page: Page) {
        this.inactivatePages();
        page.active = true;
        this.setActivePageChanged();
    }

    getPageContainingComponent(componentId:string):string {
        for(var i = 0; i < this.pages.length; ++i) {
            if(this.doesPageContainComponent(this.pages[i], componentId)) {
                return this.pages[i].guid;
            }
        }

        // if(componentId in OverlayBoxesPage.page().grid.boxes) {
        //     return OverlayBoxesPage.page().guid;
        // }

        Tc.error("fail to find page containing component " + componentId);
        return null;
    }

    public getPageIconClassName(page:Page) {
        if(page.tag == 'trading') {
            return page.english.replace(/\s+/g, '-').toLowerCase();//"Account Balance" will be returned account-balance
        }
        return page.tag;
    }


    hasBuiltinPageWithTag(pageTag: string):boolean {
        return this.pages.find(page => page.builtin && page.tag == pageTag) != null;
    }

    getBuiltinPageWithTag(pageTag: string):Page {
        return this.pages.find(page => page.builtin && page.tag == pageTag);
    }

    loadBuiltinPageFromServer(pageName:string):Observable<Page> {
        return this.workspaceLoader.loadPage(pageName).pipe(tap((page: Page) => {
            this.pages.push(page);
            this.setActivePageChanged();
        }));
    }

    private doesPageContainComponent(page:Page, componentId:string):boolean {
        if(page.grid && page.grid.boxes) {
            if(componentId in page.grid.boxes) {
                return true;
            }
        }
        return false;
    }

    private generateNewPageTitle():string {
        let lastPageNumber:number = 1;
        this.pages.forEach(page => {
            let pageRegex = new RegExp("^" + this.pageWordAsString+ " ([0-9]+)$", 'i');
            let matchResult = page.title.match(pageRegex);
            if(matchResult){
                let pageNumber:number = +matchResult[1];
                if(lastPageNumber < pageNumber) { lastPageNumber = pageNumber; }
            }
        });
        return `${this.pageWordAsString} ${++lastPageNumber}`;
    }

    private inactivatePages() {
        this.pages.forEach(page => page.active = false);
    }

    // MA don't cache pages, as they may change when StateService loadWorkspace
    private get pages():Page[] {
        let pages: Page[] = [];
        if(this.stateService.has(StateKey.Pages)) {
            pages = this.stateService.get(StateKey.Pages) as Page[];
            this.updateBuiltPageTitlesAccordingToLanguageSelection(pages);
        }
        return pages;
    }

    private updateBuiltPageTitlesAccordingToLanguageSelection(pages: Page[]) {
        pages.forEach(page => {
            if (page.builtin) {
                let userHasNotChangedTitle = page.title == page.arabicTitle || page.title == page.englishTitle;
                if (userHasNotChangedTitle) {
                    page.title = this.languageService.arabic ? page.arabicTitle : page.englishTitle;
                }
            }
        });
    }

    public handleMobilePages() {
        this.deleteMobileBySymbolPages();
        this.loadMobileExtraPagesIfNeeded();
    }

    private deleteMobileBySymbolPages() {
        let tagsToDelete = [ 'trades', 'depth', 'company-news','top-gainers','top-losers'];
        tagsToDelete.forEach(tag => {
            let pageToDelete = this.pages.find(page => page.tag == tag);
            if (pageToDelete)
                this.deletePage(pageToDelete);
        });
    }

    private loadMobileExtraPagesIfNeeded() {
        //////////////////////////////////////////////////////////////////
        // MA Function is needed for backward compatibility, to add new workspace pages to old workspaces
        // If you read this and you have no idea what I am talking about, then it is the proper time to delete this code :-)
        if(AppBrowserUtils.isMobile()) {
            // if(this.pages.length == 8) {
                AppTcTracker.trackMessage('update mobile workspace to include extra pages');
                let tagsToAdd = ['auction','market-alerts', 'big-trades', 'technical-scope','financial-data','company-financial-data','market-movers','index-analysis'];
                let loadedPages:{[tag:string]:Page} = {};
                tagsToAdd.forEach(tag => {
                    let result = this.pages.findIndex(page => page.tag == tag);
                    if(result == -1) {
                        let mobileTag: string = 'mobile-' + tag;
                        this.workspaceLoader.loadPage(mobileTag).subscribe(page => {
                            loadedPages[mobileTag] = page;
                            this.pages.push(loadedPages[mobileTag]);//Insert in index 6 after "الصفقات الكبيرة"
                        });
                    }
                });
            // }
        }
        //////////////////////////////////////////////////////////////////
    }

    public countOpenGridBoxes(type: GridBoxType): number {
        let gridBoxesCounter = 0;

        this.getPages().forEach(page => {
            if (!page || !page.grid.boxes) {
                return;
            }
            let boxes = Object.values(page.grid.boxes);
            if (this.authorizationService.isBasicSubscriber() || this.authorizationService.isAdvanceSubscriber()) {
                if (this.getCompaniesGridBoxes().includes(type)) {
                    gridBoxesCounter += boxes.filter(box => this.getCompaniesGridBoxes().includes(box.type)).length;
                } else if (this.getMarketGridBoxes().includes(type)) {
                    gridBoxesCounter += boxes.filter(box => this.getMarketGridBoxes().includes(box.type)).length;
                } else {
                    gridBoxesCounter+= this.getDefaultCountOpenGridBox(page, type);
                }
            }else {
                gridBoxesCounter += this.getDefaultCountOpenGridBox(page, type);
            }
        });

        return gridBoxesCounter;
    }

    public getCompaniesGridBoxes(): number[] {
        return  [GridBoxType.DetailedQuote, GridBoxType.TimeAndSale, GridBoxType.TradesSummary,
            GridBoxType.CompanyNews, GridBoxType.MarketDepthByOrder, GridBoxType.MarketDepthByPrice, GridBoxType.Chart, GridBoxType.CompanyFinancialStatements]
    }

    public getMarketGridBoxes(): number[] {
        return [GridBoxType.MarketPreOpen, GridBoxType.Shareholders, GridBoxType.AnalysisCenter,
            GridBoxType.BigTrades, GridBoxType.MarketTrades, GridBoxType.MarketAlerts, GridBoxType.TechnicalScope, GridBoxType.MarketMovers ,GridBoxType.FinancialData, GridBoxType.IndexAnalysis]
    }

    private getDefaultCountOpenGridBox(page: Page, type: GridBoxType): number {
        let gridBoxesCounter = 0;
        Object.keys(page.grid.boxes).forEach(box => {
            if (page.grid.boxes[box].type === type) {
                gridBoxesCounter++;
                if (type == GridBoxType.Marketwatch && page.grid.boxes[box].properties['miniMarketWatch']) {
                    gridBoxesCounter--;
                }
            }
        });
        return gridBoxesCounter;
    }

    public isMarketGridBoxIncludedInPages(type: GridBoxType): boolean {
        for (let page of this.getPages() ){
            for (let box of Object.keys(page.grid.boxes)) {
                if (type == GridBoxType.Marketwatch && page.grid.boxes[box].properties['miniMarketWatch']) {
                    return false
                }else if (this.getMarketGridBoxes().includes(type) && type == page.grid.boxes[box].type) {
                    return true;
                }
            }
        }
        return false;
    }
}


export interface Page {
    guid:string,
    title:string,
    active:boolean,
    grid:GridConfigData,
    builtin?:boolean,
    tag?:string,
    arabicTitle?:string,
    englishTitle?:string,
    arabic?:string,
    english?:string,
}
