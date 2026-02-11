import {
    Directive,
    ElementRef,
    Renderer2,
    OnInit,
    SimpleChange,
    OnDestroy
} from '@angular/core';

import {DockingConfig} from './docking-config';
import {DockingTree} from './docking-tree';
import {Tc, AppTcTracker} from "../../../utils/index";
import {DockingItemDirective} from './docking-item.directive';
import {DockingResizer} from './docking-resizer';
import {FloatingDragger} from './floating-dragger';
import {FloatingResizer} from './floating-resizer';
import {FloatingItemSelector} from './floating-item-selector';
import {DockingArrowPositioner} from './docking-arrow-positioner';
import {DockingRootPositioner} from './docking-root-positioner';
import {DomUtils, DomRectangle} from "../../../utils/index";

import {SharedChannel, ChannelRequest, ChannelRequestType} from '../../../services/index';

import {SubscriptionLike as ISubscription} from 'rxjs';

import remove from 'lodash/remove';

// const remove = require("lodash/remove");

@Directive({
    standalone:true,
    selector: '[docking]',
    inputs: ['config: docking', 'active: active'],
    host: {
        '(mousemove)': 'onMouseMove($event)',
        '(mousedown)': 'onMouseDown($event)',
        '(mouseup)': 'onMouseUp($event)',
        '(window:resize)': 'onResize()',
    }
})

export class DockingDirective implements OnInit, OnDestroy {
     active:boolean;
     items:DockingItemDirective[] = [];
     config:DockingConfig;

     dockingResizer:DockingResizer;
     floatingResizer:FloatingResizer;
     floatingDragger:FloatingDragger;
     floatingItemSelector:FloatingItemSelector;

     readyToDragElement:HTMLElement;
     readyToDragElementPosition:{x:number, y:number};

     subscriptions:ISubscription[] = [];

    constructor( public el: ElementRef,  public renderer: Renderer2,  public sharedChannel:SharedChannel) {
        this.renderer.addClass(this.el.nativeElement, 'docking-container');

        this.subscriptions.push(
            this.sharedChannel.getRequestStream().subscribe(channelRequest => {
                if(channelRequest.type == ChannelRequestType.ToggleMaximizeWindow){
                    this.handleMaximizeRequest(<ToggleMaximizeRequest>channelRequest);
                }
            })
        );

    }

