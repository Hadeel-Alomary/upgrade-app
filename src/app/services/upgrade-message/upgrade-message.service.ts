import {Injectable} from '@angular/core';
import {UpgradeMessageLoaderService} from '../loader/index';

@Injectable()
export class UpgradeMessageService {

    constructor(private upgradeMessageLoaderService: UpgradeMessageLoaderService) {
    }

    public openSubscriptionUpgradeUrl() {
        this.upgradeMessageLoaderService.openSubscriptionUpgradeUrl();
    }
}
