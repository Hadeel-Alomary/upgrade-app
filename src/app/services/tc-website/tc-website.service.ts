import {Injectable} from '@angular/core';
import {LoaderConfig, LoaderUrlType} from '../loader/loader/loader-config';
import {Loader} from '../loader/loader/loader.service';
import {Tc} from '../../utils';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {TcAuthenticatedHttpClient} from '../../utils/app.tc-authenticated-http-client.service';

@Injectable()
export class TcWebsiteService {
    private tokenGeneratorUrl: string;
    private redirectUrl: string;

    constructor(public loader: Loader, private tcHttpClient: TcAuthenticatedHttpClient) {
        this.loader.getConfigStream()
            .subscribe((loaderConfig: LoaderConfig) => {
                if (loaderConfig) {
                    this.onLoaderConfig(loaderConfig);
                }
            });
    }

    private onLoaderConfig(loaderConfig: LoaderConfig) {
        this.tokenGeneratorUrl = LoaderConfig.url(loaderConfig, LoaderUrlType.TcWebsiteTokenGenerator);
        this.redirectUrl = LoaderConfig.url(loaderConfig, LoaderUrlType.TcWebsiteRedirect);
    }

    public openUrl(websiteUrl: string) : Subscription {
        return this.tcHttpClient.postWithAuth(this.tokenGeneratorUrl, {})
            .pipe(map((response: TokenResponse) => {
                Tc.assert(response.success, 'failed to get redirect token');

                let token: string = response.response.token;
                let redirectUrl: string = this.redirectUrl.replace('{0}', token).replace('{1}', encodeURIComponent(websiteUrl));
                window.open(redirectUrl);
            }
        )).subscribe();
    }
}

interface TokenResponse {
    success: boolean;
    response: {
        token: string
    }
}
