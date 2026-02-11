import {Subscription} from 'rxjs/internal/Subscription';
import {Subject} from 'rxjs/internal/Subject';

export class LoadingMaskManualTrigger {

    private triggerSubject:Subject<boolean> = new Subject();
    private subscription:Subscription;

    public show():Subscription {
        this.subscription = this.triggerSubject.subscribe();
        return this.subscription;
    }

    public hide():void {
        if(this.subscription) {
            this.triggerSubject.next(true);
            this.subscription.unsubscribe();
        }
    }

    public getSubscription():Subscription {
        return this.subscription;
    }

}
