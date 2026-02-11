import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import {AppBrowserUtils} from '../../../utils';

@Directive({
    selector: '[draggable-element]',
    exportAs: 'draggable-element',
    standalone:true
})
export class DraggableElementDirective implements AfterViewInit {

    @Output() elementDropped = new EventEmitter<{ top: number, left: number }>();
    @Input('draggable-element') handle = '';
    @Input() allowDraggingInMobile: boolean = false;

    constructor(private el: ElementRef) {} // keep ElementRef

    ngAfterViewInit(): void {
        let element = this.el.nativeElement as HTMLElement;

        // Desktop: jQuery draggable
        $(element).draggable({
            handle: this.handle,
            containment: '.app',
            scroll: false,
            stop: (event: Event, ui:DraggableObject) => {
                this.elementDropped.emit(ui.position);
            }
        });

        if (this.allowDraggingInMobile) {
            this.addTouchSupport(element);

            // Adjust position if mobile is rotated
            if (AppBrowserUtils.isMobileRotated()) {
                this.clampPosition();
            }

            // Also adjust on resize for dynamic changes
            window.addEventListener('resize', () => {
                if (AppBrowserUtils.isMobileRotated()) {
                    this.clampPosition();
                }
            });
        }
    }

    // Clamp element inside container immediately

    public clampPosition() {
        const element = this.el.nativeElement as HTMLElement;
        this.adjustElementPosition(element);
    }
    private adjustElementPosition(element: HTMLElement) {
        const container = document.querySelector('.app') as HTMLElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const rect = element.getBoundingClientRect();

        let newLeft = rect.left;
        let newTop = rect.top;

        // Clamp horizontally
        newLeft = Math.max(containerRect.left, Math.min(newLeft, containerRect.right - element.offsetWidth));
        // Clamp vertically
        newTop = Math.max(containerRect.top, Math.min(newTop, containerRect.bottom - element.offsetHeight));

        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
    }

    private addTouchSupport(element: HTMLElement) {
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        const handleElement = this.handle
            ? element.querySelector(this.handle) as HTMLElement
            : element;

        if (!handleElement) return;

        const getContainer = () => document.querySelector('.app') as HTMLElement;

        handleElement.addEventListener('touchstart', (event: TouchEvent) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;

            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            element.style.position = 'absolute';
            element.style.zIndex = '1000';

            event.preventDefault();
        }, { passive: false });

        handleElement.addEventListener('touchmove', (event: TouchEvent) => {
            const touch = event.touches[0];
            let dx = touch.clientX - startX;
            let dy = touch.clientY - startY;

            const container = getContainer();
            if (!container) return;

            const containerRect = container.getBoundingClientRect();

            // calculate new position with updated container bounds
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            // containment horizontally
            newLeft = Math.max(containerRect.left, Math.min(newLeft, containerRect.right - element.offsetWidth));
            // containment vertically
            newTop = Math.max(containerRect.top, Math.min(newTop, containerRect.bottom - element.offsetHeight));

            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;

            event.preventDefault();
        }, { passive: false });

        handleElement.addEventListener('touchend', () => {
            const rect = element.getBoundingClientRect();
            this.elementDropped.emit({ top: rect.top, left: rect.left });
        });
    }

}

interface DraggableObject {
    position: DraggablePosition
}

export interface DraggablePosition {
    top:number,
    left:number
}
