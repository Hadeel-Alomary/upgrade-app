import {Renderer2} from '@angular/core';
import {DockingItemDirective} from './docking-item.directive';
import {DomUtils} from "../../../utils/index";

export class DockingRootPositioner {
    
     active:boolean = false;
     dockable:boolean = false;
    
    constructor( public renderer:Renderer2,
                 public iconElement:HTMLElement,
                 public items:DockingItemDirective[]){}
    
    onMouseMove(x:number, y:number):boolean {
        
        if(!this.active) { return true; }

        this.dockable = false;
        
        if(DomUtils.isPointInElement(this.iconElement, x, y)) {
            this.renderer.addClass(this.iconElement, 'highlight');
            this.dockable = true;
        }
        
        this.renderer.removeClass(this.iconElement, 'highlight');
        
        return false;
        
    }
    
    start() {
        let dockedItem = this.items.find(item => item.config.docked);
        this.active = dockedItem == null;
        if(this.active) {
            this.renderer.addClass(this.iconElement, 'active');
        }

    }

    isDockable():boolean {
        return this.dockable;
    }
        
    stop() {
        this.active = false;
        this.dockable = false;
        this.renderer.removeClass(this.iconElement, 'highlight');
        this.renderer.removeClass(this.iconElement, 'active');
    }
                
}


