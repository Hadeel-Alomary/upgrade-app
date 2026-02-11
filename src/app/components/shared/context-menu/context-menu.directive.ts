import {
    Directive, OnInit, OnChanges, OnDestroy, Input, ElementRef, Renderer2, HostListener
} from '@angular/core';

import {SubscriptionLike as ISubscription} from 'rxjs';

import {AppDropdownMenuPosition, Tc, DomUtils, StringUtils} from "../../../utils/index";

import {SharedChannel, ChannelRequestType, ChannelRequest} from '../../../services/index';

@Directive({selector: '[context-menu]' , standalone: true})
export class ContextMenuDirective implements OnChanges, OnInit, OnDestroy {

    @Input() public left:number;
    @Input() public top:number;
    @Input() public isHoveredTooltip: boolean;

     dropdownMenuPosition:AppDropdownMenuPosition = new AppDropdownMenuPosition();
     handleEventBind:EventListener = this.handleEvent.bind(this);
     isShown:boolean = false;
     inited:boolean = false;
     id:string;

     subscriptions:ISubscription[] = [];

    constructor( public el:ElementRef,  public renderer: Renderer2,  public sharedChannel:SharedChannel) {
        this.id = StringUtils.guid();
        this.subscriptions.push(
            this.sharedChannel.getRequestStream().subscribe(channelRequest => this.onChannelRequest(channelRequest))
        );
    }

    ngOnInit() {
        this.inited = true;
    }

    ngOnChanges() {
        if(this.inited) {
            if(this.isShown){ this.hideMenu(); }
            this.showMenu();
        }
    }

    ngOnDestroy() {
        if(this.isShown){ this.hideMenu(); }
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
    }

     showMenu() {

        this.renderer.addClass(this.el.nativeElement, 'open');

        let offsetParent = this.dropdownMenuPosition.parentOffsetEl(this.el.nativeElement);
        Tc.assert(offsetParent != window.document, "no offset parent for context menu");
        let offsetParentEl = offsetParent as HTMLElement;

        let offsetParentBox = this.dropdownMenuPosition.offset(offsetParentEl);
        offsetParentBox.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
        offsetParentBox.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;

        let leftOffset:number = this.left - offsetParentBox.left;
        let topOffset:number = this.top - offsetParentBox.top;
        let rightOffset:number = offsetParentBox.right - this.left;

        this.renderer.setStyle(this.el.nativeElement, 'right', rightOffset + 'px');
        this.renderer.setStyle(this.el.nativeElement, 'left', leftOffset + 'px');
        this.renderer.setStyle(this.el.nativeElement, 'top', topOffset + 'px');

        //the new context menu must be prepared to get dimensions correctly.
        setTimeout(() => {
            DomUtils.forceElementWithinScreenBounds(this.renderer, this.el.nativeElement);
        }, 0)

         this.isHoveredTooltip ? window.document.addEventListener('mouseover', this.handleEventBind, true) :
             window.document.addEventListener('click', this.handleEventBind, true);

        this.isShown = true;

        this.hideOtherContextMenus();

    }

     hideOtherContextMenus() {

        // MA hide our context menu
        var request:ShowContextMenuRequest = {type: ChannelRequestType.ShowContextMenu, id: this.id};
        this.sharedChannel.request(request);

        // MA hide chart context menus
        $("body > .dropdown-menu").hide();

    }

     handleEvent(event:MouseEvent):void {
        if(this.el.nativeElement.contains(event.target)) {
            var menuItem = this.getParentMenuItem(event);
            if(!menuItem){
                // MA click is within the context menu, but not on an item, so just return
                return;
            }
            // MA ignore click for specific classes
            if(menuItem.classList.contains("non-selectable") || menuItem.classList.contains("dropdown-submenu")){
                return;
            }
        }
        this.hideMenu();
    }

    hideMenu() {
        this.renderer.removeClass(this.el.nativeElement, 'open');
        this.isHoveredTooltip ?
            window.document.removeEventListener('mouseover', this.handleEventBind, true) :
            window.document.removeEventListener('click', this.handleEventBind, true);
        this.isShown = false;
    }

     getParentMenuItem = function (event:MouseEvent) {
        let startElement = event.target as HTMLElement;
        let parentElement = startElement as HTMLElement;
        while (parentElement && parentElement != this.el.nativeElement) {
            if (parentElement.classList.contains("menuitem")) {
                return parentElement;
            }
            parentElement = parentElement.parentElement;
        }
        return null;
    };

     onChannelRequest(channelRequest:ChannelRequest) {
        // MA if we are showing a different context menu, hide this one
        if(channelRequest.type == ChannelRequestType.ShowContextMenu) {
            if((<ShowContextMenuRequest>channelRequest).id != this.id) {
                if(this.isShown) {
                    this.hideMenu();
                }
            }
        }
    }

    // MA kill those events, so that NgGrid won't handle them
    @HostListener('mousedown', ['$event'])
     eatMouseDown(event:MouseEvent):boolean {
        if(this.isShown) {
            event.stopPropagation();
        }
        return true;
    }

    // MA kill those events, so that NgGrid won't handle them
    @HostListener('mousemove', ['$event'])
     eatMouseMove(event:MouseEvent):boolean {
        if(this.isShown) {
            event.stopPropagation();
        }
        return true;
    }

}

interface ShowContextMenuRequest extends ChannelRequest {
    id:string
}


