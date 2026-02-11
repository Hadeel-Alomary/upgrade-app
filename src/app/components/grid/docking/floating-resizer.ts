import {Renderer2} from '@angular/core';
import {DockingConstants} from './docking-constants';
import {DockingItemDirective} from './docking-item.directive';
import {Tc, DomUtils, DomRectangle} from "../../../utils/index";

export class FloatingResizer {

    constructor( public renderer:Renderer2,
                 public dockingElement:HTMLElement,
                 public placementElement:HTMLElement,
                 public items:DockingItemDirective[]){}
    
     static HANDLE_SELECTOR:string = '.handle';
    
     lastCursorStyle:string = 'default';
     resizedItem:DockingItemDirective;
     resizeDirection:ResizeDirection;
     resizeInitialPoint:{x:number, y:number};
    
    onMouseMove(x:number, y:number):boolean {

        if(this.started()) {

            let xDiff:number = x - this.resizeInitialPoint.x;
            let yDiff:number = y - this.resizeInitialPoint.y;

            let rectangle:DomRectangle = this.resizedItem.getElementRectangle();

            this.resizeRectangle(this.resizeDirection, rectangle, xDiff, yDiff);

            DomUtils.updateElementRectangle(this.renderer, this.placementElement, rectangle);
            
            return false;
        }
        
        if(this.canResize(x, y)) {
            return false;
        }
        
        return true;
        
    }
    
    canResize(x:number, y:number):boolean {

                
        let floatingItems:DockingItemDirective[] = this.items.filter(item => !item.config.docked);
        
        if(0 < floatingItems.length) { // no floating items, nothing to do
            
            // if we have more than one floating item, then we may have cascaded floating windows.
            // we need to bring the "selected" floating item (if any) to the top of the stack (to be last item).
            if(1 < floatingItems.length) {

                let selectedFloatingItem:DockingItemDirective = floatingItems.find(item => item.config.selected && !item.config.docked);
                if(selectedFloatingItem) {
                    floatingItems.splice(floatingItems.indexOf(selectedFloatingItem), 1);
                    floatingItems.push(selectedFloatingItem);
                }
            }

            // go through floating item (in reverse order, from top to bottom) and check if the mouse is on
            // a resizing edge. If not, then check if the mouse is contained within that floating window, and
            // if it does, then stop searching anymore. 
            for(let index = floatingItems.length - 1; 0 <= index; --index) {             
                let direction = this.getResizeDirection(floatingItems[index], x, y);
                if(direction != null) {
                    this.setCursorStyle(this.getResizeDirectionCursor(direction));
                    return true;
                }
                if(DomUtils.isPointInRectangle(floatingItems[index].getElementRectangle(), x, y)) {
                    break; // floating element contains the point, exit search
                }
            }
            
        }
        
        this.setCursorStyle('default');
        return false;
                
    }
    
    start(x:number, y:number) {
        for(var index = 0; index < this.items.length; ++index) {
            let direction = this.getResizeDirection(this.items[index], x, y);
            if(direction != null) {
                this.resizedItem = this.items[index];
                this.resizeDirection = direction;
                this.resizeInitialPoint = {x:x, y:y};
                this.renderer.addClass(this.placementElement, 'active');
                DomUtils.updateElementRectangle(this.renderer, this.placementElement, this.resizedItem.getElementRectangle());                
                return;
            }
        }                        
    }

    started():boolean {
        return this.resizedItem != null;
    }

    highlighted():boolean {
        return ['ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize'].includes(this.lastCursorStyle);        
    }
    
    stop() {

        let rectangle:DomRectangle = DomUtils.getElementRectangle(this.placementElement);
        this.resizedItem.setFloatingRectangle(rectangle);        
        this.renderer.removeClass(this.placementElement, 'active');
        
        this.resizedItem = null;
        this.resizeDirection = null;
        this.resizeInitialPoint = null;
    }
    
     resizeRectangle(direction:ResizeDirection, rectangle:DomRectangle, xDiff:number, yDiff:number) {
        switch(direction){
        case ResizeDirection.Left:
            rectangle.left += xDiff;
            rectangle.width -= xDiff;
            break;
        case ResizeDirection.Right:
            rectangle.width += xDiff;
            break;
        case ResizeDirection.Bottom:
            rectangle.height += yDiff;
            break;
        case ResizeDirection.BottomLeft:
            rectangle.height += yDiff;
            rectangle.left += xDiff;
            rectangle.width -= xDiff;
            break;
        case ResizeDirection.BottomRight:
            rectangle.height += yDiff;
            rectangle.width += xDiff;
            break;
        default:
            Tc.error("unknown resizing direction");
            break;
        }

        // MA maintain minimum dimensions for resized rectangle
        if(rectangle.width < 200){ rectangle.width = 200; }
        if(rectangle.height < 200){ rectangle.height = 200; }
        
    }
    
