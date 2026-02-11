import {AfterViewInit, Directive, ElementRef} from '@angular/core';

@Directive({
    standalone:true,
    selector: '[vertical-center]',
    exportAs: 'vertical-center'
})
export class VerticalCenterDirective implements AfterViewInit {
    private element: ElementRef;

    constructor(element: ElementRef) {
        this.element = element;
    }

    ngAfterViewInit(): void {
        this.verticalCentering();
    }

    private verticalCentering() {
        window.setTimeout(() => {
            let top:number = Math.floor((window.innerHeight - this.element.nativeElement.getBoundingClientRect().height) / 2);
            this.element.nativeElement.style.top = top > 0 ? top + 'px': '0px';
        }, 0);
    }
}
