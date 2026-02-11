import {Renderer2} from '@angular/core';
import {LanguageType} from '../services';
// import {LanguageType} from "../components/chart/language/language-type";

export class DomUtils {

    static getElementRectangle(element:HTMLElement):DomRectangle {
        return {top: element.offsetTop,
                left: element.offsetLeft,
                width: element.offsetWidth,
                height: element.offsetHeight};
    }

    static updateElementRectangle(renderer:Renderer2, element:HTMLElement, rectangle:DomRectangle) {
        renderer.setStyle(element, 'top', rectangle.top + "px");
        renderer.setStyle(element, 'left', rectangle.left + "px");
        renderer.setStyle(element, 'width', rectangle.width + "px");
        renderer.setStyle(element, 'height', rectangle.height + "px");
    }

    static moveElement(renderer:Renderer2, element:HTMLElement, left:number, top:number){
        renderer.setStyle(element, 'top', top + "px");
        renderer.setStyle(element, 'left', left + "px");
    }

    static isPointInElement(element:HTMLElement, x:number, y:number){
        let rectangle:DomRectangle = DomUtils.getElementRectangle(element);
        return DomUtils.isPointInRectangle(rectangle, x, y);
    }

    static isPointInRectangle(rectangle:DomRectangle, x:number, y:number):boolean{
        if(rectangle.left < x && x < (rectangle.left + rectangle.width) ) {
            if(rectangle.top < y && y < (rectangle.top + rectangle.height) ) {
                return true;
            }
        }
        return false;
    }

    static mapPointFromParentToChild(childElement:HTMLElement, parentX:number, parentY:number): {x:number, y:number} {
        let x:number = parentX - childElement.offsetLeft;
        let y:number = parentY - childElement.offsetTop;
        return {x:x, y:y};
    }

    static forceElementWithinScreenBounds(renderer:Renderer2, element:HTMLElement) {


        let elementRectangle = element.getBoundingClientRect();
        let right = +element.style.right.replace('px', '');
        let left = +element.style.left.replace('px', '');
        let top = +element.style.top.replace('px', '');

        let PADDING:number = 20;

        if( elementRectangle.left < PADDING ) {
            let outOfScreenWidth:number = PADDING - elementRectangle.left;
            let newRight = right - outOfScreenWidth;
            renderer.setStyle(element, 'right', newRight + "px");
        }

        if( window.innerWidth < (elementRectangle.left + elementRectangle.width + PADDING) ) {
            let outOfScreenWidth:number = elementRectangle.left + elementRectangle.width + PADDING - window.innerWidth;
            let newLeft = left - outOfScreenWidth;
            renderer.setStyle(element, 'left', newLeft + "px");
        }

        if( window.innerHeight < (elementRectangle.top + elementRectangle.height + PADDING) ) {
            let outOfScreenHeight = elementRectangle.top + elementRectangle.height + PADDING - window.innerHeight;
            let newTop = top - outOfScreenHeight;
            renderer.setStyle(element, 'top', newTop + "px");
        }

    }


    static isEventOutsideComponent(componentElement:HTMLElement, event:Event, excludedClasses:string[] = ['modal-content', 'modal']):boolean {

        let startElement:HTMLElement = event.target as HTMLElement;
        let parentElement:HTMLElement = startElement;
        while (parentElement) {
            if(parentElement == componentElement) {
                return true;
            }
            // check for excluded classes (as in modals and such)
            if(DomUtils.classListContainsAnyOf(parentElement.classList, excludedClasses)){
                return true;
            }
            parentElement = parentElement.parentElement;
        }
        return false;

    }

    // https://forums.asp.net/t/1726390.aspx?convert+image+to+byte+array+in+javascript
    static getBas364ImageFromImage(image:HTMLImageElement):string{
        // Create an empty canvas element
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        // Copy the image contents to the canvas
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        return DomUtils.getBase64ImageFromCanvas(canvas);
    }


    static getBase64ImageFromCanvas(canvas:HTMLCanvasElement):string{
        let dataURL = canvas.toDataURL("image/png");

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    // http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
    static hostname(url:string):string {
        var a = document.createElement('a');
        a.href = url;
        return a.hostname;
    }

    static tooltipPosition(language:LanguageType, elementTooltip:HTMLElement){
        let tooltipPosition: string = $(elementTooltip).attr("data-placement");
        if (language === LanguageType.English) {
            if(tooltipPosition === "left"){
                return "right";
            }else if(tooltipPosition === "right") {
                return "left";
            }
        }

        return tooltipPosition;
    }


    private static classListContainsAnyOf(classList: DOMTokenList, classes:string[]) {
        for(var i = 0; i < classes.length; ++i) {
            if(classList.contains(classes[i])){
                return true;
            }
        }
        return false;
    }

}

export interface DomRectangle {
    top:number,
    left:number,
    height:number,
    width:number
}
