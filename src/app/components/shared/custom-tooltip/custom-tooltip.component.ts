import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {LanguageService} from '../../../services/state/language';
import {AppModeAuthorizationService} from '../../../services';

@Component({
    selector: 'custom-tooltip',
    templateUrl: './custom-tooltip.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTooltipComponent implements OnInit {

    @Input() symbol: string;
    @Input() marketName: string;
    @Input() isChart: boolean = false;

    @Input() flagAnnotation: string = '';
    @Input() name: string = '';
    @Output() openCompanyFinancialStatement: EventEmitter<string> = new EventEmitter<string>();

    constructor(public languageService:LanguageService, public appModeAuthorizationService: AppModeAuthorizationService) { }

    ngOnInit() { }


    public getFlagAnnotationTxt(): string {
        return this.languageService.arabic ? `المزيد من البيانات المالية ل ${this.name}` : `More Info fo ${this.name}`
    }

    public onClickFlagAnnotation(): void {
        this.openCompanyFinancialStatement.emit(this.symbol);
    }

}
