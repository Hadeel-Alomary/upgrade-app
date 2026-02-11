import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {LanguageService} from '../../../services/state/language';

@Component({
    selector: 'delayed-data-grid-authorization-message',
    templateUrl: './delayed-data-grid-authorization-message.html',
    styleUrls: ['./delayed-data-grid-authorization-message.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DelayedDataGridAuthorizationMessage {
    constructor(public languageService: LanguageService) {}
}
