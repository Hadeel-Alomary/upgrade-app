import {DockingItemDirective} from './docking-item.directive';

import {Tc} from "../../../utils/index";

const maxBy = require("lodash/maxBy");

export class FloatingItemSelector {

    constructor( public items:DockingItemDirective[]) {}

    selectOnClick(x:number, y:number):void {

        let floatingItems:DockingItemDirective[] = this.items.filter(item => !item.config.docked);
        if(floatingItems.length == 0) { return; }
        
        let floatingItemsUnderMouse:DockingItemDirective[] = floatingItems.filter(item => item.isUnderMouse(x, y));
        if(floatingItemsUnderMouse.length == 0) { return; }

        let selectedItemUnderMouse:DockingItemDirective = floatingItemsUnderMouse.find(item => item.isSelected());
        if(selectedItemUnderMouse != null) { return; }

        let selectedItem:DockingItemDirective = floatingItems.find(item => item.isSelected());
        if(selectedItem != null) { selectedItem.unselect(); }

        let maxOrderElement = maxBy(floatingItemsUnderMouse, (item: DockingItemDirective) => item.order);

        maxOrderElement.select();
        
    }

    selectItem(item:DockingItemDirective):void {
        Tc.assert(!item.config.docked, "cannot select a docked item");
        let selectedItem:DockingItemDirective = this.items.find(item => !item.config.docked && item.isSelected());
        if(selectedItem != null) { selectedItem.unselect(); }
        item.select();        
    }
    
}
