import {Directive, ElementRef, Host, OnInit, HostBinding, HostListener} from '@angular/core';
import {DropdownDirective} from './dropdown.directive';

@Directive({selector: '[dropdownMenu]'})
export class DropdownMenuDirective implements OnInit {
  public dropdown:DropdownDirective;
  public el:ElementRef;

  /* tslint:disable:no-unused-variable */
  @HostBinding('class.dropdown-menu')
  public addClass:boolean = true;
  /* tslint:enable:no-unused-variable */

  public constructor(@Host() dropdown:DropdownDirective, el:ElementRef) {
    this.dropdown = dropdown;
    this.el = el;
  }

  public ngOnInit():void {
    this.dropdown.dropDownMenu = this;
  }

  // MA kill those events, so that NgGrid won't handle them
  @HostListener('mousedown', ['$event'])
  public eatMouseDown(event:MouseEvent):boolean {
    if(this.dropdown.isOpen) {
      event.stopPropagation();
    }
    return true;
  }

  // MA kill those events, so that NgGrid won't handle them
  @HostListener('mousemove', ['$event'])
  public eatMouseMove(event:MouseEvent):boolean {
    if(this.dropdown.isOpen) {
      event.stopPropagation();
    }
    return true;
  }    
  
}
