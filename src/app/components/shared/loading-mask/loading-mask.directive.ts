import {ComponentFactoryResolver, ComponentRef, Directive, Injector, Input, OnChanges, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs';

import {LoadingMaskComponent} from './loading-mask.component';
import {SubscriptionTracker} from './subscription-tracker';

@Directive({
    selector: '[loading-mask-directive]'
})
export class LoadingMaskDirective implements OnChanges {
    @Input('loading-mask-directive') subscription: Subscription;

    private loadingImageRef: ComponentRef<LoadingMaskComponent>;
    private tracker: SubscriptionTracker;

    constructor(
        private cfResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef,
        private injector: Injector
    ) {
        this.tracker = new SubscriptionTracker();
    }

    ngOnChanges() {

        if(this.subscription !== this.tracker.subscription){
            this.tracker.subscription = this.subscription;
        }

        if (!this.loadingImageRef) {
            this.destroyLoadingImageComponent();
            this.createLoadingImageComponent();
        }
    }

    ngOnDestroy() {
        this.destroyLoadingImageComponent();
    }

    private destroyLoadingImageComponent() {
        this.loadingImageRef && this.loadingImageRef.destroy();
    }

    private createLoadingImageComponent() {
        let loadingImageFactory = this.cfResolver.resolveComponentFactory(LoadingMaskComponent);
        this.loadingImageRef = this.vcRef.createComponent(loadingImageFactory, null, this.injector);
        this.loadingImageRef.instance.setTracker(this.tracker);
    }
}
