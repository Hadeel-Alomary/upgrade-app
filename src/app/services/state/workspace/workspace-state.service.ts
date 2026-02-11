import {map, mapTo} from 'rxjs/operators';
import {interval, merge, Observable, of, Subject} from 'rxjs';
import {Injectable} from '@angular/core';

import {AppBrowserUtils, StringUtils, Tc, AppTcTracker} from '../../../utils/index';
import {WorkspaceLoader} from '../../loader/workspace-loader/index';
import {Page} from '../../page/index';
import {MiscStateService} from '../misc/misc-state.service';
import {Config} from '../../../config/config';
import {AuthorizationService} from '../../auhtorization';
import {FeatureType} from '../../auhtorization/feature';
import {AccessType} from '../../auhtorization/access-type';
import {ChannelRequestType, SharedChannel} from '../../shared-channel';
import {Watchlist} from '../../settings/watchlist';
import {CredentialsStateService} from '../credentials/credentials-state.service';
import {VolatileStateService} from '../volatile/volatile-state.service';
import {WorkspaceData} from './workspace-data';
// import {WorkspaceSelectRequest} from '../../../components/modals/workspace';
import {LogoutService} from '../../logout';
// import {Interval} from 'tc-web-chart-lib';


@Injectable()
export class WorkspaceStateService {

    private storageData:{[key:string]:unknown} = {};
    private lastSavedStorageData:string;
    private saveStream:Subject<boolean> = new Subject();
    private updateCompletedStream:Subject<boolean> = new Subject();

    // MA flush state is used to notify components to flush their state before saving
    private flushStateStream:Subject<boolean>;

    constructor(
        private workspaceLoader:WorkspaceLoader,
        private miscStateService:MiscStateService,
        private volatileStateService:VolatileStateService,
        private authorizationService:AuthorizationService,
        private credentialsStateService:CredentialsStateService,
        private logoutService:LogoutService,
        private sharedChannel:SharedChannel) {

        // register to update workspace before reloading the page
        logoutService.registerOnReloadFn(this.onReloadFn.bind(this));

    }

    public init(workspaceData:WorkspaceData) {
        this.initOrMigrateWorkspaceState(workspaceData);
    }

    public selectWorkspace(id:string):Observable<boolean>{
        Tc.assert(this.hasStorage(), "must have storage");
        let result = new Subject<boolean>();
        this.workspaceLoader.selectWorkspace(id, this.volatileStateService.getWorkspaceLockId()).subscribe( (workspaceData:WorkspaceData) => {
            this.initWorkspaceState(workspaceData);
            this.sharedChannel.request({type:ChannelRequestType.WorkspaceRefresh});
            result.next(true);
            result.complete();
            result = null;
        });
        return result.asObservable();
    }

    public resetLoadedWorkspace():Observable<boolean> {
        Tc.assert(this.hasStorage(), "must have storage");
        let result = new Subject<boolean>();
        this.workspaceLoader.resetWorkspace(this.volatileStateService.getLoadedWorkspaceId(),
            this.volatileStateService.getWorkspaceLockId()).subscribe( (workspaceData:WorkspaceData) => {
            this.initWorkspaceState(workspaceData);
            this.sharedChannel.request({type:ChannelRequestType.WorkspaceRefresh});
            result.next(true);
            result.complete();
            result = null;
        });
        return result.asObservable();
    }

    public createWorkspace(workspaceName:string, fromWorkspaceId:string):Observable<String> {
        Tc.assert(this.hasStorage(), "must have storage");
        let workspaceId = StringUtils.hashCode(workspaceName);
        return this.workspaceLoader.createWorkspace(workspaceId, workspaceName, fromWorkspaceId)
            .pipe(map( (workspaceData:WorkspaceData) => {
            return workspaceData.id;
        }));
    }

    public getFlushStateStream():Subject<boolean> {
        return this.flushStateStream;
    }

    public has(key:StateKey) {
        return key in this.storageData;
    }

    public set(key:StateKey, state:unknown){
        this.storageData[key] = state;
        this.write();
    }

    public get(key:StateKey) {
        Tc.assert(this.has(key), "state is not set for key " + key);
        return this.storageData[key] ? this.storageData[key] : [];
    }

