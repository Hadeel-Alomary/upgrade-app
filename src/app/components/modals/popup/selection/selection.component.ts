import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    ViewChild,
    ChangeDetectorRef,
    OnDestroy
} from "@angular/core";

import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';

import {
    SharedChannel,
    ChannelRequest,
    ChannelRequestType,
} from '../../../../services/index';

import {ChannelListener} from '../../shared/channel-listener';

@Component({
    selector: 'selection',    
    templateUrl:'./selection.component.html',
    styleUrls:['./selection.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class SelectionComponent  extends ChannelListener<SelectionRequest> implements OnDestroy {
        
    @ViewChild(ModalDirective) public selectionModal: ModalDirective;

     title:string;
     entries:string[];
     cssClass:string;
    
    constructor(public sharedChannel:SharedChannel,  public cd:ChangeDetectorRef){
        super(sharedChannel, ChannelRequestType.Selection);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel requests */
    
    protected onChannelRequest() {
        this.title = this.channelRequest.title;
        this.entries = this.channelRequest.entries;
        this.cssClass = this.channelRequest.cssClass;
        this.selectionModal.show();
        this.cd.markForCheck();
    }

    /* template events */
    
     onSelection(selected:string){
        this.channelRequest.caller.onSelection(selected);
        this.selectionModal.hide();
    }    
    
}

export interface SelectionRequest extends ChannelRequest {
    caller: SelectionCaller,
    title:string,
    entries:string[],
    cssClass:string
}

export interface SelectionCaller {
    onSelection(selected:string):void;
}



