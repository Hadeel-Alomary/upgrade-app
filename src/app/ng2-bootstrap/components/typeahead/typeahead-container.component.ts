import {Component, ElementRef, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {TypeaheadUtils} from './typeahead-utils';
import {TypeaheadDirective} from './typeahead.directive';
import {TypeaheadOptions} from './typeahead-options.class';
import {positionService} from '../position';
import {Ng2BootstrapConfig, Ng2BootstrapTheme} from '../ng2-bootstrap-config';
import {AppBrowserUtils, StringUtils} from '../../../utils';
const TEMPLATE:any = {
  [Ng2BootstrapTheme.BS4]: `
  <div class="dropdown-menu"
       style="display: block"
      [ngStyle]="{top: top, left: left, width:width, display: display}"
      (mouseleave)="focusLost()">
      <a href="#"
         *ngFor="let match of matches"
         class="dropdown-item"
         (click)="selectMatch(match, $event)"
         [class.active]="isActive(match)"
         [innerHtml]="hightlight(match, query)"></a>
  </div>
  `,
  [Ng2BootstrapTheme.BS3]: `
  <ul class="dropdown-menu"
      style="display: block"
      [ngStyle]="{top: top, left: left, width:width, display: display}"
      (mouseleave)="focusLost()">
    <li *ngFor="let match of matches"
        [class.active]="isActive(match)">
        <a href="#" (click)="selectMatch(match, $event)" tabindex="-1" [innerHtml]="hightlight(match, query)"></a>
    </li>
  </ul>
  `
};
@Component({
  selector: 'typeahead-container',
  template: `
  <ul class="dropdown-menu typeahead-dropdown-menu"
      style="display: block"
      [ngStyle]="{top: top, left: left, width:width, display: display}"
      (mouseleave)="focusLost()">
    <li *ngFor="let match of matches"
        [class.active]="isActive(match)"
        (mouseenter)="selectActive(match)"
        [style.direction]="getTextDirection(match)">
        <a href="#" (click)="selectMatch(match, $event)" (touchstart)="selectMatchOnTouchStart(match, $event)" tabindex="-1" [innerHtml]="hightlight(match, query)"></a>
    </li>
  </ul>
  `,
  encapsulation: ViewEncapsulation.None
})
export class TypeaheadContainerComponent {
  public parent:TypeaheadDirective;
  public query:any;
  public element:ElementRef;
  public isFocused:boolean = false;
  private _active:any;
  private _matches:Array<any> = [];
  public _field:string;
  public top:string;
  public left:string;
  public width:string;
  public display:string;
  public placement:string;

  public constructor(element:ElementRef, options:TypeaheadOptions, private cd:ChangeDetectorRef, private domSanitizer:DomSanitizer) {
    this.element = element;
    Object.assign(this, options);
  }

  public get matches():Array<string> {
    return this._matches;
  }

  public set matches(value:Array<string>) {
    this._matches = value;
    if (this._matches.length > 0) {
      this._active = this._matches[0];
    }
    this.cd.markForCheck();
  }

  public set field(value:string) {
    this._field = value;
  }

  public position(hostEl:ElementRef):void {
    this.display = 'block';
    this.top = '0px';
    this.left = '0px';
    let p = positionService
      .positionElements(hostEl.nativeElement,
        this.element.nativeElement.children[0],
        this.placement, false);
    this.top = p.top + 'px';
    this.left = (p.left < 3 ? 3: p.left) + 'px';
    this.width = hostEl.nativeElement.offsetWidth + 'px';
  }

    private getTextDirection(name: string): string {
        let isEnglishCompanyName: boolean = StringUtils.hasOnlyAsciiCharacters(name);
        return isEnglishCompanyName ? 'ltr' : 'rtl';
    }

    public selectActiveMatch():void {
    this.selectMatch(this._active);
  }

  public prevActiveMatch():void {
    let index = this.matches.indexOf(this._active);
    this._active = this.matches[index - 1 < 0
      ? this.matches.length - 1
      : index - 1];
  }

  public nextActiveMatch():void {
    let index = this.matches.indexOf(this._active);
    this._active = this.matches[index + 1 > this.matches.length - 1
      ? 0
      : index + 1];
  }

  protected selectActive(value:any):void {
    this.isFocused = true;
    this._active = value;
  }

  protected hightlight(item:any, query:any):SafeHtml {
    let itemStr:string = (typeof item === 'object' && this._field
      ? item[this._field]
      : item).toString();
    let itemStrHelper:string = (this.parent.typeaheadLatinize
      ? TypeaheadUtils.latinize(itemStr)
      : itemStr).toLowerCase();
    let startIdx:number;
    let tokenLen:number;
    // Replaces the capture string with the same string inside of a "strong" tag
    if (typeof query === 'object') {
      let queryLen:number = query.length;
      for (let i = 0; i < queryLen; i += 1) {
        // query[i] is already latinized and lower case
        startIdx = itemStr.indexOf(query[i]);
        tokenLen = query[i].length;
        if (startIdx >= 0 && tokenLen > 0) {
          itemStr = this.strongify(itemStr, startIdx, tokenLen);
          itemStrHelper = itemStrHelper.substring(0, startIdx) + '        ' + ' '.repeat(tokenLen) + '         ' + itemStrHelper.substring(startIdx + tokenLen);
        }
      }
    } else if (query) {
      // query is already latinized and lower case
      startIdx = itemStrHelper.indexOf(query);
      tokenLen = query.length;
      if (startIdx >= 0 && tokenLen > 0) {
        itemStr = this.strongify(itemStr, startIdx, tokenLen);
      }
    }
    return this.domSanitizer.bypassSecurityTrustHtml(itemStr);
  }

  private strongify(itemStr:string, startIdx:number, tokenLen:number):string{
    // MA in Arabic language, you cannot "strongify" part of the word without breaking its boundaries.
    // Therefore, we need to add the next Zero-width joiner to get it working properly
    // https://en.wikipedia.org/wiki/Zero-width_joiner

    let nonCursiveCharacters:string[] = ['ا','أ','إ','ر','ز','د','ذ','و', ' '];

    let notFirstLetter:boolean = 1 < startIdx;
    let notLastLetter:boolean = startIdx + tokenLen < itemStr.length;
    let canJoinWithLetterBefore = !nonCursiveCharacters.includes(itemStr[startIdx - 1]);
    let canJoinWithLetterAfter = !nonCursiveCharacters.includes(itemStr[startIdx + tokenLen - 1]);

    let firstZeroWidthJoiner:string = ( notFirstLetter && canJoinWithLetterBefore) ? '&#8205;' : '';
    let lastZeroWidthJoiner:string = ( notLastLetter && canJoinWithLetterAfter )  ? '&#8205;' : '';

    return itemStr.substring(0, startIdx) + firstZeroWidthJoiner +
      '<strong>' + firstZeroWidthJoiner + itemStr.substring(startIdx, startIdx + tokenLen) + lastZeroWidthJoiner + '</strong>' +
      lastZeroWidthJoiner + itemStr.substring(startIdx + tokenLen);
  }

  public focusLost():void {
    this.isFocused = false;
  }

  public isActive(value:any):boolean {
    return this._active === value;
  }


  private selectMatchOnTouchStart(value:any, e:Event = void 0):boolean {
      // MA for iPhone, and maybe due to hover in CSS, first click is not registered as a click and not fires the click
      // handler. This is why we added this handler, to fire on TouchStart instead.
      if(AppBrowserUtils.isDesktop()) {
          return;
      }
      this.selectMatch(value, e);
      (document.activeElement as any).blur(); // MA needed to close keyboard on iphone
  }

  private selectMatch(value:any, e:Event = void 0):boolean {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.parent.changeModel(value);
    setTimeout(() =>
      this.parent.typeaheadOnSelect.emit({
        item: value
      }), 0
    );
    return false;
  }
}
