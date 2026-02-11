import {ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelRequest, ChannelRequestType, SharedChannel} from '../../../services';
import {ChannelListener} from '../shared/channel-listener';

@Component({
    selector: 'unsupported-alert-message',
    templateUrl: './unsupported-alert-message.component.html',
    styleUrls: ['./unsupported-alert-message.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})
export class UnsupportedAlertMessageComponent extends ChannelListener<ChannelRequest> implements OnDestroy {

    @ViewChild(ModalDirective) public UnsupportedAlertMessageModal: ModalDirective;


    constructor(public sharedChannel: SharedChannel) {
        super(sharedChannel, ChannelRequestType.UnsupportedAlertMessage);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    protected onChannelRequest() {
        this.UnsupportedAlertMessageModal.show();
    }

    onClose() {
        this.UnsupportedAlertMessageModal.hide();
    }

}
