import {Streamer} from './streamer.service';
import {Tc, AppTcTracker} from '../../../utils/index';
import {LogoutService} from '../../logout/logout.service';
import {ForceLogoutType} from '../../logout/force-logout-type';
import {StreamerType} from '../shared/streamerType';

export class HeartbeatManager {

    private lastReceivedLog:{[market:string]:number} = {};

    private static THRESHOLD:number = 45000;

    private disconnectionCounter: {[streamerType:string]:number} = {};

    private timerId:number;

    constructor(private streamer:Streamer, private logoutService:LogoutService) {
        this.timerId = window.setInterval(() => this.checkHeartbeatTimeout(), 1000);
    }

    monitorMarket(streamerType: string){
        this.lastReceivedLog[streamerType] = Date.now();
        this.disconnectionCounter[streamerType] = 0;
    }

    heartbeatReceived(streamerType:string) {
        this.lastReceivedLog[streamerType] = Date.now();
        this.disconnectionCounter[streamerType] = 0;
    }

    disconnect() {
        window.clearInterval(this.timerId);
    }

    private checkHeartbeatTimeout() {

        let disconnectedStreamersTypes:string[] = [];

        Object.keys(this.lastReceivedLog).forEach(streamerTypeString => {
            if((Date.now() - this.lastReceivedLog[streamerTypeString]) > HeartbeatManager.THRESHOLD) {
                if(this.streamer.canReconnectStreamer(streamerTypeString)) { //Ehab don't reconnect delayed streamer
                    disconnectedStreamersTypes.push(streamerTypeString);
                }
            }
        });

        disconnectedStreamersTypes.every(streamerTypeString => {
            this.disconnectionCounter[streamerTypeString] += 1;

            if(this.disconnectionCounter[streamerTypeString] == 10) {
                // MA too much disconnection, log the user out (we got 1k+ reconnection for some users in the log due to this)
                this.disconnectionCounter[streamerTypeString] = 0;
                if(streamerTypeString != StreamerType.GeneralPurpose && streamerTypeString != StreamerType.Financial ) {//Ehab: Don't logout if (general purpose OR financial) has multiple disconnections
                    this.disconnect();
                    Tc.warn(`too much heartbeat disconnection, log out streamer: ${streamerTypeString}`);
                    this.logoutService.forceLogout(ForceLogoutType.FailToConnect);
                    return false; // break the loop
                }
            }

            Tc.warn(`heartbeat disconnection detected for market / streamer ${streamerTypeString}, request restart`);
            AppTcTracker.trackHeartbeatDisconnection(streamerTypeString);

            this.streamer.onHeartbeatTimeout(streamerTypeString);
            // MA reset market timer, so that if another 45 secs passes without being connected,
            // (as in internet disconnection), then keep trying to reconnect again and again.
            this.lastReceivedLog[streamerTypeString] = Date.now();
            return true;
        });
    }

}
