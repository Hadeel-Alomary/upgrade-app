import {
    SharedChannel,
    ChannelRequest,
    ChannelRequestType
} from '../../../services/index';

import {SubscriptionLike as ISubscription} from 'rxjs';

export abstract class ChannelListener<T extends ChannelRequest> {

     types:ChannelRequestType[];

    protected channelRequest:T;

    protected subscriptions:ISubscription[] = [];
    
    constructor(protected sharedChannel:SharedChannel, ...types: ChannelRequestType[]){
        this.types = types;
        this.subscriptions.push(
            sharedChannel.getRequestStream().subscribe(channelRequest => this.processChannelRequest(channelRequest))
        );
    }

    protected abstract onChannelRequest():void;

    protected onDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
    }
    
     processChannelRequest(channelRequest:ChannelRequest) {
        if(this.types.includes(channelRequest.type)){
            this.channelRequest = channelRequest as T;
            this.onChannelRequest();            
        }
    }
        
}
