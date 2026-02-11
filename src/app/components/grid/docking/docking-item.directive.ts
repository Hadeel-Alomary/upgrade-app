import {Directive, ElementRef, EventEmitter, OnInit, Output, Renderer2} from '@angular/core';
import {DockingItemConfig, DockingItemEvent} from './docking-config';
import {DockingDirective} from './docking.directive';
import {DomRectangle, DomUtils, Tc} from '../../../utils/index';

@Directive({
    selector: '[docking-item]',
    inputs: ['config: docking-item'],
})

export class DockingItemDirective implements OnInit {

    @Output() public onSizeChange: EventEmitter<DockingItemEvent> = new EventEmitter<DockingItemEvent>(false);

    config:DockingItemConfig;

    order:number;

    constructor( public el: ElementRef,  public renderer: Renderer2,  public dockingContainer: DockingDirective) {
        this.renderer.addClass(this.el.nativeElement, 'docking-item');
    }

    ngOnInit() {

        if(!this.config.undockedRectangle){
            this.initUndockingRectangleInCenter();
        }

        this.dockingContainer.addItem(this); // will also position floating item

        if(!this.config.docked) { // reflect position of floating item
            this.renderer.addClass(this.el.nativeElement, 'floating');
            if(this.config.selected) { this.select(); }
            DomUtils.updateElementRectangle(this.renderer, this.el.nativeElement, this.config.undockedRectangle);
            this.notifySizeChange(this.config.undockedRectangle.width, this.config.undockedRectangle.height);
        }
        if(this.config.maximize) {
            this.el.nativeElement.classList.add('maximized');
        }
    }

    /* rectangle/dom methods */

    moveRectangle(left:number, top:number){
        DomUtils.moveElement(this.renderer, this.el.nativeElement, left, top);
        this.config.undockedRectangle.left = left;
        this.config.undockedRectangle.top = top;
    }

    setDockedRectangle(rectangle:DomRectangle) {
        Tc.assert(this.config.docked, "set docked size for floating item");
        if(this.config.maximize) {
            this.maximizeSize();
            this.config.beforeMaximizeRectangle = rectangle;
            return;
        }
        this.updateRectangle(rectangle);
    }

    setFloatingRectangle(rectangle:DomRectangle) {
        Tc.assert(!this.config.docked, "set floating size for docked item");
        this.updateRectangle(rectangle);
    }

    updateHeightOfRectangle(height:number) {
        let rectangle: DomRectangle = {top: this.el.nativeElement.offsetTop , left:this.el.nativeElement.offsetLeft, width: this.el.nativeElement.offsetWidth, height: height};
        this.updateRectangle(rectangle);
    }

    maximizeSize() {
        var containerRectangle = this.dockingContainer.getElementRectangle();
        this.updateRectangle({top: 0, left:0, width: containerRectangle.width, height: containerRectangle.height});
    }

    getElementRectangle():DomRectangle {
        return DomUtils.getElementRectangle(this.el.nativeElement);
    }

    hasElement(element:HTMLElement):boolean {
        return this.el.nativeElement == element;
    }

    isUnderMouse(x:number, y:number) {
        return DomUtils.isPointInElement(this.el.nativeElement, x, y);
    }

    toggleMaximize() {
        if(!this.config.maximize){
            this.config.maximize = true;
            this.config.beforeMaximizeRectangle = this.getElementRectangle();
            this.el.nativeElement.classList.add('maximized');
            this.maximizeSize();
        } else {
            this.updateRectangle(this.config.beforeMaximizeRectangle);
            this.el.nativeElement.classList.remove('maximized');
            this.config.beforeMaximizeRectangle = null;
            this.config.maximize = false;
        }
    }

    /* docking methods */

    docked() {
        this.config.undockedRectangle = this.getElementRectangle();
        this.config.docked = true;
        this.renderer.removeClass(this.el.nativeElement, 'floating');
        this.unselect();
    }

    undock(x:number, y:number) { // x,y presents mouse point, so floating point will be around mouse

        this.config.docked = false;

        let floatingRectangle:DomRectangle = {
            top: y - 15,
            left: x - Math.floor(this.config.undockedRectangle.width / 2),
            width: this.config.undockedRectangle.width,
            height: this.config.undockedRectangle.height
        }

        this.renderer.addClass(this.el.nativeElement, 'floating');
        this.updateRectangle(floatingRectangle);
    }

    /* floating selection methods */

    select():void{
        this.el.nativeElement.classList.add('selected');
        this.config.selected = true;
    }

    unselect():void{
        this.el.nativeElement.classList.remove('selected');
        this.config.selected = false;
    }

    isSelected():boolean {
        return this.el.nativeElement.classList.contains('selected');
    }

    updateRectangle(rectangle: DomRectangle) {
        DomUtils.updateElementRectangle(this.renderer, this.el.nativeElement, rectangle);
        if(!this.config.docked){
            this.config.undockedRectangle = rectangle;
        }
        this.notifySizeChange(rectangle.width, rectangle.height);
    }

    notifySizeChange(width:number, height:number) {
        this.onSizeChange.emit({
            id: this.config.id,
            width: width,
            height: height
        });
    }

    initUndockingRectangleInCenter() {

        let containerRectangle: DomRectangle = this.dockingContainer.getElementRectangle();
        let top:number, left:number, width:number, height:number;

        width = this.config.width;
        height = this.config.height;
        left = Math.max(Math.floor( (containerRectangle.width - width) / 2), 0);
        top = Math.max(Math.floor( (containerRectangle.height - height) / 2), 0);

        this.config.undockedRectangle = {left: left, top: top, width: width, height: height};

    }

}
