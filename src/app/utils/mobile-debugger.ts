import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tc} from './tc.utils';

@Injectable()
export class MobileDebugger {

    private static LOG_INTERVAL = 2000;
    private static instance:MobileDebugger;
    private buffer:string;
    private inited:boolean;

    constructor(private http:HttpClient) {
        MobileDebugger.instance = this;
    }

    public static log(message:string) {
        // if(Config.isProd()) {
        //     return;
        // }
        if(!MobileDebugger.instance) {
            Tc.debug("mobile debugger is turned off and can be enabled by injecting it in chart component");
            return;
        }
        if(!MobileDebugger.instance.inited) {
            MobileDebugger.instance.init(); // init on first log message
        }
        MobileDebugger.instance.buffer += message + "\n";
    }


    private init() {
        this.inited = true;
        window.setInterval(() => {
            this.buffer += "\n-------------------------\n"; // add separator
            MobileDebugger.instance.http.post('/m/liveweb/mobile/debug', JSON.stringify({message: this.buffer}))
                .subscribe();
            this.buffer = ""; // empty buffer after sending it
        }, MobileDebugger.LOG_INTERVAL);
    }

}
