import {
  Directive, OnInit, OnDestroy, Input, Output, HostBinding, EventEmitter,
  ElementRef, ChangeDetectorRef, Renderer2
} from '@angular/core';
import {AppDropdownMenuPosition, DomUtils} from '../../../utils/index';

export const ALWAYS = 'always';
export const DISABLED = 'disabled';
export const OUTSIDECLICK = 'outsideClick';
export const NONINPUT = 'nonInput';

@Directive({selector: '[dropdown]'})
export class DropdownDirective implements OnInit, OnDestroy {
  @HostBinding('class.open')
  @Input()
  public get isOpen():boolean {
    return this._isOpen;
  }

  @Input() public autoClose:string;
  @Input() public keyboardNav:boolean;
  // enum string: ['always', 'outsideClick', 'disabled']
  @Input() public appendToBody:boolean;

  @Output() public onToggle:EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() public isOpenChange:EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @HostBinding('class.dropdown') public addClass:boolean = true;

  // index of selected element
  public selectedOption:number;
  // drop menu html
  public menuEl:ElementRef;
  // drop down toggle element
  public toggleEl:ElementRef;
  public el:ElementRef;
  private _isOpen:boolean;

  private _changeDetector: ChangeDetectorRef;

  private closeDropdownBind:EventListener = this.closeDropdown.bind(this);
  private keybindFilterBind:EventListener = this.keybindFilter.bind(this);


  // Add concept of "static" dropdown, for which we have to position dropdown manually according to its nearest non-static parent (not dropdown class anymore).
  // This was needed because we marked toolbar with overflow:hidden, in order to be able to cut extra overflow items when resizing down grid box.
  // However, for overflow:hidden, all menus stopped to appear (they are cut out as well, since they are children from the toolbar)
  // The only way to avoid this trimming is by making their "relative" parent (for the menus) to be outside toolbar.
  // That means, we need to change bootstrap behaviour, which marks dropdown class by default as relative.
  // To do that, once "static" class is added to the dropdown menu, it will mark it as position:static and will use extra logic to manually position Menu.
  private _needMenuPositioning:boolean = false;
  private _dropdownMenuPosition:AppDropdownMenuPosition = new AppDropdownMenuPosition();

  public constructor(el:ElementRef, ref:ChangeDetectorRef, private renderer: Renderer2) {
    // @Query('dropdownMenu', {descendants: false})
    // dropdownMenuList:QueryList<ElementRef>) {
    this.el = el;
    this._changeDetector = ref;
    // todo: bind to route change event
  }

  public set isOpen(value:boolean) {

    this._isOpen = !!value;

    if(this._isOpen && this._needMenuPositioning){
      this.positionDropdownMenu();
    }

    // todo: implement after porting position
    // if (this.appendToBody && this.menuEl) {
    //
    // }

    // todo: $animate open<->close transitions, as soon as ng2Animate will be
    // ready
    if (this.isOpen) {
      this.focusToggleElement();
      // MA setTimeout (to have element visible), and then enforce that it fits within screen
      window.setTimeout(() => DomUtils.forceElementWithinScreenBounds(this.renderer, this.menuEl.nativeElement), 0);
    } else {
      this.selectedOption = void 0;
    }
    this.onToggle.emit(this.isOpen);
    this.isOpenChange.emit(this.isOpen);
    this._changeDetector.markForCheck();
    // HA: this code to hide chart panel context menu when open any dropdown (indicator dropdown , period-selector ...)
    if(this.isOpen) {
        $('body').trigger('closeallcontextmenu');
    }
    // todo: implement call to setIsOpen if set and function
  }

  public ngOnInit():void {
    this.autoClose = this.autoClose || NONINPUT;
    this._needMenuPositioning = this.el.nativeElement.classList.contains('static');
    if (this.isOpen) {
      // todo: watch for event get-isOpen?
    }
    this.addEventsListeners();
  }

  public ngOnDestroy():void {
    if (this.appendToBody && this.menuEl) {
      this.menuEl.nativeElement.remove();
    }

    this.removeEventsListeners();
  }

  public set dropDownMenu(dropdownMenu:{el:ElementRef}) {
    // init drop down menu
    this.menuEl = dropdownMenu.el;

    if (this.appendToBody) {
      window.document.body.appendChild(this.menuEl.nativeElement);
    }
  }