    public unset(key:StateKey){
        delete this.storageData[key];
        this.write();
    }

    public save() {
        if(this.hasStorage()) {
            this.autoSave();
        }
    }

    public updateWorkspace():Observable<boolean> {

        Tc.assert(this.hasStorage(), "must have storage");

        if (!this.hasPendingChanges()) {
            return of(true); // MA nothing to update
        }

        this.lastSavedStorageData = JSON.stringify(this.storageData);

        // MA inform UI that we are saving workspace
        this.sharedChannel.getRequestStream().next({type: ChannelRequestType.WorkspaceUpdateInProgress});

        // MA save first to make sure all changes of components are reflected
        this.save();

        let name:string = this.volatileStateService.getLoadedWorkspaceName();
        let id:string = this.volatileStateService.getLoadedWorkspaceId();

        // save workspace
        let workspaceData: {[key: string]: string | {[key: string]: unknown}} = {'workspace-name': name,
            'workspace-id': StringUtils.hashCode(name),
            'workspace-last-updated': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            'data': this.storageData};

        this.workspaceLoader.updateWorkspace(this.volatileStateService.getWorkspaceLockId(), workspaceData).subscribe(success => {
            if(!success) {
                this.inactivateWorkspace();
            }
            this.updateCompletedStream.next(true);
        });

        return this.updateCompletedStream.asObservable();

    }

    public loadVisitorWorkspace(defaultMarketAbbreviation:string):Observable<void> {
        Tc.assert(!this.hasStorage(), "default workspace should be only loaded for visitors");
        let workspaceName:string = AppBrowserUtils.isDesktop() ? 'visitor' : 'mobile';
        return this.workspaceLoader.loadWorkspace(workspaceName).pipe(map((data:{[key:string]:unknown}) => {
            // do not save workspace info (as it is default and not user created)
            this.storageData['version'] = Config.getVersion();
            this.storageData = data;
        }));
    }

    public markWorkspaceAsDefault(workspaceId:string):Observable<void> {
        Tc.assert(this.hasStorage(), "must have storage");
        return this.workspaceLoader.markDefaultWorkspace(workspaceId);
    }

    public hasWorkspaceLoaded():boolean {
        return this.hasStorage() && this.storageData[StateKey.Pages] != null;
    }

    public unlockWorkspace() {
        if (this.hasWorkspaceLoaded()) {
            let workspaceId = this.volatileStateService.getLoadedWorkspaceId();
            this.workspaceLoader.unlockWorkspaceOnUnload(workspaceId, this.volatileStateService.getWorkspaceLockId());
            this.miscStateService.unlockWorkspaceFromThisTab(workspaceId, this.volatileStateService.getWorkspaceLockId());
        }
    }

    public registerLiveWebUser():Observable<WorkspaceData> {
        let migration = localStorage.getItem('TC_STATE') != null;
        return this.workspaceLoader.registerLiveWebUser(this.volatileStateService.getWorkspaceLockId(), migration);
    }

    /* init workspace methods */

    private initOrMigrateWorkspaceState(workspaceData:WorkspaceData) {
        this.flushStateStream = new Subject<boolean>();
        if(this.hasStorage()) { // MA for visitor, no storage
            let storageKey = this.getStorageKey(this.authorizationService.getAccessType());
            if (localStorage.getItem(storageKey)) {
                this.migrateWorkspaceState();
            } else {
                this.initWorkspaceState(workspaceData);
            }
            this.setAutoSaveEvents();
        }
    }

    private migrateWorkspaceState() {
        let storageKey = this.getStorageKey(this.authorizationService.getAccessType());
        Tc.assert(this.hasStorage() && localStorage.getItem(storageKey) != null, 'no storage to migrate');
        this.migrateWorkspaceData(localStorage.getItem(storageKey));
        localStorage.removeItem(storageKey);
    }

    private migrateWorkspaceData(localStorageData:string) {
        Tc.assert(this.hasStorage(), "must have storage");
        this.workspaceLoader.migrateWorkspace(this.volatileStateService.getWorkspaceLockId(), JSON.parse(localStorageData)).subscribe((workspaceData: WorkspaceData) => {
            this.initWorkspaceState(workspaceData);
            this.sharedChannel.request({type:ChannelRequestType.WorkspaceRefresh});
        });
    }

