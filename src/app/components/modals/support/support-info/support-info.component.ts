import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {ChannelListener} from '../../shared/channel-listener';
import {ChannelRequest, ChannelRequestType, ContactUsConfig, Loader, SharedChannel, UserInfo} from '../../../../services';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'support-info',
    templateUrl: './support-info.component.html',
    styleUrls: ['./support-info.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})
export class SupportInfoComponent extends ChannelListener<ChannelRequest> implements OnDestroy {

    userInfo:UserInfo;
    contactUs:ContactUsConfig;
    @ViewChild(ModalDirective) public SupportInfoModal: ModalDirective;

    constructor(public sharedChannel:SharedChannel,
                public cd:ChangeDetectorRef,
                public loader:Loader) {
        super(sharedChannel, ChannelRequestType.SupportInfo);
    }

    protected onChannelRequest(): void {
        this.userInfo = this.loader.getUserInfo();
        this.contactUs = this.loader.getConfig().contactUs;
        this.SupportInfoModal.show();
        this.cd.markForCheck();
    }

    get workingDays():string {
        return this.contactUs.fromDay +' - '+ this.contactUs.toDay;
    }

    get workingHours():string {
        return this.contactUs.fromTime +' - '+ this.contactUs.toTime;
    }

    get insideSaudiNumber():string {
        return this.contactUs.insideSaudiNumber;
    }

    get outsideSaudiNumber():string {
        return this.contactUs.outsideSaudiNumber;
    }

    get whatsAppNumber():string {
        return this.contactUs.whatsAppNumber;
    }

    openContactUsModal() {
        this.hideMe();
        this.sharedChannel.request({type: ChannelRequestType.ContactUs});
    }

    openChatOnWhatsAppPage() {
        let whatsAppNumberWithoutSpace = this.whatsAppNumber.replace(/\s/g, "");
        let numberWithoutDash = whatsAppNumberWithoutSpace.replace("-","");
        numberWithoutDash = numberWithoutDash.replace("00966","966"); // on mobile whatapp through unfound number error message

        let chatOnWhatsAppUrl = `https://api.whatsapp.com/send?phone=${numberWithoutDash}`;
        window.open(chatOnWhatsAppUrl);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    hideMe() {
        this.SupportInfoModal.hide()
    }

}