  public set dropDownToggle(dropdownToggle:{el:ElementRef}) {
    // init toggle element
    this.toggleEl = dropdownToggle.el;
  }

  public toggle(open?:boolean):boolean {
    return this.isOpen = arguments.length ? !!open : !this.isOpen;
  }

  public focusDropdownEntry(keyCode:number):void {
    // If append to body is used.
    let hostEl = this.menuEl ?
      this.menuEl.nativeElement :
      this.el.nativeElement.getElementsByTagName('ul')[0];

    if (!hostEl) {
      // todo: throw exception?
      return;
    }

    let elems = hostEl.getElementsByTagName('a');
    if (!elems || !elems.length) {
      // todo: throw exception?
      return;
    }

    // todo: use parseInt to detect isNumber?
    // todo: or implement selectedOption as a get\set pair with parseInt on set
    switch (keyCode) {
      case (40):
        if (typeof this.selectedOption !== 'number') {
          this.selectedOption = 0;
          break;
        }

        if (this.selectedOption === elems.length - 1) {
          break;
        }

        this.selectedOption++;
        break;
      case (38):
        if (typeof this.selectedOption !== 'number') {
          return;
        }

        if (this.selectedOption === 0) {
          // todo: return?
          break;
        }

        this.selectedOption--;
        break;
      default:
        break;
    }

    elems[this.selectedOption].focus();
  }

  public focusToggleElement():void {
    if (this.toggleEl) {
      this.toggleEl.nativeElement.focus();
    }
  }

  public isSubmenu():boolean {
    return this.el.nativeElement.classList.contains("dropdown-submenu");
  }

  private positionDropdownMenu():void{
    let position = this._dropdownMenuPosition.position(this.el.nativeElement);
    this.renderer.setStyle(this.menuEl.nativeElement, 'right', position.right + 'px');
    this.renderer.setStyle(this.menuEl.nativeElement, 'left', position.left + 'px');
    this.renderer.setStyle(this.menuEl.nativeElement, 'top', position.top + position.height + 'px');
  }

  private addEventsListeners():void{
    window.document.addEventListener('click', this.closeDropdownBind, true);
    window.document.addEventListener('keydown', this.keybindFilterBind);
  }

  private removeEventsListeners():void{
    window.document.removeEventListener('click', this.closeDropdownBind, true);
    window.document.removeEventListener('keydown', this.keybindFilterBind);
  }

  private closeDropdown(event:any):void {
    if(!this._isOpen){
      return;
    }

    if (event && this.autoClose === DISABLED) {
      return;
    }

    if (event && this.toggleEl &&
        this.toggleEl.nativeElement === event.target) {
      return;
    }

    // MA if toggleElement contains the event target (means we are clicking toggleElement), then returns
    if (event && this.toggleEl.nativeElement.contains(event.target)) {
      return;
    }


    if (event && this.autoClose === NONINPUT &&
        this.menuEl &&
        /input|textarea/i.test((event.target as any).tagName) &&
        this.menuEl.nativeElement.contains(event.target)) {
      return;
    }

    if (event && this.autoClose === OUTSIDECLICK &&
        this.menuEl &&
        this.menuEl.nativeElement.contains(event.target)) {
      return;
    }

    // MA avoid  closing dropdown if menu-item has certain classes
    if(event && this.menuEl && this.menuEl.nativeElement.contains(event.target)) {
      let menuItem = this.getParentMenuItem(event);
      if(!menuItem){
        return; // click within the menu body but no on an item (as in clicking separator)
      }
      if(menuItem.classList.contains("non-selectable") ||
          menuItem.classList.contains("dropdown-submenu") ||
          menuItem.classList.contains("inactive")){
        return;
      }
    }

    this.isOpen = false;
  }

  private keybindFilter(event:KeyboardEvent):void {
    if (event.which === 27) {
      this.focusToggleElement();
      this.closeDropdown(void 0);
      return;
    }

    if (this.keyboardNav && this.isOpen &&
        (event.which === 38 || event.which === 40)) {
      event.preventDefault();
      event.stopPropagation();
      this.focusDropdownEntry(event.which);
    }
  }

  private getParentMenuItem(event:any){
    let startElement = event.target;
    let parentElement = startElement;
    while (parentElement && parentElement != this.menuEl.nativeElement) {
      if (parentElement.classList.contains("menuitem")) {
        return parentElement;
      }
      parentElement = parentElement.parentElement;
    }
    return null;
  }

}
