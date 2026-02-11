import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewEncapsulation} from '@angular/core';
import {LanguageService} from '../../../services';
import {BS_VIEW_PROVIDERS} from '../../../ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'custom-drop-down',
    templateUrl: './custom-drop-down.component.html',
    styleUrls: ['./custom-drop-down.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    viewProviders:[BS_VIEW_PROVIDERS]
})
export class CustomDropDownComponent implements AfterViewInit {
    public isDropdownOpen: boolean = false;
    public selectedItemName: string = '';

    @Input() items: CustomDropDown[];
    @Input() selectedInitialItem: CustomDropDown;
    @Input() translate: boolean = false;
    @Output() onSelectedItem = new EventEmitter();
    @Input() disabled: boolean = false;
    public selectedExecutionIndex: number = 0;

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isDropdownOpen = false;
        }
    }

    constructor(public cd: ChangeDetectorRef, private elementRef: ElementRef, public languageService: LanguageService) { }

    ngAfterViewInit(): void {
        this.selectExecution(this.selectedInitialItem.value);
    }

    public toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
        this.cd.markForCheck();
    }

    public selectExecution(selectedItem: number): void {
        for (let i = 0; i < this.items.length; i++) {
            if (selectedItem == this.items[i].value) {
                this.selectedExecutionIndex = i;
                this.selectedItemName = this.items[this.selectedExecutionIndex].text;
                if (this.selectedInitialItem.value != this.items[i].value) {
                    this.onSelectedItem.emit(this.items[i].value);
                }
                this.isDropdownOpen =false;
                this.cd.markForCheck();
                return;
            }
        }
    }

    public refresh(): void {
        if (this.selectedInitialItem) {
            this.selectExecution(this.selectedInitialItem.value);
        }
        this.cd.detectChanges();
    }


    public onClickRightArrow(): void {
        if (this.selectedExecutionIndex > 0) {
            this.selectedExecutionIndex--;
            this.selectedItemName = this.items[this.selectedExecutionIndex].text;
            this.onSelectedItem.emit(this.items[this.selectedExecutionIndex].value);
            this.cd.markForCheck();

        }
    }

    public onClickLeftArrow(): void {
        if (this.selectedExecutionIndex < this.items.length - 1) {
            this.selectedExecutionIndex++;
            this.selectedItemName = this.items[this.selectedExecutionIndex].text;
            this.onSelectedItem.emit(this.items[this.selectedExecutionIndex].value);
            this.cd.markForCheck();
        }
    }

    public isArabic(): boolean {
        return this.languageService.arabic;
    }

    public hasTick(value: number): boolean {
       return this.selectedInitialItem.value == value;
    }
}

export interface CustomDropDown {
    value: number,
    text: string
}
