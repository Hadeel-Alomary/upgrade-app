import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';
import {AppModeAuthorizationService, ChannelRequest, ChannelRequestType, LanguageService, MiscStateService, SharedChannel} from '../../../../services/index';
import {ChannelListener} from '../../shared/channel-listener';
import {AppModeFeatureType} from '../../../../services/auhtorization/app-mode-authorization';

@Component({
    selector: 'optional-message-box',
    templateUrl:'./optional-message-box.component.html',
    styleUrls:['./optional-message-box.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class OptionalMessageBoxComponent extends ChannelListener<OptionalMessageBoxRequest> implements OnDestroy {

    @ViewChild(ModalDirective) public optionalMessageBoxModal: ModalDirective;

     messageLine:string;
     messageLine2:string;
     hideMessage:boolean = false;

    constructor(public sharedChannel:SharedChannel,  public cd:ChangeDetectorRef, public languageService: LanguageService,  public miscStateService:MiscStateService, public appModeAuthorizationService: AppModeAuthorizationService){
        super(sharedChannel, ChannelRequestType.OptionalMessageBox);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel requests */

    protected onChannelRequest() {
        if(this.miscStateService.isMessageHidden(this.channelRequest.messageId)){
            return;
        }
        this.messageLine = this.channelRequest.messageLine;
        this.messageLine2 = this.channelRequest.messageLine2;
        this.optionalMessageBoxModal.show();
        this.hideMessage = false;
        this.cd.markForCheck();
    }

    public getMessageTitle() {
        let title = this.appModeAllowedFeature(AppModeFeatureType.MESSAGE_FROM_TICKERCHART) ? 'رسالة من تكرتشارت' : 'تنبيه' ;

        return this.languageService.translate(title);
    }

    /* template helpers */

     get confirmation():boolean {
        if(this.channelRequest) {
            return this.channelRequest.messageType == OptionalMessageType.Confirmation;
        }
        return false;
    }

    /* interactive events */

     onClose() {
        if(this.hideMessage) {
            this.miscStateService.hideMessage(this.channelRequest.messageId);
        }
        this.optionalMessageBoxModal.hide();
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

}

export interface OptionalMessageBoxRequest extends ChannelRequest {
    messageLine: string,
    messageLine2?:string,
    messageId:string,
    messageType:OptionalMessageType
}

// MA To have different icons used in message, add here different types
export enum OptionalMessageType {
    Confirmation = 1
}



