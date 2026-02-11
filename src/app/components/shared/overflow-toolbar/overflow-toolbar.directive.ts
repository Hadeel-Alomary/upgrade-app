import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    OnInit
} from '@angular/core';

@Directive({
    selector: '[overflow-toolbar]',
    standalone:true
})

export class OverflowToolbar implements OnChanges {

    @Input() containerHeight: number;
    @Input() applyDirective: boolean = true;

     initiated: boolean = false;
     dropdownToggleHeight: number = 0;
     dropdownElement:HTMLElement;
     dropdownArrowElement:HTMLElement;
     dropdownMenuElement:HTMLElement;

    constructor( public el:ElementRef) {
    }

    ngOnChanges() {
        if (!this.applyDirective) {
            return;
        }
        window.setTimeout(() => {
            this.update(); // wait for the height of the parent component to settle before running this
        }, 0);
    }

     init() {
        this.dropdownElement = $(this.el.nativeElement).find('.dynamic-dropdown').get(0);
        this.dropdownArrowElement = $(this.el.nativeElement).find('.dynamic-dropdown-toggle').get(0);
        this.dropdownMenuElement = $(this.el.nativeElement).find('.dynamic-dropdown-menu-elements').get(0);
        this.dropdownToggleHeight = this.getElementHeight(this.dropdownArrowElement);
        this.initiated = true;
    }

     update() {

        if(!$(this.el.nativeElement).is(":visible")) {
            return;
        }

        if(!this.initiated) {
            this.init();
        }

        let lastShownElementIndex = $(this.el.nativeElement).children().length - 2;
        let elements = $(this.el.nativeElement).find('> *, .dynamic-dropdown-menu-elements > *').not('.dynamic-dropdown');
        let allowedContainerHeight = this.containerHeight;
        let hasNoVisibleElements = lastShownElementIndex == -1;

        // compute heights of all elements
        let heights: number[] = [];
        let elementsHeight: number = 0;
        elements.each((index: number, child: HTMLElement) => {
            elementsHeight += this.getElementHeight(child);
            heights.push(elementsHeight);
        });

        // check whether to show/hide dropdown arrow element
        if(allowedContainerHeight <= elementsHeight) {
            allowedContainerHeight -= this.dropdownToggleHeight;
            $(this.dropdownArrowElement).show();
        } else {
            $(this.dropdownArrowElement).hide();
        }

        // find elements to move around
        let movedElements:HTMLElement[] = [];
        heights.forEach((height: number, index: number) => {
            let shouldBeShown: boolean = height < allowedContainerHeight;
            let isCurrentlyShown: boolean = index <= lastShownElementIndex;
            if (shouldBeShown != isCurrentlyShown) {
                movedElements.push(elements.get(index));
            }
        });

        // do the actual moving of elements
        let moveOutsideOverflowMenu = hasNoVisibleElements || heights[lastShownElementIndex] < allowedContainerHeight;
        if(moveOutsideOverflowMenu) {
            movedElements.forEach(element => $(this.dropdownElement).before(element)); // out of overflow menu
        } else {
            movedElements.reverse().forEach(element => $(this.dropdownMenuElement).prepend(element)); // into overflow menu
        }

    }

     getElementHeight(element:HTMLElement):number {
        if ($(element).is(":visible") && !$(element).data("height")) {
            $(element).data("height", $(element).outerHeight(true));
        }
        return $(element).data("height");
    }

}


