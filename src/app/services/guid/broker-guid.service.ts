import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '../../config/config';
import {Tc, AppTcTracker, StringUtils} from '../../utils/index';
import {Loader, LoaderConfig, LoaderUrlType} from '../loader/index';
import {AppModeStateService, MiscStateService} from '../state/index';
import {LogoutService, ForceLogoutType} from '../logout/index';
import {AuthorizationService} from '../auhtorization';

@Injectable()
export class BrokerGuidService {

    readonly k:string = 'QlJPS0VSXzA3XzAzXzIwMjRfU0tfR1VJRA==';

    private intervalHandler:number;
    private fuseIntervalHandler:number;
    private fuseOn:boolean = false;
    private brokerUserId:string = '';

    constructor(private loader:Loader,
                private miscStateService:MiscStateService,
                private http:HttpClient,
                private logoutService:LogoutService,
                private appModeStateService: AppModeStateService,
                private authorizationService:AuthorizationService){ }

    public init() {
        this.loader.getConfigStream().subscribe( (loaderConfig: LoaderConfig) => {
            if(loaderConfig) {
                this.start(loaderConfig.guidInterval);
                this.brokerUserId = LoaderConfig.brokerUser(loaderConfig);
            }
        });
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
        let baseUrl: string = LoaderConfig.url(config, LoaderUrlType.BrokerGuid);
        let broker: string = this.appModeStateService.isDerayahMode() ? 'derayah' : '';

        let url:string = baseUrl + `?username=${this.brokerUserId}` +
            `&guid=${this.miscStateService.getGuid()}` +
            `&type=tickerchart` +
            `&broker=${broker}` +
            `&market=ALL` +
            `&version=${Config.getVersion()}`;

        url = Tc.url(url);
        return this.http.get<BrokerGuidResponse>(url).subscribe(
            response => this.processResponse(response));

    }

    private processResponse(response: BrokerGuidResponse) {
        this.fuseOn = false;
        if(!response.success || response.message != this.secH()) {
            this.logoutService.forceLogout(ForceLogoutType.OtherMachineLoggedIn);
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
        this.logoutService.forceLogout(ForceLogoutType.BrokerModeInvalidSession);
    }

    private secH():string {
        return StringUtils.md5(this.miscStateService.getGuid() + atob(this.k));
    }

}

interface BrokerGuidResponse {
    success: boolean,
    message: string
}
