import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Tc} from "../../utils/index";

export enum AutoLinkType {
    None = 1,
    Green,
    Red,
    Blue,
    Brown,
    Yellow
}


@Injectable()
export class AutoLinkService {

    private autoLinkStream: Subject<{autoLinkType:AutoLinkType, pageId:string, symbol:string}>;
    private lastSelectedSymbol: {[pageId:string]:string} = {};

    constructor(){
        this.autoLinkStream = new Subject();
    }

    getStream():Subject<{autoLinkType:AutoLinkType, pageId:string, symbol:string}> {
        return this.autoLinkStream;
    }

    push(autoLinkType:AutoLinkType, pageId:string, symbol:string):void {
        this.lastSelectedSymbol[pageId] = symbol;
        this.autoLinkStream.next({autoLinkType: autoLinkType, pageId: pageId, symbol: symbol});
    }

    getLastSelectedSymbol(pageId:string):string {
        return pageId in this.lastSelectedSymbol ? this.lastSelectedSymbol[pageId] : null;
    }

}

