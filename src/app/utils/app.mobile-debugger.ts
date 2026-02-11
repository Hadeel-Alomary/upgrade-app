import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '../config/config';
// import {Tc} from 'tc-web-chart-lib';

@Injectable()
export class AppMobileDebugger {

    private static LOG_INTERVAL = 2000;
    private static instance:AppMobileDebugger;
    private buffer:string;
    private inited:boolean;

    constructor(private http:HttpClient) {
        AppMobileDebugger.instance = this;
    }

    public static log(message:string) {
        if(Config.isProd()) {
            return;
        }
        if(!AppMobileDebugger.instance) {
            // Tc.debug("mobile debugger is turned off and can be enabled by injecting it in chart component");
            return;
        }
        if(!AppMobileDebugger.instance.inited) {
            AppMobileDebugger.instance.init(); // init on first log message
        }
        AppMobileDebugger.instance.buffer += message + "\n";
    }


    private init() {
        this.inited = true;
        window.setInterval(() => {
            this.buffer += "\n-------------------------\n"; // add separator
            AppMobileDebugger.instance.http.post('/m/liveweb/mobile/debug', JSON.stringify({message: this.buffer}))
                .subscribe();
            this.buffer = ""; // empty buffer after sending it
        }, AppMobileDebugger.LOG_INTERVAL);
    }

}
