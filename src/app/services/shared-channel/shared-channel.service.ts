import {Injectable} from "@angular/core";
import {ChannelRequest} from './channel-request';
import {Subject} from "rxjs";

@Injectable()
export class SharedChannel {
    
    private requestStream:Subject<ChannelRequest>;

    constructor() {
        this.requestStream = new Subject<ChannelRequest>();
    }
    
    request(request:ChannelRequest) {
        this.requestStream.next(request);
    }

    getRequestStream() {
        return this.requestStream;
    }
        
}



