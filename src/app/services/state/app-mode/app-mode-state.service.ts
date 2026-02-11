import {Injectable} from '@angular/core';
import {Tc} from '../../../utils';

@Injectable()
export class AppModeStateService {
    private static STORAGE_KEY: string = "TC_WEBAPP_MODE";
    private appMode: string = 'tickerchart';

    constructor() {
        let storageAppModeAsString: string = localStorage.getItem(AppModeStateService.STORAGE_KEY);
        if(storageAppModeAsString) {
            Tc.assert(storageAppModeAsString == 'tickerchart' || storageAppModeAsString == 'derayah', 'Wrong app mode');
            this.appMode = storageAppModeAsString;
        }
    }

    public isTickerChartMode(): boolean {
        return this.appMode == 'tickerchart';
    }

    public isDerayahMode() : boolean{
        return this.appMode == 'derayah';
    }

}

