import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {AppTcTracker} from './app.tc-tracker';
import {CredentialsStateService, LanguageService} from '../services/state';
// import {Tc} from 'tc-web-chart-lib';
import {ChannelRequester, ChannelRequestType, SharedChannel} from '../services/shared-channel';
import {AppModeAuthorizationService, AppModeFeatureType} from '../services/auhtorization/app-mode-authorization';
// import {MessageBoxRequest} from '../components/modals';

@Injectable()
export class TcAuthenticatedHttpClient {
    private token: string;
    constructor(public appModeAuthorizationService: AppModeAuthorizationService, private credentialsService: CredentialsStateService, private http: HttpClient, private languageService:LanguageService, private sharedChannel: SharedChannel) {}

    public setToken (token:string): void {//set by loader from beginning
        this.token = token;
    }

    public getWithAuth(url: string): Observable<Object> {
        return this.http.get(url,this.getTcAuthOptions()).pipe(
            switchMap((response: Object| ErrorResponse) => {
                let isTokenExpired = 'error' in response && (response as ErrorResponse).error === 'invalid-token';
                if (isTokenExpired) {
                    AppTcTracker.trackMessage('Token is expired');

                    this.onDisconnect();
                }
                return of(response);
            }));
    }

    public postWithAuth(url: string, body: Object | string): Observable<Object> {
        return this.http.post(url, body, this.getTcAuthOptions()).pipe(
            switchMap((response: Object| ErrorResponse) => {
                let isTokenExpired = 'error' in response && (response as ErrorResponse).error === 'invalid-token';
                if (isTokenExpired) {
                    AppTcTracker.trackMessage('Token is expired');

                    this.onDisconnect();
                }
                return of(response);
            }));
    }

    private onDisconnect() {
        if(this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.DERAYAH_LOGOUT)) {
            //Ehab: we cannot use logout service due to circular dependency.
            this.sharedChannel.request({type: ChannelRequestType.DerayahModeLogout});
        } else {
            this.showDisconnectModal();
        }
    }

    showDisconnectModal() : void {
        let self = this;
        let messageText:string = this.languageService.translate('لا يمكن الاتصال بالانترنت. يرجى المحاولة لاحقا.');
        // let request: MessageBoxRequest = {
        //     type: ChannelRequestType.MessageBox,
        //     messageLine: messageText,
        //     requester: new class implements ChannelRequester {
        //         onRequestComplete(): void {
        //             self.sharedChannel.request({type:ChannelRequestType.Reload});
        //         }
        //     }
        // };
        // this.sharedChannel.request(request);
    }

    private get(url: string, options?: Object): Observable<Object> {
        return this.http.get(url, options).pipe(map(response => response));
    }

    private post(url: string, body:Object|string, options?: Object): Observable<Object> {
        return this.http.post(url, body, options).pipe(map(response => response));
    }

    private getTcAuthOptions(): Object {
        if(!this.token){
            return {};
        }
        return {
            headers: new HttpHeaders({
                'Authorization': this.token
            })
        }
    }


}

interface ErrorResponse {
    success: boolean;
    error: string;
}
