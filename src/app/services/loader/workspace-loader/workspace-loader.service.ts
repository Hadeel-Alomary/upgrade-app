import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppBrowserUtils, StringUtils, Tc, AppTcTracker} from '../../../utils/index';
import {LanguageService} from '../../state/language/index';
import {Page} from '../../page';
import {WorkspaceData} from '../../state/workspace/workspace-data';
import {WorkspaceInfo} from './workspace-info';
import {CredentialsStateService} from '../../state/credentials/credentials-state.service';
import {AppModeStateService} from '../../state/app-mode/app-mode-state.service';

@Injectable()
export class WorkspaceLoader {

    constructor(private http: HttpClient,
                private languageService:LanguageService,
                private credentialsService:CredentialsStateService,
                private appModeStateService:AppModeStateService){}

    public registerLiveWebUser(lockId:string, workspaceMigration:boolean):Observable<WorkspaceData> {

        let u:string = btoa(this.credentialsService.username);
        let h:string = StringUtils.hashCode(`_${this.credentialsService.username}_`);
        let data:{[key:string]:string} = {u: u, h: h, "lock-id":lockId};
        if(AppBrowserUtils.isMobile()) {
            data['m'] = '1';
        }
        if(this.appModeStateService.isDerayahMode()) {
            data['derayah'] = '1';
        }
        if(workspaceMigration) {
            data['migration'] = '1';
        }
        return this.http.post<RegisterUserResponse>(Tc.url('/m/liveweb/register'), JSON.stringify(data)).pipe(
            map(response => {
                Tc.assert(response.success, "fail to register user");
                return response.workspace ? {
                    id: response.workspace.id,
                    data: response.workspace.data,
                    name: response.workspace.name,
                    lock: response.workspace.lock
                } : null;
            })
        );
    }


    public migrateWorkspace(lockingId:string, workspaceData:{[key: string]: unknown}):Observable<WorkspaceData> {
        AppTcTracker.trackMigrateWorkspace();
        let data:string = JSON.stringify({"lock-id":lockingId, "workspace":workspaceData});
        return this.http.post<WorkspaceDetailsResponse>(Tc.url('/m/liveweb/workspaces/migrate'), data).pipe(
            map(response => {
                Tc.assert(response.success, "fail to select workspace");
                return {
                    id: response.workspace.id,
                    data: response.workspace.data,
                    name: response.workspace.name,
                    lock: response.workspace.lock
                };
            }));
    }

    public updateWorkspace(lockingId:string, workspaceData:{[key: string]: unknown}):Observable<boolean> {
        AppTcTracker.trackUpdateWorkspace();
        let data:string = JSON.stringify({workspace: workspaceData, "lock-id":lockingId});
        return this.http.post<SuccessResponse>(Tc.url('/m/liveweb/workspaces/update'), data).pipe(
            map((res: SuccessResponse) => {
                return res.success;
            }));
    }

  public loadWorkspace(id: string): Observable<{ [key: string]: unknown } | null> {
    return this.http.get<{ [key: string]: unknown }>(
      Tc.url(`/m/liveweb/workspaces/${id}?language=${this.languageService.getLanguage()}`)
    ).pipe(
      map(res => {
        // If res is an array and empty, return null
        if (Array.isArray(res) && res.length === 0) return null;

        // If res is an object and empty, return null
        if (typeof res === 'object' && res !== null && Object.keys(res).length === 0) return null;

        return res;
      })
    );
  }


    public loadPage(id:string):Observable<Page> {
        return this.http.get<Page>(Tc.url(`/m/liveweb/pages/${id}`));
    }

    public deleteWorkspace(id:string):Observable<void> {
        AppTcTracker.trackDeleteWorkspace();
        return this.http.get<SuccessResponse>(Tc.url(`/m/liveweb/workspaces/${id}/delete`)).pipe(
            map(res => Tc.assert(res.success, "fail to delete"))
        );
    }

