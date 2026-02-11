import {Component, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../shared/channel-listener';
import {SharedChannel, ChannelRequest, ChannelRequestType, News} from '../../../services/index';
import {AppTcTracker} from '../../../utils/index';

@Component({
    selector: 'news-details',
    templateUrl:'./news-details.component.html',
    styleUrls:['./news-details.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class NewsDetailsComponent extends ChannelListener<NewsDetailsRequest> implements OnDestroy {

    @ViewChild(ModalDirective)  newsModal:ModalDirective;

     news:News;

    constructor( public cd:ChangeDetectorRef, public sharedChannel:SharedChannel){
        super(sharedChannel, ChannelRequestType.News);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    onChannelRequest(){
        this.news = this.channelRequest.news;
        this.newsModal.show();
        this.cd.markForCheck();
        AppTcTracker.trackViewNews();
    }

     onHidden() {
        this.news = null;
    }

}


export interface NewsDetailsRequest extends ChannelRequest {
    news:News;
}
