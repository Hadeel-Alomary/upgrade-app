import {Directive, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import {LanguageService} from '../../../services/index';
@Directive({
    selector: '[explain]'
})

export class ExplainDirective implements OnChanges, OnInit, OnDestroy {

    @Input() title:string;
    @Input() content:string;
    @Input() placement:string;
    @Input() show:boolean;
    @Output() showChange:EventEmitter<boolean> = new EventEmitter<boolean>();

    
    constructor( public el: ElementRef, private languageService:LanguageService) {}
    
    ngOnInit() {
        $(this.el.nativeElement).popover({
            title: this.languageService.translate(this.title),
            content: this.languageService.translate(this.content),
            placement: 'bottom',
            trigger: 'manual'
        });
    }
    
    ngOnChanges() {
        if(this.show) {

            //https://stackoverflow.com/questions/30810113/dynamically-change-content-of-popover-in-bootstrap
            $(this.el.nativeElement).attr('data-content', this.languageService.translate(this.content));

            $(this.el.nativeElement).popover('show');
            window.setTimeout(() => {
                $(this.el.nativeElement).popover('hide');
                this.show = false;
                this.showChange.emit(this.show);
            }, 2500);
        }
    }
    
    ngOnDestroy() {
        $(this.el.nativeElement).popover('destroy');
    }
    
}