    public listWorkspaces():Observable<{[key:string]:WorkspaceInfo}> {
        return this.http.get<Observable<ListWorkspacesResponse>>(Tc.url('/m/liveweb/workspaces/list')).pipe(
            map(response => {
                let result:{[key:string]:WorkspaceInfo} = {};
                Object.keys(response).forEach(workspaceId => {
                    result[workspaceId] = {
                        id: workspaceId,
                        name: response[workspaceId].name,
                        lastUpdated: response[workspaceId].lastUpdated,
                        lock: response[workspaceId].lock,
                        default: response[workspaceId].default
                    };
                });
                return result;
            })
        );
    }

    public lockWorkspace(workspaceId:string, lockingId:string):Observable<boolean> {
        let data:string = JSON.stringify({"lock-id":lockingId, "workspace-id":workspaceId});
        return this.http.post<LockWorkspaceResponse>(Tc.url('/m/liveweb/workspaces/lock'), data).pipe(
            map(res => { return res.success; }));
    }

    public selectWorkspace(workspaceId:string, lockingId:string):Observable<WorkspaceData> {
        AppTcTracker.trackSelectWorkspace();
        let data:string = JSON.stringify({"lock-id":lockingId, "workspace-id":workspaceId});
        return this.http.post<WorkspaceDetailsResponse>(Tc.url('/m/liveweb/workspaces/select'), data).pipe(
            map(response => {
                Tc.assert(response.success, "fail to select workspace");
                return {
                    id: response.workspace.id,
                    data: response.workspace.data,
                    name: response.workspace.name,
                    lock: response.workspace.lock
                };
            }));
    }

    public resetWorkspace(workspaceId: string, lockingId: string) {
        AppTcTracker.trackResetWorkspace();
        let data:string = JSON.stringify({"lock-id":lockingId, "workspace-id":workspaceId});
        return this.http.post<WorkspaceDetailsResponse>(Tc.url('/m/liveweb/workspaces/reset'), data).pipe(
            map(response => {
                Tc.assert(response.success, "fail to select workspace");
                return {
                    id: response.workspace.id,
                    data: response.workspace.data,
                    name: response.workspace.name,
                    lock: response.workspace.lock
                };
            }));
    }

    public createWorkspace(workspaceId:string, workspaceName:string, fromWorkspaceId:string):Observable<WorkspaceData> {
        AppTcTracker.trackCreateWorkspace();
        let data:{[key:string]:string} = {"workspace-id":workspaceId, "workspace-name":workspaceName};
        if(fromWorkspaceId) {
            data['from-workspace-id'] = fromWorkspaceId;
        }
        return this.http.post<WorkspaceDetailsResponse>(Tc.url('/m/liveweb/workspaces/create'), JSON.stringify(data)).pipe(
            map(response => {
                Tc.assert(response.success, "fail to create workspace");
                return {
                    id: response.workspace.id,
                    data: response.workspace.data,
                    name: response.workspace.name,
                    lock: response.workspace.lock
                };
            }));
    }

    public unlockWorkspaceOnUnload(workspaceId:string, lockingId:string) {
        let data:string = JSON.stringify({"lock-id":lockingId, "workspace-id":workspaceId});
        navigator.sendBeacon('/m/liveweb/workspaces/unlock', data);
    }

    public markDefaultWorkspace(workspaceId:string):Observable<void> {
        AppTcTracker.trackMarkDefaultWorkspace();
        let data:{[key:string]:string} = {"workspace-id":workspaceId};
        return this.http.post<SuccessResponse>(Tc.url('/m/liveweb/workspaces/mark-default'), JSON.stringify(data)).pipe(
            map(response => {
                Tc.assert(response.success, "fail to create workspace");
            }));
    }


}

interface SuccessResponse {
    success: boolean
}

interface ListWorkspacesResponse {
    [key:string]: {
        lastUpdated:string,
        name:string,
        lock:string,
        default:boolean
    }
}

interface LockWorkspaceResponse {
    success: boolean
}

interface WorkspaceDetailsResponse {
    success: boolean;
    workspace: {
        id: string;
        data: {[key:string]:unknown};
        name:string;
        lock:string
    }
}

interface RegisterUserResponse {
    success: boolean;
    workspace: WorkspaceData
}
