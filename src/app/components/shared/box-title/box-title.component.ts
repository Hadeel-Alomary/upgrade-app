import {Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {AutoLinkType, SharedChannel, ChannelRequest, ChannelRequestType, AuthorizationService, MarketsManager} from '../../../services/index';
import {FeatureType} from '../../../services/auhtorization/feature';
import {AppBrowserUtils, MarketUtils} from '../../../utils';
import {AnnotationDelayedRequest} from '../../modals/annotation-delayed-modal/annotation-delayed-modal.component';

@Component({
    selector: 'box-title',
    templateUrl:'./box-title.component.html',
    styleUrls:['./box-title.component.css'],
    standalone:true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxTitleComponent {

    @Input() title:number;
    @Input() symbol: string;
    @Input() autoLink:AutoLinkType;
    @Input() isOverlayBox:boolean = false;
    @Input() changeMaximizeBtn:boolean = true;
    @Output() close = new EventEmitter();
    @Output() outputAutoLink = new EventEmitter();
    @Output() outputToggleMaximize = new EventEmitter();
    @Output() toggleOverlayBoxMaximized = new EventEmitter();

    overlayBoxMaximized = false;

    constructor(private authorizationService:AuthorizationService,private sharedChannel:SharedChannel, private marketsManager: MarketsManager){
        this.sharedChannel.getRequestStream().subscribe((request:ChannelRequest) => {
            if(request.type == ChannelRequestType.OverlayContainerHiddenInMaximizedCase) {
                this.overlayBoxMaximized = false;
            }
        })
    }

    /* Interaction events */
     onClose(){
        this.close.emit();
    }

    onToggleOverlayBoxMaximized(){
         if(!this.changeMaximizeBtn) {
             this.toggleOverlayBoxMaximized.emit();
         }else{
             this.overlayBoxMaximized = !this.overlayBoxMaximized;
             this.toggleOverlayBoxMaximized.emit(this.overlayBoxMaximized);
         }
    }

     onAutoLinkChanged(autoLink:AutoLinkType){
        this.outputAutoLink.emit(autoLink);
    }

     onToggleMaximize() {
        this.outputToggleMaximize.emit();
    }

    isDynamicLayout():boolean {
       return this.authorizationService.authorizeFeature(FeatureType.DYNAMIC_BOX_LAYOUT) && AppBrowserUtils.isDesktop();
    }

    isDesktop():boolean {
         return AppBrowserUtils.isDesktop();
    }

    openAnnotationDelayedModal() {
        let request: AnnotationDelayedRequest = {
            type: ChannelRequestType.AnnotationDelayed,
            symbol: this.getSymbol()
        }

        this.sharedChannel.request(request);
    }

    public getSymbol(): string {
        return this.symbol ? this.symbol : '';
    }

    public showDelayedAnnotation(): boolean {
        return this.symbol && !this.marketsManager.getMarketBySymbol(this.symbol).isRealTime;
    }

    public getMarketAbbr() {
        return this.symbol ? MarketUtils.marketAbbr(this.symbol) : '';
    }

}
