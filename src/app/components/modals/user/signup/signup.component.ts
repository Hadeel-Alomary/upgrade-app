import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../../shared';
import {ChannelRequestType, SharedChannel} from '../../../../services/shared-channel';
import {ChannelRequest, CredentialsStateService, LanguageService, TradingService, UserService} from '../../../../services';
import {AppCountry, AppTcTracker} from '../../../../utils';
import {FormControl, NgForm} from '@angular/forms';
import {AvailableResourceType} from '../../../shared/validators/available-validator.directive';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageBoxRequest} from '../../popup/message-box';
import {SendMobileVerification} from '../../../../services/user/user.service';

@Component({
    selector: 'signup',
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class SignupComponent extends ChannelListener<ChannelRequest> implements OnDestroy {

    @ViewChild(ModalDirective)  signupModal: ModalDirective;
    @ViewChild('signupForm') signupForm: NgForm;
    @ViewChild('activationForm') activationForm: NgForm;

    formFields:SignupFormFields;
    availableResourceType = AvailableResourceType;
    resendCodeOption:boolean = true;
    requestSubscription:Subscription;
    mobileActivationCode:string;
    mobileVerificationError:string;

    formSteps = FormSteps;
    currentStep:FormSteps;
    recaptchaResponse?: string;
    isRecaptchaSuccess: boolean = null;

    resetRecaptcha: boolean;

    public usernameExists: boolean = false;
    public emailExists: boolean = false;
    public mobileExists: boolean = false;

    constructor( public sharedChannel:SharedChannel,
                 public tradingService:TradingService,
                 public userService:UserService,
                 public languageService:LanguageService,
                 public credentialsStateService:CredentialsStateService,
                 public cd:ChangeDetectorRef){
        super(sharedChannel, ChannelRequestType.SignUp);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    protected onChannelRequest(): void {
        this.signupModal.show();
        this.formFields = new SignupFormFields();
        this.formFields.countryCode = AppCountry.getSaudiCountryCode();
        this.currentStep = FormSteps.FILL_DETAILS;
        this.cd.markForCheck();
    }

    public onInputUsername() {
        this.usernameExists = false;
    }

    public onInputEmail() {
        this.emailExists = false;
    }

    public onInputMobile() {
        this.mobileExists = false;
    }

    onSubmit(){
        // redo validation for the form
        this.updateFormControlsValidation(this.signupForm);

        if(!this.signupForm.valid || !this.isRecaptchaSuccess) {
            return; // form not valid
        }
        this.requestSubscription = this.userService.sendMobileVerification(this.serverSideMobile(), this.formFields.username, this.formFields.email, this.recaptchaResponse, false).subscribe((response: SendMobileVerification) => {
            if(response.success){
                this.currentStep = FormSteps.VERIFY_MOBILE;
            } else {
                this.usernameExists = response.usernameExists? response.usernameExists : false;
                this.emailExists = response.emailExists? response.emailExists : false;
                this.mobileExists = response.mobileExists? response.mobileExists : false;
            }
            this.cd.markForCheck();
        });
        this.resetRecaptcha = true;
    }

    updateFormControlsValidation(form:NgForm){
        Object.values(form.controls).forEach((control:FormControl) => {
            control.markAsTouched();
            control.updateValueAndValidity();
        });

        if(!this.isRecaptchaSuccess){
            this.isRecaptchaSuccess = false; //Ehab: show recaptcha validation error message
        }
    }

    onHidden() {
        this.formFields = null;
        this.cd.markForCheck();
    }

    resendVerificationCode() {
        this.requestSubscription = this.userService.sendMobileVerification(this.serverSideMobile(), this.formFields.username, this.formFields.email, null, true).subscribe(() => {
            this.resendCodeOption = false;
        });
    }

    get countries():AppCountry[]{
        return AppCountry.getCountries();
    }

    getCountryDropdownName(country:AppCountry):string {
        return country.getCountryNameWithCode(this.languageService.arabic);
    }

    onActivationCodeSubmit() {
        this.updateFormControlsValidation(this.activationForm);
        if(this.activationForm.valid) {
            this.requestSubscription = this.userService.verifyMobileActivationCode(this.mobileActivationCode).subscribe((success) => {
                if(success) {
                    let country:AppCountry = this.countries.find(country => country.code == this.formFields.countryCode);
                    this.requestSubscription = this.userService.createUser(this.formFields.username, this.formFields.password,
                        this.formFields.email, this.formFields.name, country.english, this.serverSideMobile()).subscribe(success => {
                        if(success) {
                            this.onSuccessfulSignup();
                        } else {
                            this.errorOnSignup();
                        }
                    });
                } else {
                    this.mobileVerificationError = 'رمز التفعيل غير صحيح. يرجى المحاولة مرة أخرى.';
                    window.setTimeout(() => {
                        this.cd.markForCheck();
                    }, 0);

                }
            });
        }
    }

    getMobileWithCountryCode():string {
        let country:AppCountry = this.countries.find(country => country.code == this.formFields.countryCode);
        return country.code !== '+' ? country.code + "-" + this.formFields.mobile : "+" + this.formFields.mobile;
    }

    private serverSideMobile() {
        let country:AppCountry = this.countries.find(country => country.code == this.formFields.countryCode);
        return country.code + this.formFields.mobile;
    }


    private onSuccessfulSignup() {
        this.currentStep = FormSteps.SUCCESS_MESSAGE;
        this.credentialsStateService.login(this.formFields.username, this.formFields.password);
        AppTcTracker.trackSignup();
        AppTcTracker.sendNow();
        window.setTimeout(() => {
            this.sharedChannel.request({type: ChannelRequestType.Reload});
        }, 2000);
    }

    private errorOnSignup() {
        AppTcTracker.reportCriticalError('Fail to Create User', 'Fail to create user for: ' + this.formFields.toString());
        this.signupModal.hide();
        let messageBoxRequest: MessageBoxRequest = {
            type: ChannelRequestType.MessageBox,
            messageLine: 'لقد حدث خطأ في عملية التسجيل',
            messageLine2: 'الرجاء التواصل مع الدعم الفني لبرنامج تكرتشارت لتسجيل في الموقع'
        };
        this.sharedChannel.request(messageBoxRequest);
    }

    editMobile():void {
        this.currentStep = FormSteps.FILL_DETAILS;
        this.cd.markForCheck();
    }

    resetMobileVerificationError():void {
        this.mobileVerificationError = null;
    }

    onRecaptchaResponse(recaptchaResponse: string): void{
        this.recaptchaResponse = recaptchaResponse;
        this.resetRecaptcha = false;
    }

    onRecaptchaSuccess(isRecaptchaSuccess: boolean): void {
        this.isRecaptchaSuccess = isRecaptchaSuccess;
        this.cd.markForCheck();
    }

    public onCancel() {
        this.signupForm = null;
        this.signupModal.hide();
        this.sharedChannel.request({type: ChannelRequestType.SignInOrSignUp});
    }
}

export class SignupFormFields {
    username:string;
    name:string;
    password:string;
    passwordConfirmation:string;
    email:string;
    countryCode:string;
    mobile:string;

    toString():string {
        return `user: ${this.name} - username: ${this.username} - email: ${this.email} - countryCode: ${this.countryCode} - mobile: ${this.mobile}`;
    }

}

enum FormSteps {
    FILL_DETAILS,
    VERIFY_MOBILE,
    SUCCESS_MESSAGE
}

