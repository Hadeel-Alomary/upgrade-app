import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    OnDestroy
} from "@angular/core";

import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';

import {
    SharedChannel,
    ChannelRequest,
    ChannelRequestType,
    Page
} from '../../../services/index';

import {ChannelListener} from '../shared/channel-listener';

@Component({
    selector: 'page-title',    
    templateUrl:'./page-title.component.html',
    styleUrls:['./page-title.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class PageTitleComponent extends ChannelListener<PageTitleRequest> implements OnDestroy {
    
     title:string;
    
    @ViewChild(ModalDirective) public newModal: ModalDirective;
    
    constructor( public el:ElementRef, public sharedChannel:SharedChannel){
        super(sharedChannel, ChannelRequestType.PageTitle);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel requests */
    
    protected onChannelRequest() {
        this.title = this.channelRequest.page.title;
        this.newModal.show();
    }


    /* template events */
    
     onShown() {
        let input:HTMLInputElement = this.el.nativeElement.getElementsByTagName("input")[0];
        // MA timeout was need for "select" to work
        window.setTimeout(() => {
            input.select();
            input.focus();
        }, 0);
    }

    
     onSubmit() {
        // MA TODO Why we have this if condition? Can we submit an empty title (copied from NewWatchlist?)
        if(this.title) {
            this.channelRequest.page.title = this.title;
            this.channelRequest.caller.onPageTitleChanged();
        }        
        this.newModal.hide();
    }

    
}

export interface PageTitleRequest extends ChannelRequest {
    caller: PageTitleCaller,
    page: Page
}

export interface PageTitleCaller {
    onPageTitleChanged():void;
}
