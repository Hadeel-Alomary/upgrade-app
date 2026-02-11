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
    ChannelRequestType, ActionableChannelRequest, LanguageService, AppModeAuthorizationService,
} from '../../../../services/index';

import {ChannelListener} from '../../shared/channel-listener';
import {AppModeFeatureType} from '../../../../services/auhtorization/app-mode-authorization';

@Component({
    selector: 'message-box',
    templateUrl:'./message-box.component.html',
    styleUrls:['./message-box.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class MessageBoxComponent  extends ChannelListener<MessageBoxRequest> implements OnDestroy {

    @ViewChild(ModalDirective) public messageBoxModal: ModalDirective;

     messageTitle: string;
     messageLine:string;
     messageLine2:string;
     hideCloseBtn: boolean;
     showSuccessIcon: boolean;

    appModeFeatureType = AppModeFeatureType

    constructor(public sharedChannel:SharedChannel,  public cd:ChangeDetectorRef, public languageService: LanguageService, public appModeAuthorizationService: AppModeAuthorizationService){
        super(sharedChannel, ChannelRequestType.MessageBox);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel requests */

    protected onChannelRequest() {
        this.messageLine = this.channelRequest.messageLine;
        this.messageLine2 = this.channelRequest.messageLine2;
        let autoHideTimer = this.channelRequest.autoHideTimer;
        this.messageTitle = this.channelRequest.messageTitle;
        this.hideCloseBtn = this.channelRequest.hideCloseBtn ? this.channelRequest.hideCloseBtn: false;
        this.showSuccessIcon = this.channelRequest.showSuccessIcon == true;
        this.messageBoxModal.show();
        if(autoHideTimer > 0){
            setTimeout(()=>{
                this.onClose();
                }, autoHideTimer * 1000);// time will be provided in seconds.
        }



        this.cd.markForCheck();
    }

    public getMessageTitle() {
        let title = !this.appModeAllowedFeature(AppModeFeatureType.MESSAGE_FROM_TICKERCHART) ? 'تنبيه' : 'رسالة من تكرتشارت';
        return this.languageService.translate(title);
    }

    onClose() {
        this.messageBoxModal.hide();
        if(this.channelRequest.requester) {
            this.channelRequest.requester.onRequestComplete();
        }
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

}

export interface MessageBoxRequest extends ActionableChannelRequest {
    messageTitle?: string,
    messageLine: string,
    messageLine2?: string,
    autoHideTimer?: number,
    hideCloseBtn?: boolean
    showSuccessIcon?: boolean
}




