import {Injectable} from '@angular/core';
import {SharedChannel, ChannelRequest, ChannelRequestType} from '../shared-channel/index';
import {AppTcTracker} from '../../utils/index';
import {ForceLogoutType} from "./force-logout-type";
import {Observable} from 'rxjs';
import {AppModeAuthorizationService} from '../auhtorization';
import {AppModeFeatureType} from '../auhtorization/app-mode-authorization';

@Injectable()
export class LogoutService {

    private onReloadFn: () => Observable<boolean>;

    constructor(private sharedChannel:SharedChannel,private appModeAuthorizationService:AppModeAuthorizationService){}

    public forceLogout(forceLogoutType:ForceLogoutType) {
        if(this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.DERAYAH_LOGOUT)){
            let request: ChannelRequest = {type: ChannelRequestType.DerayahModeLogout};
            this.sharedChannel.request(request);
        } else {
            let request:ForceLogoutRequest = {type: ChannelRequestType.ForceLogout, forceLogoutType:forceLogoutType};
            AppTcTracker.trackForceLogout(forceLogoutType);
            this.sharedChannel.request(request);
        }
    }

    public registerOnReloadFn(fn:() => Observable<boolean>) {
        this.onReloadFn = fn;
    }

    public reload() {
        // MA onReloadFn is used for workspace to save its state before reloading the page.
        if(this.onReloadFn) {
            this.onReloadFn().subscribe(() => {
                window.location.reload();
            })
        } else {
            window.location.reload();
        }
    }
}


export interface ForceLogoutRequest extends ChannelRequest {
    forceLogoutType:ForceLogoutType
}
