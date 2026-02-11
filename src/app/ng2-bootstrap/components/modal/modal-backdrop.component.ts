import {Component, ElementRef, Renderer2} from '@angular/core';
import {ClassName} from './modal-options.class';

export class ModalBackdropOptions {
  public animate:boolean = true;

  public constructor(options:ModalBackdropOptions) {
    Object.assign(this, options);
  }
}

@Component({
  selector: 'bs-modal-backdrop',
  template: '',
  host: {'class': `${ClassName.BACKDROP}`}
})
export class ModalBackdropComponent {
  public get isAnimated():boolean{
    return this._isAnimated;
  }

  public set isAnimated(value:boolean) {
    this._isAnimated = value;
      value ? this.renderer.addClass(this.element.nativeElement, `${ClassName.FADE}`) : this.renderer.removeClass(this.element.nativeElement, `${ClassName.FADE}`);
  }

  public get isShown():boolean{
    return this._isShown;
  }

  public set isShown(value:boolean) {
    this._isShown = value;
    value ? this.renderer.addClass(this.element.nativeElement, `${ClassName.IN}`) : this.renderer.removeClass(this.element.nativeElement, `${ClassName.IN}`);
  }

  public element:ElementRef;
  public renderer: Renderer2;

  private _isAnimated:boolean;
  private _isShown:boolean = false;

  public constructor(options:ModalBackdropOptions, element:ElementRef, renderer: Renderer2) {
    this.element = element;
    this.renderer = renderer;
    this.isAnimated = options.animate !== false;
  }
}
