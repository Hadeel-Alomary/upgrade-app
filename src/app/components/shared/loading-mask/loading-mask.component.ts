import {ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';

import {animate, style, transition, trigger} from '@angular/animations';
import {SubscriptionTracker} from './subscription-tracker';


const inactiveStyle = style({
    opacity: 0,
});
const timing = '.3s ease';

@Component({
    selector: 'loading-mask',
    templateUrl:'./loading-mask.component.html',
    styleUrls: ['./loading-mask.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('fadeInOut', [
            transition('void => *', [
                inactiveStyle,
                animate(timing)
            ]),
            transition('* => void', [
                animate(timing, inactiveStyle)
            ])
        ])
    ]
})
export class LoadingMaskComponent {

    private tracker: SubscriptionTracker;

    constructor(
        private cd:ChangeDetectorRef
    ) {}

    setTracker(tracker: SubscriptionTracker): void {
        if(this.tracker) {
            this.tracker.getSubscriptionFinishedStream().unsubscribe();
        }
        this.tracker = tracker;
        this.tracker.getSubscriptionFinishedStream()
            .subscribe((active:boolean) => this.cd.markForCheck());
    }

    isActive() {
        if(!this.tracker) {
            return false;
        }
        return this.tracker.isActive();
    }
}
