import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../../shared';
import {ChannelRequestType, SharedChannel} from '../../../../services/shared-channel';
import {ChannelRequest, CredentialsStateService, MiscStateService, UserService} from '../../../../services';
import {FormControl, NgForm} from '@angular/forms';
import {AvailableResourceType} from '../../../shared/validators/available-validator.directive';
import {Subscription} from 'rxjs/internal/Subscription';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AppTcTracker} from '../../../../utils';


@Component({
    selector: 'signin',
    templateUrl:'./signin.component.html',
    styleUrls:['./signin.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('showLoginDoneMessage', [
            state('expanded', style({
                height: '150px'
            })),
            state('collapsed',   style({
                height: '0px'
            })),
            transition('collapsed => expanded', animate('500ms linear')),
            transition('expanded => collapsed', animate('500ms linear'))
        ])
    ]
})

export class SigninComponent extends ChannelListener<ChannelRequest> implements OnDestroy {

    @ViewChild(ModalDirective)  signinModal: ModalDirective;
    @ViewChild('signinForm') signinForm: NgForm;

    formFields:SigninFormFields;
    availableResourceType = AvailableResourceType;
    invalidCredentials:boolean = false;
    loginDone:boolean = false;
    requestSigninSubscription:Subscription;
    isFormSubmitting: boolean = false;

    constructor( public sharedChannel:SharedChannel,
                 public userService:UserService,
                 public credentialsStateService:CredentialsStateService,
                 public miscStateService: MiscStateService,
                 public cd:ChangeDetectorRef){
        super(sharedChannel, ChannelRequestType.SignIn);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    protected onChannelRequest(): void {
        this.signinModal.show();
        this.formFields = new SigninFormFields();
        if(this.credentialsStateService.hasUsername()) {
            this.formFields.username = this.credentialsStateService.getUsername();
        }
        this.cd.markForCheck();
    }

    onSubmit(){
        this.updateFormControlsValidation();
        if(this.signinForm.valid && !this.isFormSubmitting) {
            this.isFormSubmitting = true;
            this.invalidCredentials = false;

            let password = this.formFields.password;

            this.requestSigninSubscription = this.userService.authenticate(this.formFields.username, password).subscribe(result => {
                this.isFormSubmitting = false;
                if(result){
                    this.credentialsStateService.login(this.formFields.username, password);
                    this.loginDone = true;
                    AppTcTracker.trackSignin();
                    AppTcTracker.sendNow();
                    window.setTimeout(() => {
                        this.sharedChannel.request({type: ChannelRequestType.Reload});
                    }, 2000);
                } else {
                    this.invalidCredentials = true;
                    this.formFields.password = '';//Reset password field to prevent submitting multiple wrong passwords
                }
                this.cd.markForCheck();
            })
        }
    }

    updateFormControlsValidation(){
        Object.values(this.signinForm.controls).forEach((control:FormControl) => {
            control.markAsTouched();
            control.updateValueAndValidity();
        });
    }

    onHidden() {
        this.formFields = null;
    }

    get showLoginDoneMessage():string {
        return this.loginDone ? 'expanded' : 'collapsed';
    }

    onForgetPassword() {
        this.signinModal.hide();
        this.sharedChannel.request({type: ChannelRequestType.ForgetPassword});
    }

    onCancel() {
        this.formFields = null;
        this.signinModal.hide();
        this.sharedChannel.request({type: ChannelRequestType.SignInOrSignUp});
    }
}

export class SigninFormFields {
    username:string;
    password:string;
}

