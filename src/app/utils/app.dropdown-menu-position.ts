interface KeyAttribute {
}

export class AppDropdownMenuPosition {
  /**
   * Provides read-only equivalent of jQuery's position function:
   * http://api.jquery.com/position/
   */
  public position(nativeEl:HTMLElement):{width:number, height:number, top:number, left:number, right:number} {
    let elBCR = this.offset(nativeEl);
    let offsetParentBCR = {top: 0, left: 0, right:0 };
    let offsetParent = this.parentOffsetEl(nativeEl);
    if (offsetParent !== this.document) {
        let offsetParentEl = offsetParent as HTMLElement;
      offsetParentBCR = this.offset(offsetParentEl);
      offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
      offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
    } else {
      throw "expecting to have an offset parent for dropdown menu";
    }

    let boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: elBCR.top - offsetParentBCR.top,
      left: elBCR.left - offsetParentBCR.left,
      right: offsetParentBCR.right - elBCR.right
    };
  }

  /**
   * Provides read-only equivalent of jQuery's offset function:
   * http://api.jquery.com/offset/
   */
  public offset(nativeEl:HTMLElement):{width:number, height:number, top:number, left:number, right:number} {
    let boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: boundingClientRect.top + (this.window.pageYOffset || this.document.documentElement.scrollTop),
      left: boundingClientRect.left + (this.window.pageXOffset || this.document.documentElement.scrollLeft),
      right: boundingClientRect.right // MA LATER add the needed offset for scrolling (similar to left)
    };
  }

  private get window():Window {
    return window;
  }

  private get document():Document {
    return window.document;
  }

  private getStyle(nativeEl:HTMLElement, cssProp:string):string {
    // IE
    if ((nativeEl as HTMLStyledElement).currentStyle) {
      return (nativeEl as HTMLStyledElement).currentStyle[cssProp];
    }

    if (this.window.getComputedStyle) {
      return (this.window.getComputedStyle(nativeEl) as KeyAttribute)[cssProp];
    }
    // finally try and get inline style
    return (nativeEl.style as KeyAttribute)[cssProp];
  }

  /**
   * Checks if a given element is statically positioned
   * @param nativeEl - raw DOM element
   */
  private isStaticPositioned(nativeEl:HTMLElement):boolean {
    return (this.getStyle(nativeEl, 'position') || 'static' ) === 'static';
  }

  /**
   * returns the closest, non-statically positioned parentOffset of a given
   * element
   * @param nativeEl
   */
  public parentOffsetEl(nativeEl:HTMLElement):HTMLElement | Document {
    let offsetParent:HTMLElement | Document = (nativeEl.offsetParent as HTMLElement) || this.document;
    while (offsetParent && offsetParent !== this.document &&
    this.isStaticPositioned(offsetParent as HTMLElement)) {
      offsetParent = (offsetParent as HTMLElement).offsetParent as HTMLElement;
    }
    return offsetParent || this.document;
  };
}

interface HTMLStyledElement extends  HTMLElement {
    currentStyle:{[key:string]:string};
}


