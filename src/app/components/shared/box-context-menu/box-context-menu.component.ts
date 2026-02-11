import {ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {GridBoxType} from '../grid-box';
import {AppModeAuthorizationService, AuthorizationService} from '../../../services';
import {AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';
import {FeatureType} from '../../../services/auhtorization/feature';
import {FeatureGridBox} from '../../../services/auhtorization/feature-grid-box';

@Component({
    selector:'box-context-menu',
    templateUrl:'./box-context-menu.component.html',
    styleUrls:['./box-context-menu.component.css'],
    encapsulation:ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BoxContextMenuComponent {
    @Output() outputBoxType:EventEmitter<GridBoxType> = new EventEmitter<GridBoxType>();

     gridBoxType = GridBoxType;
     constructor(private appModeAuthorizationService: AppModeAuthorizationService, private authorizationService: AuthorizationService) {
     }

     openWindow(type:GridBoxType):void{
        this.outputBoxType.emit(type);
    }

    public isAuthorizedGridBox(type:GridBoxType) {
        let featureType: FeatureType = FeatureGridBox.getAuthorizationFeatureTypeByGridBoxType(type);
        return this.authorizationService.authorizeFeature(featureType);
    }

    public canShowTradesSummary(): boolean {
         return this.authorizationService.isProfessionalSubscriber() || this.appModeAuthorizationService.appModeAllowedFeature(AppModeFeatureType.SHOW_TRADES_SUMMARY);
    }

}
