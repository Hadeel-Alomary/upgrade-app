import {Renderer2} from '@angular/core';
import {DockingTree, DockingTreeNode, DockingTreeSeparator} from './docking-tree';
import {DockingItemDirective} from './docking-item.directive';
import {Tc, DomRectangle} from "../../../utils/index";

export class DockingResizer {

    constructor( public element:HTMLElement,
                 public renderer:Renderer2,
                 public tree:DockingTree,
                 public parentElement:HTMLElement,
                 public items:DockingItemDirective[]) {}

     static MIN_NODE_WIDTH = 100;
    
     active:boolean = false;
     separator:DockingTreeSeparator;
     separatorContainer:DomRectangle;
    
    onMouseMove(x:number, y:number):boolean {        

        if(this.active) {
            this.moveSeparator(x, y);
            return false;
        } 
        
        this.showOrHideSeparatorOnHover(x, y);
        return this.separator == null;
        
    }

    canResize(x:number, y:number):boolean {
        return !this.active && this.separator != null;
    }
    
    start() {
        this.active = true;
    }

    started() {
        return this.active;
    }

    highlighted() {
        return this.separator != null;
    }

    stop() {
        
        let node:DockingTreeNode = DockingTree.getSeparatorParent(this.tree.root, this.separator);
        this.resizeNode(node);        
        
        this.active = false;
        this.hideSeparator();
        
    }
    
     moveSeparator(x:number, y:number){
        if(this.separator.horizontal) {
            var separatorY = this.computeSeparatorY(y);
            this.separator.rectangle.top = separatorY;
            this.renderer.setStyle(this.element, 'top', separatorY + "px");
        } else {
            var separatorX = this.computeSeparatorX(x);
            this.separator.rectangle.left = separatorX;
            this.renderer.setStyle(this.element, 'left', separatorX + "px");
        }
    }
    
     showOrHideSeparatorOnHover(x:number, y:number){

        if(this.mouseOverFloatingItem(x, y)){
            if(this.separator != null) {
                this.hideSeparator();
            }
            return;
        }
        
        let separator:DockingTreeSeparator = DockingTree.getSeparatorUnderPoint(this.tree.root, x, y);
        if(separator == null) {
            if(this.separator != null) {
                this.hideSeparator();
            }
        } else {
            if(this.separator == null) {
                this.showSeparator(separator);
            } else if(this.separator != separator) {
                // separator has changed (for ex, when hovering from vertical to adjacent horizontal separator)
                // switch separators
                this.hideSeparator();
                this.showSeparator(separator);
            }
        }
        
    }
    
     resizeNode(node:DockingTreeNode) {
        let percent:number = node.separator.horizontal ?
            this.computePercent(node.rectangle.top, node.rectangle.top + node.rectangle.height, node.separator.rectangle.top) :
            this.computePercent(node.rectangle.left, node.rectangle.left + node.rectangle.width, node.separator.rectangle.left);
                
        node.percent = percent;        
    }

     computePercent(start:number, end:number, value:number):number {
        Tc.assert(start < value && value < end, "invalid computePercent input");
        return ((value - start) * 100) / (end - start);
    }


     hideSeparator() {
        this.separator = null;
        this.separatorContainer = null;
        this.renderer.removeClass(this.element, 'active');
        this.renderer.setStyle(this.parentElement, 'cursor', 'default');
    }
    
     showSeparator(separator:DockingTreeSeparator) {
        this.separator = separator;
        this.separatorContainer = DockingTree.getSeparatorParent(this.tree.root, this.separator).rectangle;
        this.renderer.setStyle(this.element, 'top', separator.rectangle.top + "px");
        this.renderer.setStyle(this.element, 'left', separator.rectangle.left + "px");
        this.renderer.setStyle(this.element, 'width', separator.rectangle.width + "px");
        this.renderer.setStyle(this.element, 'height', separator.rectangle.height + "px");
        this.renderer.addClass(this.element, 'active');
        this.renderer.setStyle(this.parentElement, 'cursor', separator.horizontal ? 'ns-resize' : 'ew-resize');
    }

     mouseOverFloatingItem(x:number, y:number): boolean {
        return this.items.find(item => !item.config.docked && item.isUnderMouse(x, y)) != null;
    }

     computeSeparatorX(mouseX:number) {

        var minX = this.separatorContainer.left + DockingResizer.MIN_NODE_WIDTH;
        var maxX = this.separatorContainer.left + this.separatorContainer.width - DockingResizer.MIN_NODE_WIDTH;

        if(mouseX < minX) {
            return minX;            
        }

        if(minX < mouseX && mouseX < maxX) {
            return mouseX;
        }

        return maxX;
        
    }

     computeSeparatorY(mouseY:number) {

        var minY = this.separatorContainer.top + DockingResizer.MIN_NODE_WIDTH;
        var maxY = this.separatorContainer.top + this.separatorContainer.height - DockingResizer.MIN_NODE_WIDTH;
        
        if(mouseY < minY) {
            return minY;            
        }

        if(minY < mouseY && mouseY < maxY) {
            return mouseY;
        }

        return maxY;
        
    }
    
}
