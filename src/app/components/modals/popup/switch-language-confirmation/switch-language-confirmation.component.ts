import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';

import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';

import {ChannelRequest, ChannelRequestType, LanguageType, SharedChannel,} from '../../../../services/index';

import {ChannelListener} from '../../shared/channel-listener';
import {ConfirmationCaller} from '..';

@Component({
    selector: 'switch-language-confirmation',
    templateUrl:'./switch-language-confirmation.component.html',
    styleUrls:['./switch-language-confirmation.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class SwitchLanguageConfirmationComponent  extends ChannelListener<SwitchLanguageConfirmationRequest> implements OnDestroy {

    shown:boolean = false;

    @ViewChild(ModalDirective) public switchLanguageConfirmationModal: ModalDirective;

    constructor(public sharedChannel:SharedChannel,  public cd:ChangeDetectorRef){
        super(sharedChannel, ChannelRequestType.SwitchLanguageConfirmation);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel requests */

    protected onChannelRequest() {
        this.shown = true;
        this.switchLanguageConfirmationModal.show();
        this.cd.markForCheck();
    }

    /* template events */

    onSelection(confirmed:boolean){
        this.shown = false;
        this.channelRequest.caller.onConfirmation(confirmed, null);
        this.switchLanguageConfirmationModal.hide();
    }

    get title():string {
        return this.channelRequest.language == LanguageType.Arabic ? "تغيير اللغة إلى العربية" : "Change language to English";
    }

    get messageLine():string {
        return this.channelRequest.language == LanguageType.Arabic ? "هل ترغب في تغيير اللغة إلى العربية؟" : "Do you want to change the application language to English?";
    }

    get confirmYes():string {
        return this.channelRequest.language == LanguageType.Arabic ? "نعم" : "Yes";
    }

    get confirmNo():string {
        return this.channelRequest.language == LanguageType.Arabic ? "لا" : "No";
    }

    get languageClass():string {
        return this.channelRequest.language == LanguageType.Arabic ? "arabic" : "english";
    }



}

export interface SwitchLanguageConfirmationRequest extends ChannelRequest {
    caller: ConfirmationCaller,
    language:LanguageType
}





