import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';

import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../../ng2-bootstrap/ng2-bootstrap';

import {AuthorizationService, ChannelRequest, ChannelRequestType, LanguageService, SharedChannel, VolatileStateService, WorkspaceLoader, WorkspaceStateService} from '../../../../services/index';


import {ArrayUtils} from '../../../../utils/index';
import {ChannelListener} from '../../shared/channel-listener';
import {NgForm} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {ConfirmationCaller, ConfirmationRequest} from '../../popup';
import {WorkspaceInfo} from '../../../../services/loader/workspace-loader/workspace-info';
import {FeatureType} from '../../../../services/auhtorization/feature';

@Component({
    selector: 'workspace-select',
    templateUrl:'./workspace-select.component.html',
    styleUrls:['./workspace-select.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class WorkspaceSelectComponent extends ChannelListener<WorkspaceSelectRequest> implements OnDestroy {

    workspacesList:{[key:string]: WorkspaceInfo} = {};
    loadingList:boolean = false;
    newWorkspaceName:string = "";
    newWorkspaceFromId:string = "";
    manualErrorMsg:string = "";
    waitingSubscription: Subscription;
    shown:boolean;
    savingWorkspace: boolean;

    @ViewChild(ModalDirective) public modal: ModalDirective;

    @ViewChild('createWorkspaceForm') createWorkspaceForm: NgForm;

    constructor( public workspaceLoader:WorkspaceLoader,
                 public workspaceStateService: WorkspaceStateService,
                 public volatileStateService:VolatileStateService,
                 public cd:ChangeDetectorRef,
                 public sharedChannel:SharedChannel,
                 public languageService:LanguageService,
                 public authorizationService: AuthorizationService){
        super(sharedChannel, ChannelRequestType.WorkspaceSelect);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    /* channel requests */

    protected onChannelRequest() {

        if(this.loadingList){ return; } // we are currently loading, wait ...

        // MA load list before showing the modal
        this.loadingList = true;
        this.workspaceLoader.listWorkspaces().subscribe( res => {
            this.loadingList = false;
            this.workspacesList = res;
            this.newWorkspaceName = "";
            this.newWorkspaceFromId = "";
            window.setTimeout(() => {
                // MA as operations done here could end-up in leaving current workspace, therefore, update workspace before doing that.
                this.workspaceStateService.updateWorkspace();
                this.showModal();
            }, 0);
        });

    }

    /* template helpers */

    getSortedWorkspaceIds():string[] {
        let nameAndKeys:string[] = [];
        Object.keys(this.workspacesList).forEach(id => {
            let name:string = this.workspacesList[id].name;
            nameAndKeys.push(`${name}|${id}`);
        })
        return nameAndKeys.sort().reverse().map(value => value.split('|')[1]);
    }

    isForceSelection():boolean {
        return this.channelRequest.forceSelection;
    }

    isMyWorkspace(workspaceId:string):boolean {
        return this.workspacesList[workspaceId].lock == this.volatileStateService.getWorkspaceLockId();
    }

    isLockedWorkspace(workspaceId:string):boolean {
        return this.workspacesList[workspaceId].lock != null && !this.isMyWorkspace(workspaceId);
    }

    isAvailableWorkspace(workspaceId:string):boolean {
        return !this.isLockedWorkspace(workspaceId) && !this.isMyWorkspace(workspaceId);
    }

    isDefaultWorkspace(workspaceId:string):boolean {
        return this.workspacesList[workspaceId].default;
    }

    workspaceRowClassName(workspaceId: string):string {
        if(this.isMyWorkspace(workspaceId)) {
            return 'my-workspace';
        } else if(this.isLockedWorkspace(workspaceId)) {
            return 'locked-workspace';
        } else {
            return 'available-workspace';
        }
    }

    /* interactive events */

    onOpenWorkspace(id:string){
        let isAuthorize = this.authorizationService.authorize(FeatureType.ADVANCE_WORKSPACE_CONTROL, () =>{});
        if(isAuthorize){
            this.waitingSubscription = this.workspaceStateService.selectWorkspace(id).subscribe(() => {
                this.hideModal();
            });
        }else {
            this.hideModal();
        }
    }

    onCreateWorkspace() {
        let isAuthorize: boolean = this.authorizationService.authorize(FeatureType.CREATE_WORKSPACE, () =>{}, true ,ArrayUtils.values(this.workspacesList).length);
        if(isAuthorize){
            this.manualErrorMsg = '';

            if(this.newWorkspaceName == '') {
                this.manualErrorMsg = this.languageService.translate('الرجاء ادخال اسم لمساحة العمل');
                return;
            }

            if(ArrayUtils.values(this.workspacesList).find(w => w.name == this.newWorkspaceName) != null) {
                this.manualErrorMsg = this.languageService.translate('اسم مساحة العمل مستخدم، الرجاء اختيار اسم آخر');
                return;
            }

            if(5 <= ArrayUtils.values(this.workspacesList).length) {
                this.manualErrorMsg = this.languageService.translate('لقد وصلت إلى الحد الأعلى من المساحات التي يمكن إنشاؤها.');
                return;
            }

            this.createNewWorkspaceAndReloadWorkspaceList();

        }else {
            this.hideModal();
        }
    }

    markAsDefaultWorkspace(workspaceId: string) {
        let isAuthorize =  this.authorizationService.authorize(FeatureType.ADVANCE_WORKSPACE_CONTROL, ()=>{});
        if(isAuthorize) {
            let waitingSubject = new Subject<boolean>();
            this.waitingSubscription = waitingSubject.subscribe();
            this.workspaceStateService.markWorkspaceAsDefault(workspaceId).subscribe(() => {
                this.reloadListAfterRequest(waitingSubject);
            });
        }else  {
            this.hideModal();
        }
    }

    onDeleteWorkspace(id: string) {
        let isAuthorize =  this.authorizationService.authorize(FeatureType.ADVANCE_WORKSPACE_CONTROL, ()=>{});

        if(isAuthorize) {
            let line:string = this.languageService.translate("هل ترغب في حذف مساحة العمل [VALUE] ؟");
            line = line.replace('[VALUE]', this.workspacesList[id].name);

            let self = this;
            let caller: ConfirmationCaller = new class implements ConfirmationCaller {
                onConfirmation(confirmed: boolean, param: unknown): void {
                    if(confirmed) {
                        self.waitingSubscription = self.workspaceLoader.deleteWorkspace(id).subscribe(() => {
                            delete self.workspacesList[id];
                            self.cd.markForCheck();
                        });
                    }
                    self.showModal();
                }
            }

            let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: line, caller: caller};
            this.sharedChannel.request(confirmationRequest);
            this.hideModal();
        }else {
            this.hideModal();
        }
    }

    updateWorkspace() {
        if(this.savingWorkspace) { // we just clicked it, so no need to click it again
            return;
        }
        this.savingWorkspace = true;
        this.workspaceStateService.updateWorkspace().subscribe();
        window.setTimeout(() => {
            this.savingWorkspace = false;
            this.cd.markForCheck();
        }, 4500);
    }


    private createNewWorkspaceAndReloadWorkspaceList() {
        let waitingSubject = new Subject<boolean>();
        this.waitingSubscription = waitingSubject.subscribe();
        this.workspaceStateService.createWorkspace(this.newWorkspaceName, this.newWorkspaceFromId).subscribe((workspaceId:string) => {
            if(this.isForceSelection()) {
                this.openWorkspaceAfterRequest(workspaceId, waitingSubject);
            } else {
                this.reloadListAfterRequest(waitingSubject);
            }
        });
    }

    private openWorkspaceAfterRequest(workspaceId: string, waitingSubject:Subject<boolean>) {
        this.workspaceStateService.selectWorkspace(workspaceId).subscribe(() => {
            waitingSubject.next(true);
            waitingSubject.complete();
            waitingSubject = null;
            this.hideModal();
            this.cd.markForCheck();
        });
    }

    private reloadListAfterRequest(waitingSubject:Subject<boolean>) {
        this.waitingSubscription = this.workspaceLoader.listWorkspaces().subscribe(res => {
            this.workspacesList = res;
            this.newWorkspaceName = '';
            this.newWorkspaceFromId = '';
            waitingSubject.next(true);
            waitingSubject.complete();
            waitingSubject = null;
            this.cd.markForCheck();
        });
    }

    private showModal() {
        this.modal.show();
        this.shown = true;
        this.cd.markForCheck();
    }

    private hideModal() {
        this.modal.hide();
        this.shown = false;
        this.cd.markForCheck();
    }

}


export interface WorkspaceSelectRequest extends ChannelRequest {
    forceSelection: boolean,
}