    ngOnInit(): void {

        let separatorElement = this.getElementByClassName("docking-container-separator");
        let placementElement = this.getElementByClassName("docking-container-placeholder");
        let arrowsElement = this.getElementByClassName("docking-container-arrows");
        let rootIconElement = this.getElementByClassName("docking-container-root-icon");

        this.floatingItemSelector = new FloatingItemSelector(this.items);
        this.dockingResizer = new DockingResizer(separatorElement, this.renderer, this.config.tree, this.el.nativeElement, this.items);
        this.floatingResizer = new FloatingResizer(this.renderer, this.el.nativeElement, placementElement, this.items);
        let dockingArrowPositioner = new DockingArrowPositioner(this.renderer, this.el.nativeElement, arrowsElement, this.items);
        let dockingRootPositioner = new DockingRootPositioner(this.renderer, rootIconElement, this.items);
        this.floatingDragger = new FloatingDragger(this.renderer, this.el.nativeElement, placementElement, dockingArrowPositioner, dockingRootPositioner);

        this.updateEmptyCssClass();

    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if(changes['active']) {
            this.active ? this.renderer.addClass(this.el.nativeElement, "active") : this.renderer.removeClass(this.el.nativeElement, "active");
            // update the sizes on selecting the page (in case there has been a resize of screen or such)
            this.onResize();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
    }

    // MA called by DockingItemDirective to add itself
    addItem(item:DockingItemDirective) {

        if(!item.config.placed){ // new item added, exit maximize
            this.exitMaximizeIfExists();
            this.floatingItemSelector.selectItem(item);
        }

        item.order = this.items.length; // used to maintain overlapping without changing z-index

        this.items.push(item);

        if(!item.config.docked) {
            if(!item.config.placed){ // item was not placed before
                // MA auto-dock only if single item in empty tree
                if( (this.config.tree.root == null) && (this.items.length == 1) && !item.config.placed){
                    this.addRootToTree(item.config.id);
                    item.config.docked = true;
                    this.updateDockedItemsSize();
                } else {
                    this.positionNonPlacedFloatingItem(item); // position not placed floating item
                }
            }
        } else {
            this.updateDockedItemsSize();
        }

        item.config.placed = true; // mark item as "placed"

        this.updateEmptyCssClass();

    }

    removeItem(id:string){

        let item:DockingItemDirective = this.items.find(item => item.config.id == id);
        remove(this.items, (item: DockingItemDirective) => item.config.id == id);

        if(item.config.docked) {
            DockingTree.deleteItem(this.config.tree, id);
            this.updateDockedItemsSize();
        }

        this.updateEmptyCssClass();

    }

    getElementRectangle():DomRectangle {
        return DomUtils.getElementRectangle(this.el.nativeElement);
    }

    /* docking */

     undockItem(item:DockingItemDirective, x:number, y:number) {
        let node = DockingTree.getLeaf(this.config.tree.root, item.config.id);
        this.removeItem(node.leafId);
        item.undock(x, y);
        this.items.push(item);
        this.updateEmptyCssClass();
        this.updateDockedItemsSize();
    }

     addRootToTree(id:string){
        Tc.assert(!this.config.tree.root, "cannot add root while one exists");
        this.config.tree.root = {leaf: true, leafId:id};
        return;
    }

     deleteItemFromTree(id:string) {
        DockingTree.deleteItem(this.config.tree, id);
    }

     updateDockedItemsSize() {

        let rectangle:DomRectangle = {
            top: 0,
            left: 0,
            width: this.el.nativeElement.offsetWidth,
            height: this.el.nativeElement.offsetHeight
        };

        // compute docked item sizes to reflect new dimensions
        DockingTree.computeTreeSize(this.config.tree, rectangle);

        // reflect computed sizes on the docked items
        this.items.forEach(dockingItem => {
            if(dockingItem.config.docked) {
                let leaf = DockingTree.getLeaf(this.config.tree.root, dockingItem.config.id);
                dockingItem.setDockedRectangle(leaf.rectangle);
            }
        });

    }


    /* mouse events handlers */

     onMouseMove(e:MouseEvent): boolean {

        let {x, y} = DomUtils.mapPointFromParentToChild(this.el.nativeElement, e.clientX, e.clientY);

        // MA if draggable element is detected, then start dragging on move
        if(this.readyToDragElement && this.isMouseMovedEnoughToStartDragging(x, y)){
            this.startDragging(e);
        }

        // MA "FIRST ROUND" give priority to handle mouse moves to either "started" or "highlighted" modes
        if(this.floatingDragger.started() || this.floatingDragger.highlighted()) {
            this.floatingDragger.onMouseMove(x, y, e);
            return false;
        }
        if(this.dockingResizer.started() || this.dockingResizer.highlighted()) {
            this.dockingResizer.onMouseMove(x, y);
            return false;
        }
        if(this.floatingResizer.started() || this.floatingResizer.highlighted()) {
            this.floatingResizer.onMouseMove(x, y);
            return false;
        }


        // MA "SECOND ROUND" nothing started or highlighted, so go through all modes trying to handle mouse move
        if(!this.floatingDragger.onMouseMove(x, y, e)) {
            return false;
        }

        if(!this.dockingResizer.onMouseMove(x, y)) {
            return false;
        }

        if(!this.floatingResizer.onMouseMove(x, y)) {
            return false;
        }

        return true;

    }

     onMouseDown(e: MouseEvent): boolean {

        let {x, y} = DomUtils.mapPointFromParentToChild(this.el.nativeElement, e.clientX, e.clientY);

        if(this.floatingResizer.canResize(x, y)){
            this.floatingResizer.start(x, y);
            return false;
        }

        // in order to bring clicked floating item to the top
        this.floatingItemSelector.selectOnClick(x, y);

        this.readyToDragElement = this.floatingDragger.canDrag(e);
        if(this.readyToDragElement) {
            // MA detect draggableElement on mouse down and start dragging on mouse move
            this.readyToDragElementPosition = {x: x, y:y};
            return false;
        }

        if(this.dockingResizer.canResize(x, y)) {
            this.dockingResizer.start();
            return false;
        }

        return true;
    }

     onMouseUp(e: MouseEvent): boolean {

        // MA on mouse up, reset any draggable element
        this.readyToDragElement = null;

        if(this.floatingDragger.started()){
            if(this.floatingDragger.shouldDockRootItem()){
                AppTcTracker.trackDocking();
                this.floatingDragger.getDraggedItem().docked();
                this.addRootToTree(this.floatingDragger.getDraggedItem().config.id);
                this.updateDockedItemsSize();
            } else if(this.floatingDragger.shouldDock()){
                AppTcTracker.trackDocking();
                this.floatingDragger.getDraggedItem().docked();
                DockingTree.addItem(this.config.tree,
                                    this.floatingDragger.getDraggedItem().config.id,
                                    this.floatingDragger.getDockedItem().config.id,
                                    this.floatingDragger.getDockingDirection());
                this.updateDockedItemsSize();
            }
            this.floatingDragger.stop();
            return false;
        }

        if(this.dockingResizer.started()) {
            this.dockingResizer.stop();
            this.updateDockedItemsSize();
            return false;
        }

        if(this.floatingResizer.started()){
            this.floatingResizer.stop();
            return false;
        }

        return true;

    }

     onResize() {
        if(this.active) {
            this.updateDockedItemsSize();
            this.resizeMaximize();
        }
    }

    /* maximize */

     resizeMaximize() {
        this.items.forEach(item => {
            if(item.config.maximize) {
                item.maximizeSize();
            }
        });
    }

     handleMaximizeRequest(channelRequest:ToggleMaximizeRequest){
        if(!this.active) { return; } // only handle maximize if you are "active" docking container
        let id:string = channelRequest.id;
        let item = this.items.find(item => item.config.id == id);
        item.toggleMaximize();
    }

     exitMaximizeIfExists() {
        this.items.forEach(item => {
            if(item.config.maximize) {
                item.unselect();
                item.toggleMaximize();
            }
        });
    }

    /* misc */

     isMouseMovedEnoughToStartDragging(x:number, y:number) {

        let x1 = this.readyToDragElementPosition.x;
        let y1 = this.readyToDragElementPosition.y;
        let x2 = x;
        let y2 = y;

        // http://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
        let d = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );

        return 10 < d;

    }

