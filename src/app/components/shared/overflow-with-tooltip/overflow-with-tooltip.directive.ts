import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[overflow-with-tooltip]',
  standalone:true
})
export class OverflowWithTooltipDirective implements AfterViewInit, OnChanges {
    @Input() tooltipTitle: string;
    //NK beside changing the title, the element may changes it's width, so use this input to tell the directive to update itself.
    //NK once this input changed, angular will call ngOnChanges and we can get the updated values from the element.
    @Input() forceUpdateTooltip:boolean;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit() {
        this.renderer.setAttribute(this.el.nativeElement, "data-toggle", "tooltip");
        this.renderer.setAttribute(this.el.nativeElement, "data-animation", "false");
        this.renderer.setAttribute(this.el.nativeElement, "data-placement", "top");
    }

    ngOnChanges(changes: SimpleChanges): void {
        //NK give the element enough time to update it's width
        //so we can get the correct value of (clientWidth, scrollWidth)
        setTimeout(() => {
            this.updateTooltip();
        });
    }

    updateTooltip(): void {
        let tooltip: string = this.isOverflowing() ? this.tooltipTitle : '';
        this.renderer.setAttribute(this.el.nativeElement, "data-original-title", tooltip);
    }

    isOverflowing(): boolean {
        return this.el.nativeElement.clientWidth < this.el.nativeElement.scrollWidth;
    }
}
