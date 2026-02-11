import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS} from '../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../shared';
import {ChannelRequest, ChannelRequestType, SharedChannel} from '../../../services/shared-channel';
import {Page, PageService} from '../../../services/page';
import {FeatureType} from '../../../services/auhtorization/feature';
import {AuthorizationService} from '../../../services/auhtorization';
import {AppModeStateService} from '../../../services';
import {AppBrowserUtils, AppTcTracker, DomUtils} from '../../../utils';

@Component({
    selector: 'mobile-more-pages',
    templateUrl: './mobile-more-pages.component.html',
    styleUrls: ['./mobile-more-pages.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})
export class MobileMorePagesComponent extends ChannelListener<MobileMorePagesChannelRequest> implements AfterViewInit{
    morePages:Page[]=[];
    visible = false;
    menuLeftPosition:number;
    FeatureType = FeatureType;

    @Output() outputPage = new EventEmitter();

    constructor(public sharedChannel: SharedChannel, public cd: ChangeDetectorRef , public pageService:PageService,public el: ElementRef , public authorizationService:AuthorizationService, public appModeStateService: AppModeStateService) {
        super(sharedChannel, ChannelRequestType.MobileMorePages);

        this.sharedChannel.getRequestStream().subscribe((request:ChannelRequest) => {
            if(request.type == ChannelRequestType.WorkspaceRefresh) {
                this.pageService.handleMobilePages();
                this.hide();
            }
        })
    }

    ngAfterViewInit() {
        let eventType = AppBrowserUtils.isDesktop() ? 'click' : 'touchstart';
        window.document.addEventListener(eventType, event =>{
            if(!DomUtils.isEventOutsideComponent(this.el.nativeElement, event, ['modal-content', 'modal' , 'more-section'])) {
               this.hide();
            }
        });
    }

    getSelectedPage() :Page {
        return this.pageService.getActivePage();
    }

    public getIconClassName(page:Page) {
        return this.pageService.getPageIconClassName(page);
    }

    protected onChannelRequest(): void {
        if(!this.channelRequest.keepOnVisibleState) {
            this.visible = !this.visible;
        }

        this.morePages = this.pageService.mobileMenuPages();
        this.menuLeftPosition = this.channelRequest.menuLeftPosition;
        this.callCallerIfExist();
        this.cd.markForCheck();
    }

    private callCallerIfExist(): void {
        if(this.channelRequest && this.channelRequest.caller) {
            this.channelRequest.caller.changeMorePagesVisibleState(this.visible);
        }
    }

    getMenuLeftPosition():string {
        return this.menuLeftPosition + 'px';
    }

    onSelectPage(page: Page) {
        let authorizationType: FeatureType = this.getPageAuthorizationType(page);
        this.authorizationService.authorize(authorizationType, () => {
            this.selectPage(page);
        });

        this.hide();
    }

    selectPage(page: Page){
        AppTcTracker.trackChangePage();
        this.channelRequest.caller.onSelectPage(page);
    }

    isUnauthorized(page: Page): boolean {
        let authorizationType: FeatureType = this.getPageAuthorizationType(page);

        return !this.authorizationService.authorizeFeature(authorizationType);
    }

    private getPageAuthorizationType(page: Page): FeatureType {
        let authorizationPages = [
            {tag: 'technical-scope', featureType: FeatureType.TECHNICAL_SCOPE_SCREEN},
            {tag: 'auction', featureType: FeatureType.MARKET_PREOPEN_SCREEN},
            {tag: 'market-alerts', featureType: FeatureType.MARKET_ALERTS_SCREEN},
            {tag: 'big-trades', featureType: FeatureType.BIG_TRADES_SCREEN},
            {tag: 'market-movers', featureType: FeatureType.MARKET_MOVERS_SCREEN},
            {tag: 'financial-data', featureType: FeatureType.FINANCIAL_DATA},
            {tag: 'index-analysis', featureType: FeatureType.INDEX_ANALYSIS_SCREEN},
        ];

        let authorizationType: FeatureType = FeatureType.CHANGE_PAGES;

        let authorizedPage = authorizationPages.find(item => item.tag === page.tag);
        if (authorizedPage) {
            authorizationType = authorizedPage.featureType;
        }

        return authorizationType;
    }

    clickAnimationFinish(element:HTMLElement){
        $(element).removeClass('clicked');
    }

    hide() {
        this.visible = false;
        this.callCallerIfExist();
        this.cd.markForCheck();
    }
    public showTab(page: Page): boolean {
        return this.appModeStateService.isDerayahMode() ? !this.isUnauthorized(page) : true;
    }
}


export interface MobileMorePagesChannelRequest extends ChannelRequest {
    caller: MobileMorePagesCaller;
    menuLeftPosition:number;
    keepOnVisibleState:boolean
}

export interface MobileMorePagesCaller {
    onSelectPage(page:Page):void;
    changeMorePagesVisibleState(visible:boolean):void;
}
