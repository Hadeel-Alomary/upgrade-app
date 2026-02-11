import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '../../config/config';
import {Tc, AppTcTracker, SecurityUtils} from '../../utils/index';
import {Loader, LoaderConfig, LoaderUrlType} from '../loader/index';
import {CredentialsStateService, MiscStateService} from '../state/index';
import {LogoutService, ForceLogoutType} from '../logout/index';
import {AuthorizationService} from '../auhtorization';

@Injectable()
export class GuidService {

    private intervalHandler:number;
    private fuseIntervalHandler:number;
    private fuseOn:boolean = false;

    constructor(private loader:Loader,
                private credentialsService:CredentialsStateService,
                private miscStateService:MiscStateService,
                private http:HttpClient,
                private logoutService:LogoutService,
                private authorizationService:AuthorizationService){ }

    public init() {
        this.loader.getConfigStream().subscribe( config => {
            if(config) {
                this.start(config.guidInterval);
            }
        } );
    }

    onDestroy() {
        if(this.intervalHandler) {
            window.clearInterval(this.intervalHandler);
            window.clearInterval(this.fuseIntervalHandler);
            this.intervalHandler = null;
            this.fuseIntervalHandler = null;
        }
    }

    private start(guidInterval:number) {
        Tc.assert(!isNaN(guidInterval), "invalid guid interval");
        Tc.assert(10000 < guidInterval, "guid interval is less than 10 secs");
        this.intervalHandler = window.setInterval( () => this.checkGuid(), guidInterval);
        this.fuseIntervalHandler = window.setInterval( () => this.checkFuse(), guidInterval * 3);
    }

    private checkGuid() {

        if(!this.authorizationService.isSubscriber()){
            return;
        }

        let config = this.loader.getConfig();
        let baseUrl:string = LoaderConfig.url(config, LoaderUrlType.Guid);

        let url:string = baseUrl + `?guids=${config.guidKey}${this.miscStateService.getGuid()}&` +
            `current_action=PeriodicCheck&user_name=${this.credentialsService.username}` +
            `&version=${Config.getVersion()}&language=ARABIC`;

        url = Tc.url(url);
        return this.http.get(url, {
            responseType: 'text'
        }).subscribe(
            response => this.processResponse(response, url));

    }

    private processResponse(response:string, url:string) {
        this.fuseOn = false;
        if(response.indexOf('OK') == -1) {
            this.logoutService.forceLogout(ForceLogoutType.OtherMachineLoggedIn);
        }else {
            let hashValue = Tc.getParameterByName('h', url);
            if(response.split(' ')[1] != SecurityUtils.hBefore(hashValue)) {
                this.logoutService.forceLogout(ForceLogoutType.FailToConnect)
            }
        }
    }

    private checkFuse() {

        if(!this.authorizationService.isSubscriber()){
            return;
        }

        if(!this.fuseOn) {
            this.fuseOn = true;
            return;
        }
        AppTcTracker.trackUrgentMessage("guid failed");
        // fuse is already On, so guid is not called for long time, raise FailToConnect
        this.logoutService.forceLogout(ForceLogoutType.FailToConnect);
    }

}
