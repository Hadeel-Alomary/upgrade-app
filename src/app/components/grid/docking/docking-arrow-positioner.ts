import {Renderer2} from '@angular/core';
import {DockingItemDirective} from './docking-item.directive';
import {DockingNodeDirection} from './docking-node-direction';
import {Tc, DomUtils, DomRectangle} from "../../../utils/index";

export class DockingArrowPositioner {

     lastPositionedItem:DockingItemDirective;
     lastHighlightedArrow:HTMLElement;
     active:boolean = false;
    
    constructor( public renderer:Renderer2,
                 public dockingElement:HTMLElement,
                 public arrowsElement:HTMLElement,
                 public items:DockingItemDirective[]){}

    
    onMouseMove(x:number, y:number):DockingNodeDirection {
        
        if(!this.active) { return null; }
        
        let item:DockingItemDirective =
            this.items.find(item => item.config.docked && DomUtils.isPointInRectangle(item.getElementRectangle(), x, y));
        
        if(item) {
            this.positionArrowContainerInItem(item);
            if(DomUtils.isPointInElement(this.arrowsElement, x, y)) {
                let direction:DockingNodeDirection = this.getHoveredArrow(x, y);
                if(direction != null) {
                    return direction;
                }           
            }
        }
        
        return null;
        
    }
    
    start() {
        this.active = true;
    }    
    
    stop() {
        this.active = false;
        this.renderer.removeClass(this.arrowsElement, 'active');
        this.lastPositionedItem = null;
        this.unhighlightArrow();
    }

    getDockedItem():DockingItemDirective {
        return this.lastPositionedItem;
    }
    
     getHoveredArrow(containerX:number, containerY:number):DockingNodeDirection {
        
        let {x,y} = DomUtils.mapPointFromParentToChild(this.arrowsElement, containerX, containerY);
        
        let elements = this.arrowsElement.getElementsByClassName('docking-arrow');
        
        for(var index = 0; index < elements.length; ++index) {
            let arrowElement:HTMLElement = elements.item(index) as HTMLElement;
            if(DomUtils.isPointInElement(arrowElement, x, y)){
                this.highlightArrow(arrowElement);
                let direction:DockingNodeDirection = Tc.enumValues(DockingNodeDirection).find(direction => {
                    let className:string = DockingNodeDirection[direction].toLowerCase();
                    return arrowElement.classList.contains(className);
                });
                return direction;                
            }
        }

        this.unhighlightArrow();
        
        return null;
        
    }

    
     positionArrowContainerInItem(item:DockingItemDirective) {

        if(this.lastPositionedItem == item) { return; }

        this.lastPositionedItem = item;

        let rectangle:DomRectangle = item.getElementRectangle();
        
        let xCenter:number = rectangle.left + Math.floor(rectangle.width/2);
        let yCenter:number = rectangle.top + Math.floor(rectangle.height/2);
        
        this.renderer.addClass(this.arrowsElement, 'active');

        let halfWidth:number = Math.floor(this.arrowsElement.offsetWidth / 2);
        let halfHeight:number = Math.floor(this.arrowsElement.offsetHeight / 2);
        
        DomUtils.moveElement(this.renderer, this.arrowsElement, xCenter - halfWidth, yCenter - halfHeight);                      
                
    }
    
     highlightArrow(arrowElement:HTMLElement) {

        if(this.lastHighlightedArrow == arrowElement){ return; }

        if(this.lastHighlightedArrow != null){
            this.lastHighlightedArrow.classList.remove('highlight');
        }       
        
        arrowElement.classList.add('highlight');
        
        this.lastHighlightedArrow = arrowElement;
        
    }

     unhighlightArrow() {
        if(this.lastHighlightedArrow != null){
            this.lastHighlightedArrow.classList.remove('highlight');
            this.lastHighlightedArrow = null;
        }       
    }
    
}


