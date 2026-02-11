import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserLoaderService} from '../loader/user';
import {HttpHeaders} from '@angular/common/http';
import {GenericResponse, SendForgetPasswordLoginVerificationResponse, SendMobileVerificationResponse} from '../loader/user/user-loader.service';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

    private _visitorSignInModalShown: boolean = false;
    constructor(private userLoader:UserLoaderService) {}

    public isUsernameTaken(username:string):Observable<boolean> {
        return this.userLoader.isUsernameTaken(username);
    }

    public isEmailTaken(email:string):Observable<boolean> {
        return this.userLoader.isEmailTaken(email);
    }

    public isMobileTaken(mobile:string):Observable<boolean> {
        return this.userLoader.isMobileTaken(mobile);
    }

    public sendMobileVerification(mobile:string, username:string, email:string, captchaResponse: string, isResendCode: boolean):Observable<SendMobileVerification> {
        return this.userLoader.sendMobileVerification(mobile, username, email, captchaResponse, isResendCode).pipe(map((response: SendMobileVerificationResponse) => {
            return {
                success: response.success,
                usernameExists: response.username_exists,
                mobileExists: response.mobile_exists,
                emailExists: response.email_exists
            }
        }));
    }

    public sendForgetPasswordLoginVerification(mobile: string, captchaResponse: string):Observable<SendForgetPasswordLoginVerification>{
        return this.userLoader.sendForgetPasswordLoginVerification(mobile, captchaResponse).pipe(map((response: SendForgetPasswordLoginVerificationResponse) => {
            return {
                success: response.success,
                mobileNotExists: response.mobile_not_exists
            }
        }));
    }

    public verifyForgetPasswordMobile(code: string):Observable<boolean>{
        return this.userLoader.verifyForgetPasswordMobile(code);
    }

    public changePassword(newPassword: string):Observable<void>{
        return this.userLoader.changePassword(newPassword);
    }

    public verifyMobileActivationCode(code:string):Observable<boolean> {
        return this.userLoader.verifyMobileActivationCode(code);
    }

    public authenticate(username:string, password:string):Observable<boolean> {
        return this.userLoader.authenticate(username, password);
    }

    public createUser(username:string, password:string, email:string, fullName:string, country:string, mobile:string):Observable<boolean> {
        return this.userLoader.createUser(username, password, email, fullName, country, mobile);
    }


    public getVisitorSignInModalShown() {
        return this._visitorSignInModalShown;
    }
    public setVisitorSignInModalShown(value: boolean) {
        this._visitorSignInModalShown = value;
    }
}

export interface SendMobileVerification extends GenericResponse {
    usernameExists?: boolean;
    mobileExists?: boolean;
    emailExists?: boolean;
}

export interface SendForgetPasswordLoginVerification extends GenericResponse {
    mobileNotExists?: boolean;
}
