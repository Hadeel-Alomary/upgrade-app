import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChange, ViewEncapsulation} from '@angular/core';
import {ConfirmationCaller, ConfirmationRequest, PageTitleCaller, PageTitleRequest, UpgradeMessageChannelRequest, UpgradeMessageType} from '../../../components/modals/index';
import {AppModeAuthorizationService, AuthorizationService, ChannelRequest, ChannelRequestType, LanguageService, Page, PageService, SharedChannel, TradingService, WorkspaceStateService} from '../../../services/index';
import {Tc, AppTcTracker} from '../../../utils/index';
import {Feature, FeatureType} from '../../../services/auhtorization/feature';
import {BrokerType} from '../../../services/trading/broker/broker';
import {AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';

@Component({
    selector: 'page-tabs',
    templateUrl:'./page-tabs.component.html',
    styleUrls:['./page-tabs.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class PageTabsComponent implements ConfirmationCaller, PageTitleCaller, OnChanges {

    @Input() selectedPage:Page;
    @Output() outputPage = new EventEmitter();
    @Output() outputDeletePage = new EventEmitter();

     pages:Page[];
     pageRange:{min:number, max:number};
     private isLoadingPageFromServer: boolean = false;
     readonly  MAX_TABS: number = 4;
     readonly  MAX_PAGES: number = 10;
     readonly  TRADING_TAG: string = 'trading';
     appModeFeatureType = AppModeFeatureType;

    constructor( public pageService:PageService,
                 public sharedChannel:SharedChannel,
                 public cd:ChangeDetectorRef,
                 public languageService:LanguageService,
                 public authorizationService:AuthorizationService,
                 private tradingService:TradingService,
                 private workspaceStateService: WorkspaceStateService,
                 public appModeAuthorizationService: AppModeAuthorizationService) {
        this.pages = pageService.getPages();

        this.sharedChannel.getRequestStream().subscribe((request:ChannelRequest) => {
            if(request.type == ChannelRequestType.WorkspaceRefresh) {
                this.pages = this.pageService.getPages();
                this.selectedPage = this.pageService.getActivePage();
                this.computePageRange();
                this.pageService.setActivePageChanged();
                this.cd.markForCheck();
            }
        });

        tradingService.getBrokerSelectionStream().subscribe((brokerType: BrokerType) => {
            if (brokerType == BrokerType.None && this.hasTradingPage()) { // Broker disconnection.
                this.unloadTradingBuiltinPage();
            }
        });
    }

    unloadTradingBuiltinPage() {
        this.isLoadingPageFromServer = false;
        this.outputDeletePage.emit(this.pageService.getBuiltinPageWithTag(this.TRADING_TAG));
        this.computePageRange() // to reorder pages tabs
        setTimeout(()=>{//make sure page unloaded
            this.updateWorkspace();
        })
    }

    private updateWorkspace(){
        //Update Workspace to include current broker in it.
        //Ehab for example: if user was connect to Virtual Trading then reconnect to Riyadh Capital then reload the app Virtual Trading page will load in next start which is wrong.
        this.workspaceStateService.updateWorkspace().subscribe(); //save new page to workspace
    }

    private hasTradingPage(): boolean{
        return  this.pageService.hasBuiltinPageWithTag(this.TRADING_TAG);
    }

    private getTradingPageName(brokerType: BrokerType) {
        switch(brokerType) {
            case BrokerType.Derayah:
                return 'derayah';
            case BrokerType.Snbcapital:
                return 'snbcapital';
            case BrokerType.Riyadcapital:
                return 'riyadcapital';
            case BrokerType.Alinmainvest:
                return 'alinmainvest';
            case BrokerType.Aljaziracapital:
                return 'aljaziracapital';
            case BrokerType.VirtualTrading:
                return 'trading';
            case BrokerType.Tradestation:
                return 'tradestation';
            case BrokerType.Musharaka:
                return 'musharaka';
            case BrokerType.Bsf:
                return 'bsf';
            case BrokerType.Alkhabeercapital:
                return 'alkhabeercapital';
            default:
                Tc.error("no trading page for broker type " + brokerType);
        }
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if(changes['selectedPage']) {
            if(!this.pageRange || !this.inRange(this.selectedPage)) {
                this.computePageRange();
            }
        }
    }

    /* channel request callbacks */

    onConfirmation(confirmed:boolean, param:unknown){
        if(confirmed) {
            this.pageRange = null; // in order to be computed again
            this.outputDeletePage.emit(this.selectedPage);
        }
    }

    onPageTitleChanged() {
        this.cd.markForCheck();
    }

    /* template helper */
     inRange(page:Page):boolean {
        let pageIndex = this.pages.indexOf(page);
        return this.pageRange.min <= pageIndex && pageIndex <= this.pageRange.max;
    }

    isFirstPageSelected():boolean {
        return this.pages.indexOf(this.selectedPage) == 0;
    }

    isLastPageSelected():boolean {
        return this.pages.indexOf(this.selectedPage) == this.pages.length - 1;
    }

    /* interactive events */

     onDeletePage() {
        Tc.assert(1 < this.pages.length, "cannot delete the last page");
        let messageLine1:string = this.languageService.translate("حذف الصفحة سوف يشمل حذف الرسوم البيانية والتنبيهات الموجودة في الصفحة.");
        let messageLine2:string = this.languageService.translate('هل ترغب في حذف ') + this.selectedPage.title + this.languageService.translate(' بجميع محتوياتها؟');
        let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: messageLine1, messageLine2:messageLine2, caller: this};
        this.sharedChannel.request(confirmationRequest);
    }

     onChangeTitle() {
        let pageTitleRequest:PageTitleRequest = {type: ChannelRequestType.PageTitle, page: this.selectedPage, caller: this};
        this.sharedChannel.request(pageTitleRequest);
    }

     onSelectPage(page:Page) {
         if(page.tag == 'marketwatch') {
             this.authorizationService.authorize((FeatureType.CHANGE_PAGES), () =>{
                 AppTcTracker.trackChangePage();
                 this.outputPage.emit(page);
             })
         }else {
             AppTcTracker.trackChangePage();
             this.outputPage.emit(page);
         }
    }

    public unAuthorizedMarketWatchPage(tag: string) {
         return this.authorizationService.isVisitor() ? tag == 'marketwatch' : false;
    }

    public allowAddNewPage() : boolean {
         return this.authorizationService.isProfessionalSubscriber() || this.appModeAllowedFeature(this.appModeFeatureType.ADD_NEW_PAGE_TAB_ICON);
    }

     onAddNewPage() {
         this.authorizationService.authorize(FeatureType.MULTIPLE_PAGES, () => {
             if((!this.authorizationService.isProfessionalSubscriber()  && !this.authorizationService.isAdvanceSubscriber()) && this.pages.length >= 2)  {
                this.showMultiplePagesUpgradeMessage();//Non professional user can open up to maximum 2 pages.
             } else {
                 if (this.pages.length < this.MAX_PAGES) {
                     this.pageService.addNewPage();
                     this.outputPage.emit(this.pages[this.pages.length - 1]); // select latest page
                 } else {
                     this.showReachedMaxOpenedPagesMessage();
                 }
             }
         });
    }

    private showMultiplePagesUpgradeMessage(): void {
        let feature = Feature.getFeature(FeatureType.MULTIPLE_PAGES);
        let upgradeMessageRequest: UpgradeMessageChannelRequest = {
            type : ChannelRequestType.UpgradeMessage,
            upgradeMessageType: UpgradeMessageType.PROFESSIONAL_SUBSCRIPTION,
            feature: feature,
            isMarketAuthorized: true,
            isValidFeatureCount:true
        };
        this.sharedChannel.request(upgradeMessageRequest);
    }

    showReachedMaxOpenedPagesMessage(): void {
         let message:string = '.لا يمكنك إضافة أكثر من 10 صفحات. لإضافة صفحة جديدة تحتاج إلى حذف صفحة حالية';
         let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.MessageBox, messageLine: this.languageService.translate(message), caller: this};
         this.sharedChannel.request(confirmationRequest);
    }

    /* page range */

     computePageRange() {

        let indices:number[] = [];

        let selectedPageIndex = this.pages.indexOf(this.selectedPage);

        indices.push(selectedPageIndex);

        for(let i = 1; i < this.MAX_TABS; ++i) {
            let lowerIndex = selectedPageIndex - i;
            let upperIndex = selectedPageIndex + i;
            if(this.pages[lowerIndex]){
                indices.push(lowerIndex);
            }
            if(indices.length == this.MAX_TABS) { break; }
            if(this.pages[upperIndex]) {
                indices.push(upperIndex);
            }
            if(indices.length == this.MAX_TABS) { break; }
        }
        indices.sort((a, b) => a - b); // numeric sorting

        this.pageRange = {min: indices[0], max: indices[indices.length - 1]};

    }

    showNavigationDropdown(): boolean {
        return this.MAX_TABS < this.pages.length;
    }

    multiplePages():boolean {
        return this.authorizationService.authorizeFeature(FeatureType.MULTIPLE_PAGES);
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }


}
