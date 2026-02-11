import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../../shared';
import {ChannelRequest, ChannelRequestType, SharedChannel} from '../../../../services/shared-channel';
import {UserService} from '../../../../services/user';
import {LanguageService} from '../../../../services/state';
import {FormControl, NgForm} from '@angular/forms';
import {AppCountry} from '../../../../utils';
import {Subscription} from 'rxjs/internal/Subscription';
import {SendForgetPasswordLoginVerification} from "../../../../services/user/user.service";

@Component({
  selector: 'forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders:[BS_VIEW_PROVIDERS],
  encapsulation: ViewEncapsulation.None
})
export class ForgetPasswordComponent extends ChannelListener<ChannelRequest> implements OnDestroy{
    @ViewChild(ModalDirective) forgetPasswordModal: ModalDirective;
    @ViewChild('mobileNumberForm') mobileNumberForm: NgForm;
    @ViewChild('verificationsForm') verificationsForm: NgForm;
    @ViewChild('changePasswordForm') changePasswordForm: NgForm;

    mobileNumberFormFields: MobileNumberFormFields;
    changePasswordFormFields: ChangePasswordFormFields;

    verificationCode: string;
    resendVerificationCode: boolean = true;
    requestSubscription: Subscription;
    mobileVerificationError: string;

    formSteps = FormSteps;
    currentStep: FormSteps;

    recaptchaResponse?: string;
    isRecaptchaSuccess: boolean = null;
    resetRecaptcha: boolean;

    mobileNotExist: boolean = false;

    constructor( public sharedChannel:SharedChannel, public userService:UserService, public languageService:LanguageService, public cd:ChangeDetectorRef){
        super(sharedChannel, ChannelRequestType.ForgetPassword);
    }

    ngOnDestroy(): void {
        this.onDestroy();
    }

    protected onChannelRequest(): void {
        this.forgetPasswordModal.show();
        this.mobileNumberFormFields = {countryCode: '' , mobile: ''};
        this.changePasswordFormFields = {password: '' , passwordConfirmation: ''};
        this.mobileNumberFormFields.countryCode = AppCountry.getSaudiCountryCode();
        this.currentStep = FormSteps.FILL_MOBILE;
        this.cd.markForCheck();
    }

    public onHidden(): void {
        this.mobileNumberFormFields = null;
        this.changePasswordFormFields = null;
        this.verificationCode = null;
    }

    public onInputMobile() {
        this.mobileNotExist = false;
        this.cd.detectChanges();
    }

    public onClickRetrieveByMobile(): void {
        this.updateFormControlsValidation(this.mobileNumberForm);

        if(!this.mobileNumberForm.valid || !this.isRecaptchaSuccess) {
            return;
        }

        this.requestSubscription = this.userService.sendForgetPasswordLoginVerification(this.serverSideMobile(), this.recaptchaResponse).subscribe((response: SendForgetPasswordLoginVerification) => {
            this.resetRecaptcha = true;
            if(response.success){
                this.currentStep = FormSteps.VERIFY_MOBILE;
            } else {
                this.mobileNotExist = response.mobileNotExists ? response.mobileNotExists : false;
            }
            this.cd.detectChanges();
        });
    }

    public onSubmitVerificationCode(): void {
        this.updateFormControlsValidation(this.verificationsForm);
        if (this.verificationsForm.valid) {
            this.requestSubscription = this.userService.verifyForgetPasswordMobile(this.verificationCode).subscribe((success: boolean) => {
                if (success) {
                    this.currentStep = FormSteps.CHANGE_PASSWORD;
                } else {
                    this.mobileVerificationError = this.languageService.translate('رمز التفعيل غير صحيح. يرجى المحاولة مرة أخرى.');
                    this.cd.markForCheck();
                }
            });
        }
    }

    public onResendVerificationCode(): void {
        this.resendVerificationCode = false;
        this.requestSubscription = this.userService.sendForgetPasswordLoginVerification(this.serverSideMobile(), null).subscribe();
    }

    public resetMobileVerificationError(): void {
        this.mobileVerificationError = null;
    }

    public onChangePassword(): void {
        this.updateFormControlsValidation(this.changePasswordForm);
        if (this.changePasswordForm.valid) {
            this.requestSubscription = this.userService.changePassword(this.changePasswordFormFields.passwordConfirmation).subscribe(() => {
                this.currentStep = FormSteps.SUCCESS_MESSAGE;
            });
        }
    }

    public onPasswordChanged(): void {
        this.forgetPasswordModal.hide();
        this.sharedChannel.request({type: ChannelRequestType.SignIn});
    }

    public getCountries(): AppCountry[] {
        return AppCountry.getCountries();
    }

    public getCountryDropdownName(country: AppCountry): string {
        return country.getCountryNameWithCode(this.languageService.arabic);
    }

    private serverSideMobile() {
        let country: AppCountry = this.getCountries().find(country => country.code == this.mobileNumberFormFields.countryCode);
        return country.code + this.mobileNumberFormFields.mobile;
    }

    public updateFormControlsValidation(form: NgForm): void {
        Object.values(form.controls).forEach((control: FormControl) => {
            control.markAsTouched();
            control.updateValueAndValidity();
        });

        if(!this.isRecaptchaSuccess){
            this.isRecaptchaSuccess = false; //Ehab: show recaptcha validation error message
        }
    }

    onRecaptchaResponse(recaptchaResponse: string) {
        this.recaptchaResponse= recaptchaResponse;
        this.resetRecaptcha = false;
    }

    onRecaptchaSuccess(isRecaptchaSuccess: boolean): void {
        this.isRecaptchaSuccess = isRecaptchaSuccess;
        this.cd.markForCheck();
    }

    onCancel() {
        this.forgetPasswordModal.hide();
        this.sharedChannel.request({type: ChannelRequestType.SignInOrSignUp});
    }
}

interface MobileNumberFormFields {
    countryCode: string;
    mobile: string;
}

interface ChangePasswordFormFields {
    password: string;
    passwordConfirmation: string;
}

enum FormSteps {
    FILL_MOBILE,
    VERIFY_MOBILE,
    CHANGE_PASSWORD,
    SUCCESS_MESSAGE
}
