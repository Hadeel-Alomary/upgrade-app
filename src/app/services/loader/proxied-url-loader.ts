import {Tc} from '../../utils';
import {ProxyService} from './loader/proxy.service';

export abstract class ProxiedUrlLoader {

    constructor(private baseProxyService: ProxyService) {
    }

    protected getProxyAppliedUrl(url: string): string {
        let proxyServerUrl = this.baseProxyService.getProxyServerUrl();
        let dataUrl = Tc.url(url);
        return proxyServerUrl.length == 0 ? dataUrl : proxyServerUrl + encodeURIComponent(dataUrl);
    }
}
