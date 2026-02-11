import {Injectable} from '@angular/core';
import {ProxiedUrlLoader} from '../proxied-url-loader';
import {ProxyService} from '../loader/proxy.service';
import {Loader, LoaderConfig, LoaderUrlType} from '../loader';
import {CredentialsStateService} from '../../state/credentials/credentials-state.service';
import {TcWebsiteService} from '../../tc-website';

@Injectable()
export class UpgradeMessageLoaderService extends ProxiedUrlLoader {

    constructor(private proxyService: ProxyService, private loader: Loader ,
                public credentialsService:CredentialsStateService,
                private tcWebsiteLinksService: TcWebsiteService) {
        super(proxyService);
    }

    public openSubscriptionUpgradeUrl() {
        let url = LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.TcWebsiteSubscribe);

        this.tcWebsiteLinksService.openUrl(url);
    }


}
