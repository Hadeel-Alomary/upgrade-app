import {Component, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';
import {SharedChannel, ChannelRequest, ChannelRequestType, Loader, UserInfo, CredentialsStateService} from '../../../services/index';
import {ChannelListener} from '../shared/channel-listener';
import {Tc, AppTcTracker} from '../../../utils/index';
import {MessageBoxRequest} from '../popup/index';
import { Subscription } from "rxjs";

@Component({
    selector: 'contact-us',
    templateUrl:'./contact-us.component.html',
    styleUrls:['./contact-us.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class ContactUsComponent  extends ChannelListener<ChannelRequest> implements OnDestroy {

    @ViewChild(ModalDirective) public contactUsModal: ModalDirective;

     userInfo:UserInfo;
     supportMessage:SupportMessage;
    requestContactUsSubscription: Subscription;
    isFormSubmitting: boolean = false;
    constructor( public sharedChannel:SharedChannel,
                 public cd:ChangeDetectorRef,
                 public loader:Loader,
                 public http:HttpClient,
                 public credentialsService:CredentialsStateService){

        super(sharedChannel, ChannelRequestType.ContactUs);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel requests */

    protected onChannelRequest() {
        this.userInfo = this.loader.getUserInfo();
        this.initState();
        this.contactUsModal.show();
        this.cd.markForCheck();
    }

     initState() {
        this.supportMessage = {
            username: this.credentialsService.username,
            name: this.userInfo.name,
            email: this.userInfo.email,
            mobile: this.userInfo.phone,
            message: '',
            product:'liveweb'
        };
    }

    /* interactive events */
    onSubmit() {
        if (!this.isFormSubmitting) {
            this.isFormSubmitting = true;
            let body = JSON.stringify(this.supportMessage);
            let url: string = `https://tickerchart.com/m/tickerchart/contact-us`;
            AppTcTracker.trackContactUs();
            this.requestContactUsSubscription = this.http.post(Tc.url(url), body, {
                headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).subscribe(
                (result: ContactUsResponse) => {
                    this.contactUsModal.hide();
                    this.isFormSubmitting = false;
                    if (result.success) {
                        let line1: string = 'لقد تم استقبال رسالتك';
                        let line2: string = 'سيتواصل معك فريق الدعم الفني في أسرع وقت ممكن';
                        let messageBoxRequest: MessageBoxRequest = {
                            type: ChannelRequestType.MessageBox,
                            messageLine: line1,
                            messageLine2: line2
                        };
                        this.sharedChannel.request(messageBoxRequest);
                    } else {
                        alert("لم يتم ارسال الرسالة، الرجاء الاتصال بالدعم الفني");
                    }
                });
        }
    }

}

interface SupportMessage {
    name:string;
    email:string;
    mobile:string;
    message:string;
    username:string;
    product:string;
}

export interface ContactUsResponse {
    success: boolean
}
