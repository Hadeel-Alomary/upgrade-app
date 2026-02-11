import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {GridNotification} from "./grid-notification";

@Component({
    selector: 'grid-notification-bar',
    templateUrl: './grid-notification-bar.component.html',
    styleUrls: ['./grid-notification-bar.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class GridNotificationBarComponent {

    @Input() notification: GridNotification;
    @Output() onAction = new EventEmitter();

    onOutputAction() {
        this.onAction.emit();
    }

}
