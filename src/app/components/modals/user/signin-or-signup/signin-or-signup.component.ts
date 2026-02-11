import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../../shared';
import {ChannelRequestType, SharedChannel} from '../../../../services/shared-channel';
import {AuthorizationService, ChannelRequest, Loader, Streamer, TradingService, UserService} from '../../../../services';


@Component({
    selector: 'signin-or-signup',
    templateUrl:'./signin-or-signup.component.html',
    styleUrls:['./signin-or-signup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class SigninOrSignupComponent extends ChannelListener<ChannelRequest> implements OnDestroy {

    @ViewChild(ModalDirective)  signinOrSignupModal: ModalDirective;

    constructor(public sharedChannel:SharedChannel, public tradingService:TradingService, public cd:ChangeDetectorRef, private loader: Loader, public authorizationService: AuthorizationService, public streamer: Streamer, public userService: UserService) {
        super(sharedChannel, ChannelRequestType.SignInOrSignUp);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    protected onChannelRequest(): void {
        this.loader.initVisitorToken();
        this.signinOrSignupModal.show();
        this.streamer.onDestroy();
        this.userService.setVisitorSignInModalShown(true);
        this.cd.markForCheck();
    }

    onSignInSelection():void {
        this.signinOrSignupModal.hide();
        this.sharedChannel.request({type: ChannelRequestType.SignIn});

    }

    onSignUpSelection():void {
        this.signinOrSignupModal.hide();
        this.sharedChannel.request({type: ChannelRequestType.SignUp});
    }

    public isVisitor() {
        return this.authorizationService.isVisitor();
    }


}


