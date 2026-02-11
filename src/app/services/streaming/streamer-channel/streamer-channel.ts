import {ReplaySubject, Subject} from 'rxjs';
import {DomUtils, StringUtils, Tc, AppTcTracker} from '../../../utils/index';

export class StreamerChannel {

    private websocket:WebSocket;
    private receivingStream: Subject<unknown>;
    private sendingStream: ReplaySubject<string>;

    constructor(){
        this.receivingStream = new Subject();
        this.sendingStream = new ReplaySubject(500); // MA - 500 is size of the replay queue
    }

    private buildWebSocketUrl(url:string, isTickerChartStreamer: boolean):string {
        url = url.replace(/^https:\/\//, "wss://");
        url = url.replace(/^http:\/\//, "ws://");
        if(isTickerChartStreamer) {
            if (url.lastIndexOf("/") === url.length - 1) {
                url = url.substring(0, url.length - 1);
                url = url + "ws/"
            } else {
                url = url + "ws/"
            }
        }
        return url;
    }

    subscribeTopic(message:string) {
        this.sendingStream.next(`${message}`);
    }

    unSubscribeTopic(topic:string) {
        this.sendingStream.next(`unsubscribe=${topic}`);
    }

    getMessageStream():Subject<unknown> {
        return this.receivingStream;
    }

    initWebSocket(url:string, isTickerChartStreamer: boolean){
        Tc.info("connect to streamer " + url);
        AppTcTracker.trackConnectTo(DomUtils.hostname(url));
        let websocketUrl:string = this.buildWebSocketUrl(url, isTickerChartStreamer);
        this.websocket = new WebSocket(websocketUrl);
        this.websocket.onopen = (evt:Event) => this.onOpen(evt);
        this.websocket.onclose = (evt:Event) => this.onClose(evt);
        this.websocket.onmessage = (evt:MessageEvent) => this.onMessage(evt);
        this.websocket.onerror = (evt:Event) => this.onError(evt);
    }

    disconnect() {
        // http://stackoverflow.com/questions/4812686/closing-websocket-correctly-html5-javascript
        this.websocket.onclose = function () {};
        this.websocket.close();
    }

    private onOpen(event:Event) {
        console.log("getting onOpen event");
        if(this.websocket.readyState){ // websocket is in ready state to send
            console.log("send websocket data");
            this.websocket.send(`uid=${StringUtils.guid()}`);
            // we have a stream, let us start process sending queue
            this.sendingStream.subscribe( (data:string) => {
                this.websocket.send(data);
            });
        }
    }

    private onClose(event:Event) {
        console.log(event);
    }

    private onMessage(event:MessageEvent) {
        this.receivingStream.next(JSON.parse(event.data));
    }

    private onError(event:Event) {
        console.log(event);
        /**********************Handle Exception**********************/
        /* Exception Message: e.srcElement is undefined*/
        if(event && event.srcElement && event.srcElement["url"]) {
            Tc.warn("fail to open websocket " + event.srcElement["url"]);
        }else{
            Tc.warn("fail to open websocket on firefox");
        }
        /*************************************************************/
    }

}
