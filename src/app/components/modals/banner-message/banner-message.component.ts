import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {BannerMessage, BannerService, LanguageService, Loader} from '../../../services/index';
import {SubscriptionLike as ISubscription} from 'rxjs';
import {AppBrowserUtils} from '../../../utils';

@Component({
    selector: 'banner-message',
    templateUrl: './banner-message.component.html',
    styleUrls: ['./banner-message.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class BannerMessageComponent implements OnDestroy {

    subscriptions: ISubscription[] = [];
    bannerMessage: BannerMessage;
    isShown: boolean = false;
    closableOnClick:boolean = false;

    constructor(public loader: Loader, public cd: ChangeDetectorRef, public languageService: LanguageService, public bannerService: BannerService) {
        this.subscriptions.push(
            this.loader.isLoadingDoneStream().subscribe(loadingDone => {
                if (loadingDone) {
                    this.processBannerMessage(this.loader.getBannerMessage());
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
    }

    processBannerMessage(message: BannerMessage) {
        setTimeout(() => {
            if (message && this.bannerService.showBannerMessage(message) && !this.isShown) {
                this.bannerService.markBannerMessageAsDisplayed(message);
                this.bannerMessage = message;
                this.cd.markForCheck();
                window.setTimeout(() => this.closableOnClick = true, 3500);
            }
        }, 5000);
    }

    showBannerMessage() {
        this.isShown = true;
        this.cd.markForCheck();
    }

    /* Template Events */

    closeOnClick() {
        if(this.closableOnClick) {
            this.closeMessage();
        }
    }

    closeMessage() {
        this.isShown = false;
        // MA after animation is done, let us remove this component from "html"
        setTimeout(() => {
            this.bannerMessage = null;
            this.cd.markForCheck();
        }, 3000);
    }

    getUrlText(): string {
        return this.languageService.arabic ? this.bannerMessage.arabicUrlText : this.bannerMessage.englishUrlText;
    }

    getImageUrl(){
        let imageUrl: string = this.bannerMessage.imageUrl;
        if(AppBrowserUtils.isMobile()){
            imageUrl = this.bannerMessage.mobileImageUrl;
        }
        return imageUrl;
    }
}
