import {AppBrowserUtils, DomUtils} from '../../../utils/index';
import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
    selector: '[dropdown-submenu-toggle]'
})

export class SubmenuToggleDirective {

     inControl:boolean = false;



    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// ***************** ONLY FOR MOBILE ********************* ////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    private closeDropdownBind:EventListener = this.closeDropdown.bind(this);

    constructor( public el:ElementRef,  public renderer: Renderer2) {
        // MA mobile doesn't work on hovering (mouseenter and mouseleave) as in desktop.
        // I changed the code to add a click event to get it working for mobile. The problem is the closing "click"
        // event that could happen on far away element non-related to the directive host. To get this working, and only
        // for mobile, I am hooking on the document click event, and check if the event is originating from non-related element.
        // if it is the case, then I close the dropdown (if it opens).
        if(AppBrowserUtils.isMobile()) {
            window.document.addEventListener('click', this.closeDropdownBind, true);
        }
    }

    // MA the logic below is based on dropdown.directive (closing based on a document click).
    private closeDropdown(event:Event):void {

        if(AppBrowserUtils.isDesktop()) { // MA ONLY FOR MOBILE
            return;
        }

        if(!this.inControl){
            return;
        }

        if (event && this.el && this.el.nativeElement === event.target) {
            return;
        }

        // MA if toggleElement contains the event target (means we are clicking toggleElement), then returns
        if (event && this.el.nativeElement.contains(event.target)) {
            return;
        }

        this.renderer.removeClass(this.el.nativeElement, 'expand');

        this.inControl = false;
    }

    // MA only for mobile, expand/collapse the dropdown menu based on the click event
    @HostListener('click')
    onClick() {

        if(AppBrowserUtils.isDesktop()) { // ONLY MOBILE
            return;
        }

        this.inControl = !this.inControl;

        window.setTimeout(() => {
            if(!this.inControl) {
                this.renderer.removeClass(this.el.nativeElement, 'expand');
            } else {
                // Show submenu
                this.renderer.addClass(this.el.nativeElement, 'expand');
                // Position submenu to be within the screen bounds
                for(let i = 0; i < this.el.nativeElement.children.length; ++i) {
                    let element:HTMLElement = this.el.nativeElement.children[i];
                    if(element.tagName == 'UL') {
                        this.setSubMenuDropdownStyle(element);
                    }
                }
            }
        }, 200);

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////// ***************** END FOR MOBILE ********************** ////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    @HostListener('mouseenter')
     onMouseEnter() {

        if(AppBrowserUtils.isMobile()) { // ONLY DESKTOP
            return;
        }

        this.inControl = true;

        window.setTimeout(() => {
            if(!this.inControl) { return; }

            // Show submenu
            this.renderer.addClass(this.el.nativeElement, 'expand');

            // Position submenu to be within the screen bounds
            for(let i = 0; i < this.el.nativeElement.children.length; ++i) {
                let element:HTMLElement = this.el.nativeElement.children[i];
                if(element.tagName == 'UL') {
                    this.setSubMenuDropdownStyle(element);
                }
            }
        }, 200);

    }

    private setSubMenuDropdownStyle(element:HTMLElement) {

       this.setSubMenuDropdownPosition(element);
        // MA if menu is longer than available height, then clip it using max-height and overflow-y
        let maxAvailableHeight = document.body.clientHeight - 50;
        if(maxAvailableHeight <= element.getBoundingClientRect().height) {
            element.style["max-height"] = document.body.clientHeight - 50 + "px";
            element.style["overflow-y"] = "auto";
        }

        DomUtils.forceElementWithinScreenBounds(this.renderer, element);
    }


    private setSubMenuDropdownPosition(element:HTMLElement) {
        // MA for unknown reason, renderer.seltElementStyle wasn't updating "top"
        // instead, I am updating style directly
        if(element.style.position == 'fixed'){
            element.style.top = this.el.nativeElement.getBoundingClientRect().top + "px";
            element.style.right = document.body.getBoundingClientRect().width - this.el.nativeElement.getBoundingClientRect().left +  'px';
            element.style.left = this.el.nativeElement.getBoundingClientRect().right +  'px';
        }else{
            element.style.right = this.el.nativeElement.getBoundingClientRect().width + "px";
            element.style.left = this.el.nativeElement.getBoundingClientRect().width + "px";
            element.style.top = "0px";
        }
    }


    @HostListener('mouseleave')
     onMouseLeave() {

        if(AppBrowserUtils.isMobile()) { // ONLY DESKTOP
            return;
        }

        this.inControl = false;

        // MA if we stayed outside of the control for specific time, then hide submenu
        window.setTimeout(() => {
            if(!this.inControl) {
                this.renderer.removeClass(this.el.nativeElement, 'expand');
                for(let i = 0; i < this.el.nativeElement.children.length; ++i) {
                    let element: HTMLElement = this.el.nativeElement.children[i];
                    if (element.tagName == 'UL') {
                        // MA remove any height limiting that could have been added when expanding menu
                        element.style.removeProperty("max-height");
                        element.style.removeProperty("overflow-y");
                    }
                }
            }
        }, 200);

    }

}