     startDragging(e:MouseEvent) {
        let draggableItem:DockingItemDirective = this.items.find(item => item.hasElement(this.readyToDragElement));
        Tc.assert(draggableItem != null, "fail to find item with HTML element");
        if(draggableItem.config.docked) {
            this.undockItem(draggableItem, this.readyToDragElementPosition.x, this.readyToDragElementPosition.y);
        }
        let isMaximizeWindow:boolean = draggableItem.config.maximize;
        if(isMaximizeWindow){
            draggableItem.toggleMaximize();
        }
        this.floatingDragger.start(draggableItem, e, isMaximizeWindow);
        this.readyToDragElement = null;
    }

     getElementByClassName(className:string) {
        return this.el.nativeElement.getElementsByClassName(className)[0];
    }

     positionNonPlacedFloatingItem(item:DockingItemDirective) {
        // MA try to prevent newly placed floating item from overlaying other floating items (by adding offset)
        let numberOfFloatingItems:number = 0;
        this.items.forEach(item => numberOfFloatingItems += !item.config.docked && item.config.placed ? 1 : 0);
        item.moveRectangle(item.config.undockedRectangle.left + numberOfFloatingItems * 20,
                           item.config.undockedRectangle.top + numberOfFloatingItems * 20);

    }

     updateEmptyCssClass(){
         this.items.length == 0 ? this.renderer.addClass(this.el.nativeElement, "empty") : this.renderer.removeClass(this.el.nativeElement, "empty");
    }


}


export interface ToggleMaximizeRequest extends ChannelRequest {
    id:string;
}
