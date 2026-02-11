import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AppModeAuthorizationService, AuthorizationService, ChannelRequest, ChannelRequestType, MarketBoxOpenRequest, MarketsManager, Page, PageService, SharedChannel, SymbolBoxOpenRequest, WorkspaceStateService} from '../../services/index';
import {AppTcTracker} from '../../utils/index';
import {GridBox, GridBoxType} from '../shared/grid-box/index';
import {DockingConfig, DockingItemConfig, DockingItemEvent} from './docking/docking-config';
import {DockingDirective} from './docking/docking.directive';
import {DockingConstants} from './docking/docking-constants';
import {SubscriptionLike as ISubscription} from 'rxjs';
import {GridBoxUtils} from '../shared/grid-box/grid-box-type';
import {FeatureType} from '../../services/auhtorization/feature';
import {DockingItemDirective} from './docking';
import {GridBoxProperties} from '../shared/grid-box/grid-box';
import {FeatureGridBox} from '../../services/auhtorization/feature-grid-box';
import {AppModeFeatureType} from '../../services/auhtorization/app-mode-authorization';
import {MarketwatchComponent} from '../marketwatch';
import {NgFor, NgIf} from '@angular/common';

// Annotation section
@Component({
    standalone:true,
    selector: 'grid',
    templateUrl:'./grid.component.html',
    styleUrls:['./grid.component.css', './grid.box-toolbar.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:[MarketwatchComponent,DockingDirective,DockingItemDirective,NgIf,NgFor]
})

// Component controller
export class GridComponent implements OnInit, OnDestroy {

    @Input() page:Page;
    @Input() active:boolean;

    @ViewChild(DockingDirective) dockingDirective:DockingDirective;
    @ViewChildren('gridchild') components:QueryList<GridBox<GridBoxProperties>>;

     static BORDER_SIZE = 2 * DockingConstants.DOCKING_BORDER_WIDTH;

     config:GridConfig = new GridConfig();
     initBoxSymbols:{[id:string]:string} = {};
     initBoxMarkets:{[id:string]:string} = {};
     initBoxParameters:{[id:string]:string|boolean|object} = {};

    // MA Bringing enum in template: https://github.com/angular/angular/issues/2885
     gridBoxType = GridBoxType;

     subscriptions:ISubscription[] = [];

    constructor( public element: ElementRef,
                 public pageService:PageService,
                 public stateService:WorkspaceStateService,
                 public cd:ChangeDetectorRef,
                 public sharedChannel:SharedChannel,
                 public authorizationService: AuthorizationService,
                 public marketsManager:MarketsManager,
                 public appModeAuthorizationService: AppModeAuthorizationService) {

        this.subscriptions.push(
             this.stateService.getFlushStateStream().subscribe( () => this.saveGridState())
        );

        this.subscriptions.push(
            this.sharedChannel.getRequestStream().subscribe(channelRequest =>
                                                       this.processChannelRequest(channelRequest)));

    }

    ngOnInit() {

        this.config.initConfig(this.page.grid);

        if(this.pageService.hasOnePage() && !this.config.numberOfBoxes) {
            // single page with nothing inside, add marketwatch
            this.config.addBox(this.generateDefaultItemConfig(GridBoxType.Marketwatch));
        }

    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
    }

    addSymbolBox(type:GridBoxType, symbol:string, param?:string|boolean|object){
        if(this.verifyBoxCanBeAdded(type)) {
            let newBox = this.addDockingItem(type);
            this.initBoxSymbols[newBox.id] = symbol;
            this.initBoxParameters[newBox.id] = param;

            this.pageService.setActivePageChanged();
            this.cd.markForCheck();
        }
    }

    addMarketBox(type:GridBoxType, watchlistId:string, param?:string|boolean|object){
        if(this.verifyBoxCanBeAdded(type)) {
            let newBox = this.addDockingItem(type);
            this.initBoxMarkets[newBox.id] = watchlistId;
            this.initBoxParameters[newBox.id] = param;
            this.pageService.setActivePageChanged();
            this.cd.markForCheck();
        }
    }

    removeTradingBoxes(){
        for(let box of this.config.boxes()){
            if(GridBoxUtils.isTradingBox(box.type)) {
                this.onCloseBox(box.id);
            }
        }
    }

     private verifyBoxCanBeAdded(type:GridBoxType):boolean {
        let MAX_NUMBER_OF_BOXES = this.appModeAllowedFeature(AppModeFeatureType.INCREASE_MAX_NUMBER_OF_BOXES) ? 14 : 10;
        if(MAX_NUMBER_OF_BOXES <= this.config.numberOfBoxes) {
            this.showMessageBox('لا يمكن اضافة أكثر من ' + MAX_NUMBER_OF_BOXES + ' شاشات في الصحفة الواحدة',
                'يمكنك إنشاء صفحة جديدة واضافة الشاشات فيها');
            return false;
        }
        if(type == GridBoxType.MarketPreOpen){
            if(!this.marketsManager.getAllMarkets().find(market => market.abbreviation == 'TAD')){
                this.showMessageBox('شاشة مزاد الافتتاح والاغلاق متاحة فقط للسوق السعودي',
                    'لمزيد من المعلومات يرجى التواصل مع الدعم الفني');
                return false;
            }
        }
        return true;
    }

     private showMessageBox(line1:string, line2?:string){
        let messageBoxRequest = {type: ChannelRequestType.MessageBox, messageLine: line1, messageLine2: line2};
        this.sharedChannel.request(messageBoxRequest);
    }

    /* config */

     addDockingItem(type:GridBoxType):DockingItemConfig{
        // AppTcTracker.trackAddBox(type);
        let newBox:DockingItemConfig = this.generateDefaultItemConfig(type);
        this.config.addBox(newBox);
        return newBox;
    }

     generateDefaultItemConfig(type:GridBoxType): DockingItemConfig {

        let size = this.getDefaultBoxSize(type);

        return {
            id: this.boxGuid(),
            width: size.width,
            height: size.height,
            type:type,
            properties: {}
        };
    }

  private boxGuid():string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

     getDefaultBoxSize(type:GridBoxType):{width:number, height:number} {

        let size:{width:number, height:number};

        switch(type){
        case GridBoxType.Chart:
        case GridBoxType.Marketwatch:
        case GridBoxType.MarketPreOpen:
        case GridBoxType.DerayahOrders:
        case GridBoxType.DerayahWallet:
        case GridBoxType.SnbcapitalOrders:
        case GridBoxType.SnbcapitalWallet:
        case GridBoxType.RiyadcapitalOrders:
        case GridBoxType.RiyadcapitalWallet:
        case GridBoxType.AlinmainvestOrders:
        case GridBoxType.AlinmainvestWallet:
        case GridBoxType.AljaziracapitalOrders:
        case GridBoxType.AljaziracapitalWallet:
        case GridBoxType.AlrajhicapitalOrders:
        case GridBoxType.AlrajhicapitalWallet:
        case GridBoxType.VirtualTradingOrders:
        case GridBoxType.VirtualTradingPositions:
        case GridBoxType.TradestationOrders:
        case GridBoxType.TradestationPositions:
        case GridBoxType.MusharakaOrders:
        case GridBoxType.MusharakaWallet:
        case GridBoxType.BsfOrders:
        case GridBoxType.BsfWallet:
        case GridBoxType.AlkhabeercapitalOrders:
        case GridBoxType.AlkhabeercapitalWallet:
            size = {width: 900, height: 450};
            break;
        case GridBoxType.SnbcapitalOrderSearch:
        case GridBoxType.RiyadcapitalOrderSearch:
        case GridBoxType.AlinmainvestOrderSearch:
        case GridBoxType.AljaziracapitalOrderSearch:
        case GridBoxType.AlrajhicapitalOrderSearch:
                size = {width: 775, height: 510};
                break;
        case GridBoxType.MusharakaOrderSearch:
                size = {width: 816, height: 510};
               break;
        case GridBoxType.BsfOrderSearch:
        case GridBoxType.AlkhabeercapitalOrderSearch:
                size = {width: 816, height: 510};
               break;
        case GridBoxType.TradestationAccountBalance:
        case GridBoxType.SnbcapitalAccountBalance:
        case GridBoxType.RiyadcapitalAccountBalance:
        case GridBoxType.AlinmainvestAccountBalance:
        case GridBoxType.AljaziracapitalAccountBalance:
        case GridBoxType.AlrajhicapitalAccountBalance:
        case GridBoxType.MusharakaAccountBalance:
        case GridBoxType.BsfAccountBalance:
        case GridBoxType.AlkhabeercapitalAccountBalance:
                size = {width: 440, height: 660};
                break;
            case GridBoxType.AnalysisCenter:
            size = {width: 1045, height: 600};
            break;
        case GridBoxType.DetailedQuote:
        case GridBoxType.IndexAnalysis:
            size = {width: 700, height: 495};
            break;
        case GridBoxType.CompanyNews:
        case GridBoxType.TechnicalScope:
            size = {width: 700, height: 400};
            break;
        case GridBoxType.MarketDepthByOrder:
        case GridBoxType.TimeAndSale:
            size = {width: 325, height: 300};
            break;
        case GridBoxType.TradesSummary:
        case GridBoxType.MarketDepthByPrice:
            size = {width: 400, height: 300};
            break;
        case GridBoxType.MarketAlerts:
        case GridBoxType.BigTrades:
        case GridBoxType.MarketTrades:
                size = {width: 500, height: 300};
            break;
        case GridBoxType.MarketMovers:
                 size = {width: 550, height: 450};
             break;
        case GridBoxType.Shareholders:
            size = {width: 1080, height: 550};
            break;
        case GridBoxType.FinancialData:
        case GridBoxType.CompanyFinancialStatements:
            size = {width: 1080, height: 600};
            break;
        }

        return size;

    }

    /* template helpers */

     initBoxSymbol(id:string):string {
        // MA if the box is just added, then read the initial symbol "only once"
        let symbol:string = null;
        if(this.initBoxSymbols[id]){
            symbol = this.initBoxSymbols[id];
            delete this.initBoxSymbols[id];
        }
        return symbol;
    }

     initBoxMarket(id:string):string{
        let watchlistId:string = null;
        if(this.initBoxMarkets[id]){
            watchlistId = this.initBoxMarkets[id];
            delete this.initBoxMarkets[id];
        }
        return watchlistId;
    }

     initBoxParam(boxId:string):string|boolean|object{
        let params:string|boolean|object = null;
        if(this.initBoxParameters[boxId]){
            params = this.initBoxParameters[boxId];
            delete this.initBoxParameters[boxId];
        }
        return params;
    }

    /* interactive events */

     onSizeChange(event:DockingItemEvent){
        let box:DockingItemConfig = this.config.getBox(event.id);
        box.width = event.width - GridComponent.BORDER_SIZE;
        box.height = event.height - GridComponent.BORDER_SIZE;
    }

    onHeightChange(id: string ,height: number) {
        let item:DockingItemDirective = this.dockingDirective.items.find(item => item.config.id == id);
        if(item.config.docked) {
            return;
        }
        item.updateHeightOfRectangle(height)
    }

    onCloseBox(id:string){
         let item:DockingItemDirective = this.dockingDirective.items.find(item => item.config.id == id);
         // AppTcTracker.trackCloseBox(item.config.type);
        this.config.removeBox(id);
        this.dockingDirective.removeItem(id);
        this.pageService.setActivePageChanged();
    }


    /* state */

    // MA we can move this to grid-box.ts, but need to pass StateService to react on unload event
     saveComponentProperties(component:GridBox<GridBoxProperties>){
        let id:string = component.id;
        let box:DockingItemConfig = this.config.getBox(id);
        component.beforeSaveProperties();
        box.properties = component.getProperties();
    }

     saveGridState() {
        if(this.components){
            this.components.toArray()
                .forEach((component) => this.saveComponentProperties(component));
        }
        this.page.grid = this.config.getConfig();
    }


    /* channel request */
     processChannelRequest(channelRequest:ChannelRequest) {
         this.onRequestOpenBox(channelRequest);
    }

    public onRequestOpenBox(channelRequest:ChannelRequest):void {
        //this.outputBoxType.emit(type);
        if(this.active && channelRequest.type == ChannelRequestType.OpenSymbol) {
            let openRequest:SymbolBoxOpenRequest = <SymbolBoxOpenRequest> channelRequest;
            this.authorizeGridBoxType(openRequest.gridBoxType, () => {
                this.addSymbolBox(openRequest.gridBoxType, openRequest.symbol, openRequest.param);
            })
        } else if(this.active && channelRequest.type == ChannelRequestType.OpenMarket) {
            let openRequest:MarketBoxOpenRequest = <MarketBoxOpenRequest> channelRequest;
            this.authorizeGridBoxType(openRequest.gridBoxType, () => {
                this.addMarketBox(openRequest.gridBoxType, openRequest.watchlistId, openRequest.param);
            })
        }
    }

    private authorizeGridBoxType(type: GridBoxType, cb: () => void) {
        let featureType: FeatureType = FeatureGridBox.getAuthorizationFeatureTypeByGridBoxType(type);
        this.authorizationService.authorize(featureType, cb, true, this.pageService.countOpenGridBoxes(type));
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

}

export interface GridConfigData {
    boxes?:{[id:string]:DockingItemConfig};
    docking?:DockingConfig;
}

class GridConfig {

    boxesConfig:{[id:string]:DockingItemConfig} = {};
    dockingConfig:DockingConfig = {tree:{root:null}};

    getConfig():GridConfigData {
        return {boxes:this.boxesConfig, docking:this.dockingConfig};
    }

    initConfig(config:GridConfigData){
        if(!Object.keys(config).length) {
            // MA set references when there is no config (so that config will be auto-updated)
            config.boxes = this.boxesConfig;
            config.docking = this.dockingConfig;
            return;
        }
        this.boxesConfig = config['boxes'];
        this.dockingConfig = config['docking'];
    }

    get numberOfBoxes():number {
        return Object.keys(this.boxesConfig).length;
    }

    boxes():DockingItemConfig[] {
        return this.stringValues(this.boxesConfig);
    }

    private stringValues<T>(obj:{[key:string]: T} ):T[] {
      return Object.keys(obj).map(function(v) { return obj[v];})
    }


  addBox(box:DockingItemConfig) {
        this.boxesConfig[box.id] = box;
    }

    getBox(id:string):DockingItemConfig {
        return this.boxesConfig[id];
    }

    removeBox(id:string) {
        delete this.boxesConfig[id];
    }

}