     getResizeDirectionCursor(direction:ResizeDirection){

        switch(direction){
        case ResizeDirection.Left:
        case ResizeDirection.Right:
            return 'ew-resize';
        case ResizeDirection.Bottom:
            return 'ns-resize';
        case ResizeDirection.BottomLeft:
            return 'nesw-resize';
        case ResizeDirection.BottomRight:
            return 'nwse-resize';
        default:
            Tc.error("unknown resizing direction");
            break;
        }
        return null;
        
    }
    
     getResizeDirection(item:DockingItemDirective, x:number, y:number):ResizeDirection {

        if(item.config.docked) { return null; }

        let rectangle:DomRectangle = item.getElementRectangle();
        
        return Tc.enumValues(ResizeDirection).find(direction => this.isDirectionResizable(direction, rectangle, x, y));
        
    }


     isDirectionResizable(direction:ResizeDirection, rectangle:DomRectangle, x:number, y:number ) {
        
        let resizingArea:DomRectangle;

        switch(direction) {
        case ResizeDirection.Left:
            resizingArea = this.getLeftResizingArea(rectangle);
            break;
        case ResizeDirection.Bottom:
            resizingArea = this.getBottomResizingArea(rectangle);
            break;
        case ResizeDirection.Right:
            resizingArea = this.getRightResizingArea(rectangle);
            break;
        case ResizeDirection.BottomLeft:
            resizingArea = this.getBottomLeftResizingArea(rectangle);
            break;
        case ResizeDirection.BottomRight:
            resizingArea = this.getBottomRightResizingArea(rectangle);
            break;
        default:
            Tc.error("unknown resizing direction");
        }
        
        return DomUtils.isPointInRectangle(resizingArea, x, y);                
        
    }

     getLeftResizingArea(rectangle:DomRectangle):DomRectangle {
        return {
            left: rectangle.left - DockingConstants.DOCKING_BORDER_WIDTH * 2,
            top: rectangle.top,
            width: DockingConstants.DOCKING_BORDER_WIDTH * 3,
            height: rectangle.height - DockingConstants.DOCKING_BORDER_WIDTH
        }
    }

     getRightResizingArea(rectangle:DomRectangle):DomRectangle {
        return {
            left: rectangle.left + rectangle.width - DockingConstants.DOCKING_BORDER_WIDTH,
            top: rectangle.top,
            width: DockingConstants.DOCKING_BORDER_WIDTH * 3,
            height: rectangle.height - DockingConstants.DOCKING_BORDER_WIDTH
        }
    }

     getBottomResizingArea(rectangle:DomRectangle):DomRectangle {
        return {
            left: rectangle.left + DockingConstants.DOCKING_BORDER_WIDTH,
            top: rectangle.top + rectangle.height - DockingConstants.DOCKING_BORDER_WIDTH,
            width: rectangle.width - DockingConstants.DOCKING_BORDER_WIDTH * 2,
            height: DockingConstants.DOCKING_BORDER_WIDTH * 3
        }
    }

     getBottomLeftResizingArea(rectangle:DomRectangle): DomRectangle {
        return {
            left: rectangle.left - DockingConstants.DOCKING_BORDER_WIDTH * 2,
            top: rectangle.top + rectangle.height - DockingConstants.DOCKING_BORDER_WIDTH * 2,
            width: DockingConstants.DOCKING_BORDER_WIDTH * 4,
            height: DockingConstants.DOCKING_BORDER_WIDTH * 4
        }
    }

     getBottomRightResizingArea(rectangle:DomRectangle): DomRectangle {
        return {
            left: rectangle.left + rectangle.width - DockingConstants.DOCKING_BORDER_WIDTH * 2,
            top: rectangle.top + rectangle.height - DockingConstants.DOCKING_BORDER_WIDTH * 2,
            width: DockingConstants.DOCKING_BORDER_WIDTH * 4,
            height: DockingConstants.DOCKING_BORDER_WIDTH * 4
        }
    }


     setCursorStyle(cursorStyle:string) {
        if(cursorStyle == this.lastCursorStyle){ return; }
        // remove previous cursor class and add the new one
        this.renderer.removeClass(this.dockingElement, `cursor-${this.lastCursorStyle}`);
        this.renderer.addClass(this.dockingElement, `cursor-${cursorStyle}`);
        this.lastCursorStyle = cursorStyle;
    }
    
}


export enum ResizeDirection {
    // MA the order is important. We need to have edge cases (bottom left and bottom right)
    // to be at the top, and therefore, to be searched first. 
    BottomLeft = 1,
    BottomRight,    
    Left,
    Bottom,
    Right
}