    private initWorkspaceState(workspaceData:WorkspaceData) {
        if(this.hasStorage()) {

            let hasWorkspaceData = workspaceData != null;

            if (!hasWorkspaceData) {
                // Ehab no workspace is selected so we need to auto select if it's one workspace or net lite
                window.setTimeout(() => {
                    this.workspaceLoader.listWorkspaces().subscribe(res => {
                        let workspaceKeys: string[] = Object.keys(res);
                        if (workspaceKeys.length == 1) {
                            this.selectWorkspace(res[workspaceKeys[0]].id).subscribe(() => {});
                        } else if(this.authorizationService.isRegistered() || this.authorizationService.isBasicSubscriber()) {
                            //Ehab: on Registered Or Basic: Auto select the default workspace since choosing workspace button produce authorization message
                            workspaceKeys.forEach(key => {
                                if(res[key].default){
                                    this.selectWorkspace(res[key].id).subscribe(() => {});
                                }
                            })
                        }  else {
                            // Let the user to manual select workspace.
                            // let workspaceSelectRequest: WorkspaceSelectRequest = {
                            //     type: ChannelRequestType.WorkspaceSelect,
                            //     forceSelection: true
                            // };
                            // this.sharedChannel.request(workspaceSelectRequest);
                        }
                    });
                }, 0);
                return;
            }

            this.storageData = workspaceData.data;

            this.lastSavedStorageData = JSON.stringify(this.storageData);
            this.volatileStateService.setLoadedWorkspaceInfo(workspaceData.id, workspaceData.name);
            this.miscStateService.lockWorkspaceByThisTab(workspaceData.id, this.volatileStateService.getWorkspaceLockId());
            this.trackLoadedWorkspace();
        }
    }

    /* saving methods */

    private setAutoSaveEvents(){

        Tc.assert(this.hasStorage(), "must have storage");

        // save before leaving the window
        window.onbeforeunload = (event) => {
            this.unlockWorkspace();
            if(this.hasPendingChanges()) {
                // MA this is the way to tell Chrome to show its pop-up for confirming that changes
                // are going to be lost on exit. Whatever string you write here makes no difference
                // as chrome will only show the built-in message that it has.
                event.returnValue = "pending change exists";
                // MA in case user decided to stay on the page, then auto-update after 1 second.
                window.setTimeout(() => {
                    this.miscStateService.lockWorkspaceByThisTab(this.volatileStateService.getLoadedWorkspaceId(), this.volatileStateService.getWorkspaceLockId());
                    this.updateWorkspace();
                }, 30*1000);//Abu5, once the chrome alert dialog appear, there is no way to detect if the user click on cancel or reload. I delayed this function execution to make sure that the user click on cancel
            }
        };

        // save every 10 seconds
        window.setInterval(() => {
            if(this.hasWorkspaceLoaded()) {
                this.autoSave();
            }
        }, 1000 * 10);

        // set lock every 10 minutes
        window.setInterval(() => {
            if(this.hasWorkspaceLoaded()) {
                this.lockWorkspace();
            }
        }, 1000 * 60 * 10);

        // save every 1 seconds
        window.setInterval(() => {
            if(this.hasWorkspaceLoaded()) {
                if(this.miscStateService.isLockedByOtherTab(this.volatileStateService.getLoadedWorkspaceId(), this.volatileStateService.getWorkspaceLockId())) {
                    this.inactivateWorkspace();
                }
            }
        }, 1000);

        this.processSaveStream();

    }

    private processSaveStream() {

        Tc.assert(this.hasStorage(), "must have storage");

        let recentlyFlushed = false;
        let needsFlushing = false;

        let flushWorkspaceToServer = () => {
            if(!recentlyFlushed) {
                this.updateWorkspace();
                recentlyFlushed = true;
                needsFlushing = false;
            } else {
                needsFlushing = true;
            }
        }

        // allow saving to happen at most "once" every 3 minutes
        merge(this.saveStream, interval(3 * 60 * 1000).pipe(mapTo('reset'))).subscribe(value => {
            if(!this.hasWorkspaceLoaded()) {
                return;
            }
            if(value == 'reset') { // MA allow "one" flush every reset (which is set to 25 seconds)
                recentlyFlushed = false; // allow flushing by resetting recentlyFlushed flag
                if(needsFlushing) { // in case a pending flush exists, then just process it.
                    flushWorkspaceToServer();
                }
            } else {
                flushWorkspaceToServer();
            }
        });

    }

