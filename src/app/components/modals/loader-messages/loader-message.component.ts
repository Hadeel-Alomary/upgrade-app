import {Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, OnDestroy} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';
import {Loader, AdvanceMessage, SimpleMessage, LanguageService} from '../../../services/index';
import {SubscriptionLike as ISubscription} from 'rxjs';

@Component({
    selector:'loader-message',
    templateUrl:'./loader-message.component.html',
    styleUrls:['./loader-message.component.css'],
    viewProviders:[BS_VIEW_PROVIDERS],
    changeDetection:ChangeDetectionStrategy.OnPush,
    encapsulation:ViewEncapsulation.None
})
export class LoaderMessageComponent implements OnDestroy{

    @ViewChild(ModalDirective)  modal:ModalDirective;

     subscriptions:ISubscription[] = [];

     waitingSimpleMessages:SimpleMessage[] = [];
     waitingAdvanceMessages:AdvanceMessage[] = [];

     selectedSimpleMessage:SimpleMessage;
     selectedAdvanceMessage:AdvanceMessage;

    constructor( public loader:Loader,  public cd:ChangeDetectorRef, public languageService:LanguageService) {
        this.subscriptions.push(
            this.loader.isLoadingDoneStream().subscribe(loadingDone => {
                if (loadingDone) {
                    for (let simpleMessage of this.loader.getSimpleMessages()) {
                        this.processSimpleMessage(simpleMessage);
                    }

                    for (let advanceMessage of this.loader.getAdvanceMessages()) {
                        this.processAdvanceMessage(advanceMessage);
                    }
                }
            })
        );
    }


    ngOnDestroy(){
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
        this.subscriptions = null;
    }


     processSimpleMessage(message:SimpleMessage){
        this.waitingSimpleMessages.push(message);
        setTimeout(() => {
            if (!this.modal.isShown) {
                this.showSimpleMessage();
            }
        });
    }

     processAdvanceMessage(message:AdvanceMessage){
        this.waitingAdvanceMessages.push(message);
        setTimeout(() => {
            if (!this.modal.isShown) {
                this.showAdvanceMessage();
            }
        })
    }

     showSimpleMessage(){
        this.selectedSimpleMessage = this.waitingSimpleMessages.shift();
        this.selectedAdvanceMessage = null;
        this.modal.show();
        this.cd.markForCheck();
    }

     showAdvanceMessage(){
        this.selectedAdvanceMessage = this.waitingAdvanceMessages.shift();
        this.selectedSimpleMessage = null;
        this.modal.show();
        this.cd.markForCheck();
    }

    /* Template Helpers */

     get modalTitle(){
        let defaultTitle = this.languageService.translate('رسالة من تكرتشارت');
        if(this.selectedSimpleMessage){
            return defaultTitle;
        }else if(this.selectedAdvanceMessage){
            if(this.selectedAdvanceMessage.title.length > 0) {
                return this.selectedAdvanceMessage.title;
            }else{
                return defaultTitle;
            }
        }
        return '';
    }

    /* Template Events */

     onCloseModal() {
        this.modal.hide();
        if (this.waitingSimpleMessages.length > 0) {
            this.showSimpleMessage();
        } else if (this.waitingAdvanceMessages.length > 0) {
            this.showAdvanceMessage();
        }
    }
}
