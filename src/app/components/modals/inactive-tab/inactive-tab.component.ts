import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../shared';
import {ChannelRequest, ChannelRequestType, SharedChannel} from '../../../services/shared-channel';
import {LanguageService} from '../../../services/state/language';
import {VolatileStateService, WorkspaceStateService} from '../../../services/state';
import {WorkspaceSelectRequest} from '../workspace';
import {AppBrowserUtils} from '../../../utils';
import {AppModeAuthorizationService, AuthorizationService} from '../../../services';
import {AppModeFeatureType} from '../../../services/auhtorization/app-mode-authorization';

@Component({
    selector: 'inactive-tab',
    templateUrl:'./inactive-tab.component.html',
    styleUrls:['./inactive-tab.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    viewProviders:[BS_VIEW_PROVIDERS]
})
export class InactiveTabComponent extends ChannelListener<InactiveTabChannelRequest> implements OnDestroy {

    @ViewChild(ModalDirective) inactiveTabModal: ModalDirective;
    shown:boolean = false;
    appModeFeatureType = AppModeFeatureType;

    constructor(
        public sharedChannel: SharedChannel,
        public cd: ChangeDetectorRef,
        public volatileStateService:VolatileStateService,
        public workspaceStateService:WorkspaceStateService,
        public languageService:LanguageService,
        public authorizationService: AuthorizationService,
        public appModeAuthorizationService: AppModeAuthorizationService) {
        super(sharedChannel, ChannelRequestType.InactiveTab);
    }

    ngOnDestroy(): void {
        this.onDestroy();
    }

    onChannelRequest(): void {
        this.shown = true;
        this.inactiveTabModal.show();
        this.cd.markForCheck();
    }

    onSelectWorkspace() {
        if(AppBrowserUtils.isMobile()) {
            // for mobile, just reload to re-activate workspace (since it is a single workspace)
            this.sharedChannel.request({type:ChannelRequestType.Reload});
        } else {
            let workspaceSelectRequest:WorkspaceSelectRequest = {type: ChannelRequestType.WorkspaceSelect, forceSelection:true};
            this.sharedChannel.request(workspaceSelectRequest);
        }
        this.inactiveTabModal.hide();
        this.shown = false;
        this.cd.markForCheck();
    }

    public isBasicUser(): boolean {
        return this.authorizationService.isBasicSubscriber();
    }

    public appModeAllowedFeature(featureType: AppModeFeatureType) : boolean {
        return this.appModeAuthorizationService.appModeAllowedFeature(featureType)
    }

    public onClose() {
        window.close();
    }

    public isMobile() {
        return AppBrowserUtils.isMobile();
    }

    public isAllowedFeature(feature: AppModeFeatureType): boolean {
        return this.authorizationService.isProfessionalSubscriber() || this.appModeAllowedFeature(feature);
    }
}

export interface InactiveTabChannelRequest extends ChannelRequest{
}
