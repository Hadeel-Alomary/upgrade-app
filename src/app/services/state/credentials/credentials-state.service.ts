import {Injectable} from '@angular/core';
import {StringUtils} from '../../../utils';

@Injectable()
export class CredentialsStateService {

    private static STORAGE_KEY:string = "TC_AUTH";
    private storageData:{[key:string]: string};

    constructor() {
        if(localStorage.getItem(CredentialsStateService.STORAGE_KEY)) {
            this.storageData = JSON.parse(localStorage.getItem(CredentialsStateService.STORAGE_KEY));
        } else {
            this.storageData = {};
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////
    // MA first method is the original one used everywhere, which returns username only if logged in.
    // However, for sign-in form, we need to have username (even if the user is not logged in), and
    // this is why I introduced the second method getUsername that doesn't do this check.
    get username():string {
        return this.isLoggedIn() ? this.getUsername() : '';
    }
    getUsername():string {
        // MT: some user names contains a trailing space (even though we prevent it on login), we detected that when the cache server failed to parse the url
        // therefore, trim the username before returning it.
        return this.storageData['username'].trim();
    }
    ///////////////////////////////////////////////////////////////////////////////////

    get password():string {
        return this.isLoggedIn() ? this.storageData['password'] : '';
    }

    get trackingId():string {
        // MA trackingId is username unless the user is a visitor, for which we are using a guid per visitor
        // that we store in TC_AUTH
        if(!("visitor-id" in this.storageData)) {
            this.storageData["visitor-id"] = StringUtils.guid();
            this.write();
        }
        return this.isLoggedIn() ? this.storageData['username'] : this.storageData["visitor-id"];
    }

    isLoggedIn():boolean {
        return this.hasUsername() && this.hasPassword();
    }

    login(username:string, password:string) {
         // MA this could be written based on AuthorizationService (adding SAVE_LOGIN_FEATURE). However, I didn't do that in order to
        // keep such a low-level service decoupled from higher services, specially that AuthorizationService already depends on it.
        if(username !== '') {
            this.storageData = {username: username, password: password};
            this.write();
        }
    }

    logout() {
        this.storageData = {};
        this.write();
    }

    clearPassword() {
        if('password' in this.storageData) {
            delete this.storageData.password;
            this.write();
        }
    }

    hasUsername():boolean {
        return ('username' in this.storageData) && this.storageData['username'] && (0 < this.storageData['username'].length);
    }

    public getToken():string {
        return this.storageData["token"];
    }

    public setToken(token:string):void {
        this.storageData["token"] = token;
        this.write();
    }

    private hasPassword():boolean {
        return ('password' in this.storageData);
    }

    private write(){
        localStorage[CredentialsStateService.STORAGE_KEY] = JSON.stringify(this.storageData);
    }
}
