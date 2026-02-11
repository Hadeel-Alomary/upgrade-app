import {Renderer2} from '@angular/core';
import {DockingItemDirective} from './docking-item.directive';
import {DockingNodeDirection} from './docking-node-direction';
import {DockingArrowPositioner} from './docking-arrow-positioner';
import {DockingRootPositioner} from './docking-root-positioner';
import {Tc, DomUtils, DomRectangle} from "../../../utils/index";

export class FloatingDragger {
    
     static HANDLE_SELECTOR:string = '.handle';

     lastCursorStyle:string = 'default';
    
     draggedItem:DockingItemDirective;
     draggedXOffset:number;
     draggedYOffset:number;
     dockingDirection:DockingNodeDirection;
     dockedItem:DockingItemDirective;

    constructor( public renderer:Renderer2,
                 public dockingElement:HTMLElement,
                 public placementElement:HTMLElement,
                 public arrowPositioner:DockingArrowPositioner,
                 public rootPosition:DockingRootPositioner){}


    onMouseMove(x:number, y:number, event:MouseEvent):boolean {
        
        if(this.draggedItem) {

            // returning false means that rootPosition handled event
            if(!this.rootPosition.onMouseMove(x, y)) { 
                if(this.rootPosition.isDockable()){
                    let dockingRectangle = DomUtils.getElementRectangle(this.dockingElement);
                    dockingRectangle.top = 0;
                    dockingRectangle.left = 0;
                    DomUtils.updateElementRectangle(this.renderer, this.placementElement, dockingRectangle);
                } else {
                    this.movePlacementElement(event);
                }
                return false;
            }
            
            this.dockingDirection = this.arrowPositioner.onMouseMove(x, y);
            if(null != this.dockingDirection){
                this.dockedItem = this.arrowPositioner.getDockedItem();
                let dockingRectangle = this.getDockingRectangle(this.dockedItem, this.dockingDirection);
                DomUtils.updateElementRectangle(this.renderer, this.placementElement, dockingRectangle);
            } else {
                this.dockedItem = null;
                this.movePlacementElement(event);
            }
            
            return false;
            
        }
        
        if(this.canDrag(event)) {
            this.setCursorStyle('move');
            return false;
        } 
        
        this.setCursorStyle('default');
        
        return true;
        
    }
    
    canDrag(event:MouseEvent):HTMLElement {
        let startElement:HTMLElement = event.target as HTMLElement;
        let parentElement:HTMLElement = startElement;
        while (parentElement && parentElement != this.dockingElement) {

            /**************************Handle Exception*******************************/
            /*Exception Message: Object [object HTMLCanvasElement] has no method matches */
            let elementHasMatchesMethod:boolean = parentElement.matches != undefined;
            /*************************************************************************/

            if (elementHasMatchesMethod && parentElement.matches(FloatingDragger.HANDLE_SELECTOR)){
                return this.findDraggableItem(parentElement);
            }
            parentElement = parentElement.parentElement;
        }
        
        return null;        
    }
    
    start(dockingItem:DockingItemDirective, event:MouseEvent, positionMaximizedWindow:boolean = false){
        
        this.draggedItem = dockingItem;
        
        let rectangle:DomRectangle = dockingItem.getElementRectangle();
        
        this.draggedXOffset = event.clientX - rectangle.left;
        this.draggedYOffset = event.clientY - rectangle.top;

        // MA for maximized window, when we start dragging, it return normal. However,
        // it needs special positioning since its "rectangle" was in "flux"
        if(positionMaximizedWindow) {
            this.draggedXOffset = Math.floor(rectangle.width/2);
            this.draggedYOffset = 60;
            rectangle.top = event.clientY - this.draggedYOffset;
            rectangle.left = event.clientX - this.draggedXOffset;
        }
        
        this.renderer.addClass(this.placementElement, 'active');
        
        DomUtils.updateElementRectangle(this.renderer, this.placementElement, rectangle);

        this.arrowPositioner.start();

        this.rootPosition.start();
        
    }
    
    started():boolean {
        return this.draggedItem != null;
    }

    highlighted():boolean {
        return this.lastCursorStyle == 'move';
    }
    
    stop() {
        
        if(!this.shouldDock() && !this.shouldDockRootItem()) {
            this.moveDraggedItem();
        }
        
        this.rootPosition.stop();
        
        this.arrowPositioner.stop();
        
        this.renderer.removeClass(this.placementElement, 'active');
        
        this.resetState();
        
    }
    
    shouldDockRootItem():boolean {
        return this.rootPosition.isDockable();
    }
    
    shouldDock():boolean {
        return this.dockingDirection != null;
    }

    getDockingDirection():DockingNodeDirection {
        return this.dockingDirection;
    }

    getDockedItem():DockingItemDirective {
        return this.dockedItem;
    }

    getDraggedItem():DockingItemDirective{
        return this.draggedItem;
    }
    
     movePlacementElement(event:MouseEvent) {
        let rectangle = this.draggedItem.getElementRectangle();                
        rectangle.top = event.clientY - this.draggedYOffset;
        rectangle.left = event.clientX - this.draggedXOffset;                
        DomUtils.updateElementRectangle(this.renderer, this.placementElement, rectangle);
    }
    
     findDraggableItem(draggedElement:HTMLElement):HTMLElement {
        let parentElement:HTMLElement = draggedElement;
        while (parentElement && parentElement != this.dockingElement) {
            if(parentElement.classList.contains('docking-item')){
                return parentElement;
            }
            parentElement = parentElement.parentElement;
        }
        Tc.error("fail to find draggable item for dragging event");
        return null;
    }
        
     moveDraggedItem() {
        let rectangle:DomRectangle = DomUtils.getElementRectangle(this.placementElement);        
        this.draggedItem.setFloatingRectangle(rectangle);
    }
    
     getDockingRectangle(item:DockingItemDirective, direction:DockingNodeDirection):DomRectangle {

        let rectangle = item.getElementRectangle();

        let halfWidth:number = Math.floor(rectangle.width / 2);
        let halfHeight:number = Math.floor(rectangle.height / 2);
        
        switch(direction){
        case DockingNodeDirection.Left:
            return {top: rectangle.top, left: rectangle.left, width: halfWidth, height: rectangle.height};
        case DockingNodeDirection.Right:
            return {top: rectangle.top, left: rectangle.left + halfWidth, width: halfWidth, height: rectangle.height};
        case DockingNodeDirection.Top:
            return {top: rectangle.top, left: rectangle.left, width: rectangle.width, height: halfHeight};
        case DockingNodeDirection.Bottom:
            return {top: rectangle.top + halfHeight, left: rectangle.left, width: rectangle.width, height: halfHeight};
        default:
            Tc.error("unknown direction");
        }

        return null;
        
    }

     resetState() {
        this.lastCursorStyle = 'default';
        this.draggedItem = null;
        this.draggedXOffset = null;
        this.draggedYOffset = null;
        this.dockingDirection = null;
        this.dockedItem = null;
    }
    
     setCursorStyle(cursorStyle:string) {
        if(cursorStyle == this.lastCursorStyle){ return; }
        this.renderer.setStyle(this.dockingElement, 'cursor', cursorStyle);
        this.lastCursorStyle = cursorStyle;
    }
        
}
