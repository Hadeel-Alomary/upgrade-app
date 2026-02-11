import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    standalone:true,
    selector: '[leading-zero-trimmer]'
})

export class LeadingZeroTrimmerDirective {

    constructor(private el: ElementRef) {}

    @HostListener('keyup')
    onChange() {
        let nativeElement:HTMLInputElement = (this.el.nativeElement as HTMLInputElement);
        if(nativeElement.value.startsWith('0')) {
            nativeElement.value = nativeElement.value.replace(/^0+/, '');
        }
    }

}
