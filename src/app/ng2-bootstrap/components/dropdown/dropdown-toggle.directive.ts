import {
    Directive, ElementRef, Host, OnInit, Input, HostBinding, HostListener, Renderer2
} from '@angular/core';
import {DropdownDirective} from './dropdown.directive';

@Directive({selector: '[dropdownToggle]',standalone:true})
export class DropdownToggleDirective implements OnInit {
  @HostBinding('class.disabled')
  @Input() public isDisabled:boolean = false;

  @HostBinding('class.dropdown-toggle')
  @HostBinding('attr.aria-haspopup')
  public addClass:boolean = true;

  public dropdown:DropdownDirective;
  public el:ElementRef;
  public constructor(@Host() dropdown:DropdownDirective, el:ElementRef, private renderer: Renderer2) {
    this.dropdown = dropdown;
    this.el = el;
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // MA when users try to use Arabic translation to translate TickerChart Web arabic page, because of the
    // english names of the technical indicators and such, Google adds font tags that causes problems in this
    // directive. Therefore, to prevent that, add class notranslate so Google will stop doing that.
    this.renderer.addClass(el.nativeElement, 'notranslate');
    ////////////////////////////////////////////////////////////////////////////////////////////////////
  }

  public ngOnInit():void {
    this.dropdown.dropDownToggle = this;
  }

  @HostBinding('attr.aria-expanded')
  public get isOpen():boolean {
    return this.dropdown.isOpen;
  }

  @HostListener('click', ['$event'])
  public toggleDropdown(event:MouseEvent):boolean {
    event.stopPropagation();
    // MA if this is "submenu" then no action is done on "click", but only on mouse hover (using CSS)
    if (!this.dropdown.isSubmenu() && !this.isDisabled) {
      this.dropdown.toggle();
    }
    return false;
  }
}
