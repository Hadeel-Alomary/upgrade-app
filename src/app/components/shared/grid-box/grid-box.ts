import {EventEmitter} from "@angular/core";
import {Properties, BoxProperties} from './properties';
import {GridBoxType, GridBoxUtils} from './grid-box-type';
import {Page, Accessor, ChannelRequestType} from '../../../services/index';
import {ArrayUtils, AppBrowserUtils, AppTcTracker} from '../../../utils/index';

import {SubscriptionLike as ISubscription} from 'rxjs';
import {GridNotification} from "../grid-notification-bar/index";
import {ToggleMaximizeRequest} from '../../grid';

export abstract class GridBox<T extends GridBoxProperties> extends Properties<T> {

    protected subscriptions:ISubscription[] = [];

    protected onceSubscriptions:{[key:string]: ISubscription} = {};

    private destroyed:boolean = false;

    constructor(protected accessor:Accessor){
        super();
    }

    /* input/output */
    id: string; // @input
    width: number; // @input
    page: Page; // @input
    close = new EventEmitter(); // @output
    changeHeight = new EventEmitter();
    toggleOverlayBoxMaximized = new EventEmitter<{maximized:boolean,id:string}>(); // @output

    // MA for height, it has special handling:
    // grid sets height of the box, but we return height of available window without toolbars.
     _height:number;
    get height(): number {
      let height:number = this._height - GridBox.TITLE_HEIGHT;
      if(this.isToolbarShown()){
        height -= GridBox.TOOLBAR_HEIGHT;
      }
      if(this.notification != null) {
        height -= GridBox.NOTIFICATION_BAR_HEIGHT;
      }
      if (!this.isTitleShown()) {
          return  height + GridBox.TITLE_HEIGHT;
      }

      return  height;
    }
    set height(height:number) {
        this._height = height;
    }

    public onClose() {
        this.close.emit(this.id);
    }

    public onHeightChange(height: number): void {
        this.changeHeight.emit(height);
    }

    public onToggleMaximize() {
        AppTcTracker.trackToggleMaximizeBox();
        let request:ToggleMaximizeRequest = {type:ChannelRequestType.ToggleMaximizeWindow, id: this.id};
        this.accessor.sharedChannel.request(request);
    }

    protected onDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        ArrayUtils.values(this.onceSubscriptions).forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
        this.destroyed = true;
    }

    protected isDestroyed():boolean {
        return this.destroyed;
    }

    protected subscribeOnce(key:string, subscription:ISubscription) {
        if(key in this.onceSubscriptions){
            this.onceSubscriptions[key].unsubscribe();
            delete this.onceSubscriptions[key];
        }
        this.onceSubscriptions[key] = subscription;
    }


    /* toolbar visibility */
    public isToolbarShown():boolean {
        return !this.gridBoxProperties.hideToolbar;
    }

    public toggleToolbarVisibility() {
        AppTcTracker.trackToggleToolbar();
        this.gridBoxProperties.hideToolbar = !this.gridBoxProperties.hideToolbar;
        this.onResize();
    }

    public showToolbar():void {
        this.gridBoxProperties.hideToolbar = false;
    }

    public hideToolbar():void {
        this.gridBoxProperties.hideToolbar = true;
    }

    protected onResize(){}

    /* loadProperties */
    protected loadProperties():boolean {
        let properties = this.getGridBoxPropertiesInPage(this.page, this.id);
        if(properties) {
            this.setProperties(properties);
        }
        return properties != null;
    }

     getGridBoxPropertiesInPage(page:Page, id:string):GridBoxProperties {
        if(!(id in this.page.grid.boxes)) { return null; }
        return this.page.grid.boxes[id].properties ? this.page.grid.boxes[id].properties as GridBoxProperties : null;
    }


    _pageId:string;
    public get pageId():string {
        if(this._pageId) { return this._pageId; }
        this._pageId = this.accessor.pageService.getPageContainingComponent(this.id);
        return this._pageId;
    }

    /* handle height -- to be revised once all handles are moved to icons (should be called toolbar height then?) */
    static TITLE_HEIGHT:number = 23;
    static TOOLBAR_HEIGHT:number = 30;
    static NOTIFICATION_BAR_HEIGHT:number = 30;
    get toolbarHeight():number { return GridBox.TOOLBAR_HEIGHT; }

    // title
    public title:string = null;

    /* grid box type */
    abstract get type():GridBoxType;

    // MA bringing enum to template: https://github.com/angular/angular/issues/2885
    public gridBoxType = GridBoxType;

    /* notification */
    private _notification:GridNotification;
    get notification():GridNotification {
        return this._notification;
    }
    set notification(notification:GridNotification) {
        this._notification = notification;
        this.onResize();
    }

    get gridBoxProperties(): GridBoxProperties {
        return <GridBoxProperties>this.p;
    }

    public isOverlayBox():boolean {
        return false;
    }

    public isTitleShown():boolean {
        return true;
    }

    isDesktop():boolean {
        return AppBrowserUtils.isDesktop();
    }
}

export interface GridBoxProperties extends BoxProperties{
    hideToolbar:boolean;
}
