import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Tc} from "../../../utils";
import {Config} from "../../../config/config";
import {Observable, of} from 'rxjs';

@Injectable()

export class LanguageLoaderService{

    constructor(private http:HttpClient){}

    public getLanguageEntries():Observable<{entries:{[arabic:string]:string}}> {
        if(Config.isElementBuild()) {
            return of({entries:{}});
        }
        return this.http.get<{entries:{[arabic:string]:string}}>(Tc.url('/m/liveweb/translation/entry'));
    }

    public addNewLanguageEntry(arabic:string):void {
        if(Config.isElementBuild()) {
            return;
        }
        this.http.post<{ success: boolean }>(Tc.url('/m/liveweb/translation/entry'),
            {"arabic": arabic, "dev_mode": !Config.isProd()}).subscribe();
    }

}
