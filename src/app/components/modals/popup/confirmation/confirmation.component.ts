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
    selector: 'confirmation',
    templateUrl:'./confirmation.component.html',
    styleUrls:['./confirmation.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class ConfirmationComponent  extends ChannelListener<ConfirmationRequest> implements OnDestroy {

    @ViewChild(ModalDirective) public confirmationModal: ModalDirective;

     messageLine:string;
     messageLine2:string;
     messageLine3:string;

    constructor(public sharedChannel:SharedChannel,  public cd:ChangeDetectorRef){
        super(sharedChannel, ChannelRequestType.Confirmation);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel requests */

    protected onChannelRequest() {
        this.messageLine = this.channelRequest.messageLine;
        this.messageLine2 = this.channelRequest.messageLine2;
        this.messageLine3 = this.channelRequest.messageLine3;
        this.confirmationModal.show();
        this.cd.markForCheck();
    }

    /* template events */

     onSelection(confirmed:boolean){
        this.channelRequest.caller.onConfirmation(confirmed, this.channelRequest.param);
        this.confirmationModal.hide();
    }

}

export interface ConfirmationRequest extends ChannelRequest {
    caller: ConfirmationCaller,
    messageLine: string,
    messageLine2?:string,
    messageLine3?:string,
    param?: unknown
}

export interface ConfirmationCaller {
    onConfirmation(confirmed:boolean, param:unknown):void;
}



