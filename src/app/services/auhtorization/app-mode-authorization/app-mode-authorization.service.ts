import {AppModeAccessType, AppModeFeature, AppModeFeatureType} from './app-mode-feature';
import {Injectable} from '@angular/core';
import {AppModeStateService} from '../../state/app-mode/app-mode-state.service';

@Injectable()
export class AppModeAuthorizationService {

    constructor(private appModeStateService:AppModeStateService) {}

    private getAppModeAccessType() : AppModeAccessType {
        if (this.appModeStateService.isDerayahMode()) {
            return AppModeAccessType.DERAYAH;
        } else {
            return AppModeAccessType.TICKER_CHART;
        }
    }

    public appModeAllowedFeature(feature: AppModeFeatureType): boolean {
        let applicationModeAccessTypes = AppModeFeature.getAccess(feature);
        return applicationModeAccessTypes.includes(this.getAppModeAccessType());
    }

}




