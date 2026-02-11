import {Injectable} from '@angular/core';
import {StringUtils} from '../../../utils';


@Injectable()

export class VolatileStateService {

    private state:{[key:string]:Object} = {};
    // MA DEFAULT_WORKSPACE_NAME *must* match the name used in PHP (at backend)
    private static DEFAULT_WORKSPACE_NAME:string = "مساحتي";
    private static DEFAULT_WORKSPACE_ID:string = StringUtils.hashCode(VolatileStateService.DEFAULT_WORKSPACE_NAME);
    private loadedWorkspaceInfo:{id: string, name: string} = {id: VolatileStateService.DEFAULT_WORKSPACE_ID, name: VolatileStateService.DEFAULT_WORKSPACE_NAME};
    private readonly workspaceLock:string;

    public constructor() {
        this.workspaceLock = StringUtils.hashCode(StringUtils.guid());
    }

    public getState(key:string):Object {
        return this.state[key];
    }

    public setState(key:string, object:Object):void {
        this.state[key] = object;
    }

    /* loaded workspace info */

    getLoadedWorkspaceName():string {
        return this.loadedWorkspaceInfo.name;
    }

    getLoadedWorkspaceId():string {
        return this.loadedWorkspaceInfo.id;
    }

    setLoadedWorkspaceInfo(id:string, name:string) {
        this.loadedWorkspaceInfo = {id: id, name:name};
    }

    resetLoadedWorkspaceInfo() {
        this.loadedWorkspaceInfo = {id: VolatileStateService.DEFAULT_WORKSPACE_ID, name: VolatileStateService.DEFAULT_WORKSPACE_NAME};
    }

    /* Workspace Lock */

    getWorkspaceLockId():string {
        return this.workspaceLock;
    }

}

