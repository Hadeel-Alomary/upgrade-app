import { Pipe } from "@angular/core";

@Pipe({name: 'stripHtml'})
export class  StripHtmlTagsPipe {
    transform(value:string) {
        //NK https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
        let tmpElement = document.createElement("DIV");
        tmpElement.innerHTML = value;
        return tmpElement.textContent || tmpElement.innerText || "";
    }
}
