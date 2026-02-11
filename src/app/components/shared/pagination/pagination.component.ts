import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class PaginationComponent {

    constructor(public cd: ChangeDetectorRef) {}

    @Input() showMoreButton: boolean = true;

    @Output() onActivePageChanged = new EventEmitter<number>();
    @Output() onMoreClicked = new EventEmitter();

    public activePage: number = 1;

    @Input() listOfNumberOfPages: number[] = [1,2,3,4,5,6,7];
    pageNumberChange(pageNumber: number) {
        // this condition to prevent load data if user click on activated page more than once , If the page is active and click on it do nothing .
        if (this.activePage !== pageNumber) {
            this.activePage = pageNumber;
            this.onActivePageChanged.emit(pageNumber);
        }
    }

    getActivePage(): number {
        return this.activePage;
    }

    reset() : void {
        this.activePage = 1;
        this.cd.markForCheck();
    }

    onMoreButtonClicked() {
        this.onMoreClicked.emit();
    }
}
