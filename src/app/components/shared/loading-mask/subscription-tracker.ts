import {Subject, Subscription} from 'rxjs';

export class SubscriptionTracker {
    private trackedSubscription:Subscription;
    private subscriptionFinishedStream:Subject<boolean>;

    constructor(){
        this.subscriptionFinishedStream = new Subject();
    }

    get subscription():Subscription{
        return this.trackedSubscription;
    }

    set subscription(value:Subscription){
        this.trackedSubscription = value;
        this.subscriptionFinishedStream.next(true);

        if(this.trackedSubscription) {
            this.trackedSubscription.add(() => this.finishSubscription())
        }
    }

    getSubscriptionFinishedStream():Subject<boolean>{
        return this.subscriptionFinishedStream;
    }

    isActive():boolean{
        return this.trackedSubscription != null;
    }

    private finishSubscription(){
        this.trackedSubscription = null;
        this.subscriptionFinishedStream.next(false);
    }
}