    private autoSave() {
        Tc.assert(this.hasStorage(), "attempt to save workspace while not having storage");
        this.flushStateStream.next(true);
        this.write();
    }

    private write(){
        this.authorizationService.authorizeService(FeatureType.SAVE_WORKSPACE_LOCALLY, () =>{
            this.storageData['version'] = Config.getVersion();
            if(this.hasPendingChanges()) {
                this.saveStream.next(true);
            }
        })
    }

    /* locking & loosing lock methods */

    private lockWorkspace() {
        Tc.assert(this.hasStorage(), "must have storage");
        let workspaceId = this.volatileStateService.getLoadedWorkspaceId();
        this.workspaceLoader.lockWorkspace(workspaceId, this.volatileStateService.getWorkspaceLockId()).subscribe(success => {
            if(!success) {
                this.inactivateWorkspace();
            }
        })
    }

    private inactivateWorkspace() {
        Tc.assert(this.hasStorage(), "must have storage");
        this.storageData[StateKey.Pages] = null;
        this.lastSavedStorageData = null;
        this.volatileStateService.resetLoadedWorkspaceInfo();
        this.sharedChannel.request({type:ChannelRequestType.WorkspaceRefresh});
        window.setTimeout(() => {
            this.sharedChannel.request({type: ChannelRequestType.InactiveTab});
        }, 0);
    }

    /* update workspace on reload */

    private onReloadFn():Observable<boolean> {

        if(!this.hasWorkspaceLoaded()) {
            return of(true);
        }

        let subject = new Subject<boolean>();
        this.updateWorkspace().subscribe(() => {
            window.setTimeout(() => {
                this.unlockWorkspace();
                subject.next(true);
                subject.complete();
                subject = null;
            }, 0);
        });

        return subject.asObservable();

    }

    /* utils methods */

    private hasStorage() {
        return !this.authorizationService.isVisitor();
    }

    private getStorageKey(accessType:AccessType) {
        let SUBSCRIBED_STORAGE_KEY: string = 'TC_STATE';
        switch (accessType) {
            case AccessType.REGISTERED:
            case AccessType.BASIC_SUBSCRIPTION:
            case AccessType.ADVANCED_SUBSCRIPTION:
            case AccessType.PROFESSIONAL_SUBSCRIPTION:
                return SUBSCRIBED_STORAGE_KEY;
            default:
                Tc.error('attempt to access storage for visitor');
        }
    }

    private hasPendingChanges() {
        Tc.assert(this.hasStorage(), "must have storage");
        if(!this.hasWorkspaceLoaded()) {
            return false; // no changes to save (no workspace is loaded)
        }
        return JSON.stringify(this.storageData) != this.lastSavedStorageData;
    }

    private trackLoadedWorkspace() {
        AppTcTracker.trackLoadWorkspace();
        if(this.has(StateKey.Watchlist)) {
            AppTcTracker.trackWatchlistsCount((this.get(StateKey.Watchlist) as Watchlist[]).length);
        }
        // if(this.has(StateKey.CustomIntervals)) {
        //     AppTcTracker.trackUserDefinedIntervalsCount((this.get(StateKey.CustomIntervals) as Interval[]).length);
        // }
        if(this.has(StateKey.Filter)) {
            AppTcTracker.trackFiltersCount((this.get(StateKey.Filter) as string[]).length);
        }
        if(this.has(StateKey.Pages)) {
            AppTcTracker.trackPagesCount((this.get(StateKey.Pages) as Page[]).length);
            let numberOfBoxes:number = 0;
            (this.get(StateKey.Pages) as Page[]).forEach( (page:Page) => {
                if(page.grid.boxes) {
                    numberOfBoxes += Object.keys(page.grid.boxes).length;
                }
            });
            AppTcTracker.trackBoxesCount(numberOfBoxes);
        }
    }


}


export enum StateKey {
    Watchlist = 'Wastchlist',
    Pages = 'Pages',
    Filter = 'Filter',
    CustomIntervals = 'CustomIntervals'
}


