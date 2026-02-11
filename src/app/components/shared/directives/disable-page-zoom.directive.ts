import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[disablePageZoom]'
})
export class DisablePageZoomDirective {

    private lastTap = 0;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        // Apply CSS touch-action to fully disable native gestures
        this.renderer.setStyle(this.el.nativeElement, 'touch-action', 'none');
    }



    // Prevent pinch-zoom (iPad/iPhone Safari preserves event.scale)
    @HostListener('touchmove', ['$event'])
    onTouchMove(event: SafariTouchEvent) {
        if (event.touches.length > 1 || (event.scale !== undefined && event.scale !== 1)) {
            event.preventDefault();
        }
    }

    // Prevent double-tap zoom
    /*@HostListener('touchend', ['$event'])
    onTouchEnd(event: TouchEvent) {
        const now = Date.now();
        if (now - this.lastTap < 300) {
            event.preventDefault();
        }
        this.lastTap = now;
    }*/

    // Prevent Safari desktop-mode pinch on iPad (pointer events)
    //@HostListener('pointerdown', ['$event'])
    @HostListener('pointermove', ['$event'])
    @HostListener('pointerup', ['$event'])
    onPointerEvent(event: PointerEvent) {
        // No browser default gestures allowed
        if (event.pointerType === 'touch') {
            event.preventDefault();
        }
    }

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent) {
        // Detect pinch-to-zoom gestures
        if (event.ctrlKey || event.metaKey) {
            // Prevent browser zoom
            event.preventDefault();

            // Handle chart zoom
            //const delta = event.deltaY; // deltaY < 0 = zoom in, > 0 = zoom out
            //this.zoomChart(delta);
        }
    }
}

interface SafariTouchEvent extends TouchEvent {
    scale?: number;
}
