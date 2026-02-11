import {GridBoxType} from "../../shared/grid-box/index";
import {DockingTree} from "./docking-tree";
import {DomRectangle} from "../../../utils/index";
import {BoxProperties} from '../../shared/grid-box/properties';

export interface DockingConfig {
    tree: DockingTree
}

export interface DockingItemConfig {
    id:string,
    type:GridBoxType,
    width: number,
    height: number,
    docked?:boolean,
    undockedRectangle?:DomRectangle,
    selected?:boolean,
    maximize?:boolean,
    beforeMaximizeRectangle?:DomRectangle,
    // MA grid can dock the first added item, if it was not "placed" before
    // this flag helps grid to track that
    placed?:boolean,
    properties:BoxProperties
}


export interface DockingItemEvent {
    id:string,
    width:number,
    height:number
}

