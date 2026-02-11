import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Tc, AppTcTracker} from '../../../utils';
import {map} from 'rxjs/operators';
import {Loader} from '../loader';
import {TcAuthenticatedHttpClient} from "../../../utils/app.tc-authenticated-http-client.service";

@Injectable()
export class UserLoaderService {

    constructor(private http:HttpClient, private tcAuthenticatedHttpClient: TcAuthenticatedHttpClient,private loader:Loader){}

    public isUsernameTaken(username:string):Observable<boolean> {
        let url:string = 'https://www.tickerchart.com/m/w/users/username/exists?username=' + username;
        return this.tcAuthenticatedHttpClient.getWithAuth(Tc.url(url)).pipe(map((response:ExistsResponse) => response.exists));
    }

    public isEmailTaken(email:string):Observable<boolean> {
        let url:string = 'https://www.tickerchart.com/m/w/users/email/exists?email=' + email;
        return this.tcAuthenticatedHttpClient.getWithAuth(Tc.url(url)).pipe(map((response:ExistsResponse) => response.exists));
    }

    public isMobileTaken(mobile:string):Observable<boolean> {
        let url:string = 'https://www.tickerchart.com/m/w/users/mobile/exists?mobile=' + mobile;
        return this.tcAuthenticatedHttpClient.getWithAuth(Tc.url(url)).pipe(map((response:ExistsResponse) => response.exists));
    }

    public sendMobileVerification(mobile:string, username:string, email:string, captchaResponse: string, isResendCode: boolean): Observable<SendMobileVerificationResponse> {
        let url:string = 'https://www.tickerchart.com/m/w/mobile/signup/send-verification';
        let data = isResendCode ? {"mobile": mobile, "username": username, "email": email, "resend": "1"}: {"mobile": mobile, "username": username, "email": email, "g-recaptcha-response": captchaResponse};
        return this.tcAuthenticatedHttpClient.postWithAuth(Tc.url(url), data).pipe(map((response:GenericResponse) => {
            if(!response.success) {
                AppTcTracker.trackMessage("fail to send mobile verification to number: " + mobile);
            }
            return response;
        }));
    }

    public verifyMobileActivationCode(activationCode:string):Observable<boolean> {
        let url:string = 'https://www.tickerchart.com/m/w/mobile/signup/process-verification';
        let data:{[key: string]: string} = {"activate-code": activationCode};
        return this.tcAuthenticatedHttpClient.postWithAuth(Tc.url(url), data).pipe(map((response:GenericResponse) =>response.success));
    }


    public authenticate(username: string, password: string) {
        let url:string = 'https://www.tickerchart.com/m/w/users/authenticate';
        let data:{[key: string]: string} = {username: username, password: password};
        return this.tcAuthenticatedHttpClient.postWithAuth(Tc.url(url), data).pipe(map((response:GenericResponse) => response.success));
    }

    public createUser(username: string, password: string, email: string, fullName: string, country: string, mobile: string):Observable<boolean> {
        let url:string = 'https://www.tickerchart.com/m/w/user';
        let data:{[key: string]: string} = {username: username, password: password, email: email, "full-name": fullName, country: country, mobile:mobile, referrer:'TickerChartWeb'};
        return this.tcAuthenticatedHttpClient.postWithAuth(Tc.url(url), data).pipe(map((response:GenericResponse) => response.success));
    }

    public sendForgetPasswordLoginVerification(mobile: string, captchaResponse: string): Observable<SendForgetPasswordLoginVerificationResponse> {
        let url: string = 'https://www.tickerchart.com/m/w/mobile/restore/send-login-verification';
        let data = captchaResponse ? {"mobile": mobile, "g-recaptcha-response": captchaResponse} : {"mobile": mobile, "resend": "1"};
        return this.tcAuthenticatedHttpClient.postWithAuth(Tc.url(url) , data).pipe(map((response:GenericResponse) =>{
            return response;
        }));
    }

    public verifyForgetPasswordMobile(activationCode: string): Observable<boolean>{
        let url: string = 'https://www.tickerchart.com/m/w/mobile/restore/process-verification-and-login';
        let data: {[key: string]: string} = {"activate-code": activationCode};
        return this.tcAuthenticatedHttpClient.postWithAuth(Tc.url(url), data).pipe(map((response:GenericResponse) =>response.success));
    }

    public changePassword(newPassword: string): Observable<void> {
        let url: string = 'https://www.tickerchart.com/m/mobile/tickerchart/change-password';
        let data: {[key: string]: string} = {"new-password": newPassword};
        return this.tcAuthenticatedHttpClient.postWithAuth(Tc.url(url) , data).pipe(map((response:GenericResponse) =>{
            if(!response.success) {
                AppTcTracker.trackMessage("fail to change password");
            }
            return null;
        }));
    }

}

interface ExistsResponse {
    success:boolean;
    exists:boolean;
}

export interface GenericResponse {
    success:boolean;
}

export interface SendMobileVerificationResponse extends GenericResponse {
    username_exists?: boolean;
    mobile_exists?: boolean;
    email_exists?: boolean;
}

export interface SendForgetPasswordLoginVerificationResponse extends GenericResponse {
    mobile_not_exists?: boolean;
}
