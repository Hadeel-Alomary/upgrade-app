import {Tc} from "../../../utils/index";
import {DockingConstants} from "./docking-constants";
import {DomRectangle} from "../../../utils/index";
import {DockingNodeDirection} from './docking-node-direction';

export interface DockingTreeNode {
    leaf: boolean;
    leafId?: string;
    childA?: DockingTreeNode;
    childB?: DockingTreeNode;
    direction?: DockingNodeDirection;
    percent?: number;
    rectangle?:DomRectangle;
    separator?:DockingTreeSeparator;
}

export interface DockingTreeSeparator {
    rectangle:DomRectangle;
    horizontal: boolean;
}

export class DockingTree {

    constructor(public root:DockingTreeNode = null){}

    /* add and remove */
    
    static addItem(tree:DockingTree, id:string, neighborId:string, direction:DockingNodeDirection) {        
        
        let neighborLeaf = DockingTree.getLeaf(tree.root, neighborId);

        neighborLeaf.leaf = false;
        neighborLeaf.leafId = null;
        neighborLeaf.childA = {leaf: true, leafId: id};
        neighborLeaf.childB = {leaf: true, leafId: neighborId};
        neighborLeaf.direction = direction;
        neighborLeaf.percent = 50;
                
    }

    static deleteItem(tree: DockingTree, id:string) {
        
        let leaf = DockingTree.getLeaf(tree.root, id);

        if(leaf == tree.root){
            tree.root = null;
            return;
        }
        
        let parent = DockingTree.getParent(tree.root, leaf);
        Tc.assert(parent != null, "leaf parent cannot be null");

        let nonDeletedNode = parent.childA == leaf ? parent.childB : parent.childA;
        
        let grandParent = DockingTree.getParent(tree.root, parent);
        if(grandParent == null){
            tree.root = nonDeletedNode;
        } else {
            if(grandParent.childA == parent) {
                grandParent.childA = nonDeletedNode;
            } else {
                grandParent.childB = nonDeletedNode;
            }            
        }
        
    }

    /* accessors for leaf */
    
    static hasLeaf(tree:DockingTree, id:string):boolean {
        if(tree.root == null) { return false; }
        return DockingTree.getLeaf(tree.root, id) != null;
    }
    
    static getLeaf(node:DockingTreeNode, id:string):DockingTreeNode{

        if(node.leaf) { return node.leafId == id ? node : null; }
        
        let resultFromA = DockingTree.getLeaf(node.childA, id);
        if(resultFromA) { return resultFromA; }
        
        let resultFromB = DockingTree.getLeaf(node.childB, id);
        if(resultFromB) { return resultFromB; }

        return null;
        
    }

    /* size */
    
    static computeTreeSize(tree:DockingTree, rectangle:DomRectangle) {
        
        let rootNode = tree.root;
        
        if(rootNode){
            DockingTree.computeNodeSize(rootNode, rectangle);
        }
                
    }

    /* separator */
    
    static getSeparatorUnderPoint(node:DockingTreeNode, x:number, y:number):DockingTreeSeparator {
        
        if(node == null || node.leaf){ return null; }

        if(DockingTree.isPointInRectangle(x, y, node.separator.rectangle, DockingConstants.DOCKING_BORDER_WIDTH)) { return node.separator; };

        let resultFromA = DockingTree.getSeparatorUnderPoint(node.childA, x, y);
        if(resultFromA) { return resultFromA; }
        
        let resultFromB = DockingTree.getSeparatorUnderPoint(node.childB, x, y);
        if(resultFromB) { return resultFromB; }
        
    }
    
    static getSeparatorParent(node:DockingTreeNode, separator:DockingTreeSeparator):DockingTreeNode {

        if(node.leaf) { return null; }

        if(node.separator == separator) { return node; }
                
        let resultFromA = DockingTree.getSeparatorParent(node.childA, separator);
        if(resultFromA) { return resultFromA; }
        
        let resultFromB = DockingTree.getSeparatorParent(node.childB, separator);
        if(resultFromB) { return resultFromB; }
        
        return null;
        
    }    

    /* compute size */
    
     static computeNodeSize(node:DockingTreeNode, rectangle:DomRectangle) {

        node.rectangle = rectangle;
        
        if(node.leaf){
            return;
        }
        
        let childARectangle:DomRectangle, childBRectangle:DomRectangle, separator:DockingTreeSeparator;
        
        switch(node.direction){
        case DockingNodeDirection.Top:
            childARectangle = DockingTree.computeTopRectangle(rectangle, node.percent);
            childBRectangle = DockingTree.computeBottomRectangle(rectangle, childARectangle);
            separator = DockingTree.computeHorizontalSeparator(childARectangle, childBRectangle);
            break;
        case DockingNodeDirection.Bottom:
            childBRectangle = DockingTree.computeTopRectangle(rectangle, node.percent);
            childARectangle = DockingTree.computeBottomRectangle(rectangle, childBRectangle);
            separator = DockingTree.computeHorizontalSeparator(childBRectangle, childARectangle);
            break;
        case DockingNodeDirection.Left:
            childARectangle = DockingTree.computeLeftRectangle(rectangle, node.percent);
            childBRectangle = DockingTree.computeRightRectangle(rectangle, childARectangle);
            separator = DockingTree.computeVerticalSeparator(childARectangle, childBRectangle);
            break;
        case DockingNodeDirection.Right:
            childBRectangle = DockingTree.computeLeftRectangle(rectangle, node.percent);
            childARectangle = DockingTree.computeRightRectangle(rectangle, childBRectangle);
            separator = DockingTree.computeVerticalSeparator(childBRectangle, childARectangle);
            break;
        }
                
        DockingTree.computeNodeSize(node.childA, childARectangle);
        DockingTree.computeNodeSize(node.childB, childBRectangle);
        node.separator = separator;
        
    }

     static computeTopRectangle(parentRectangle:DomRectangle, percent:number):DomRectangle {
        return {top: parentRectangle.top,
                left: parentRectangle.left,
                width: parentRectangle.width,
                height: Math.floor(parentRectangle.height * percent * 0.01) - DockingConstants.DOCKING_BORDER_WIDTH
               };
    }

     static computeBottomRectangle(parentRectangle:DomRectangle, topRectangle:DomRectangle):DomRectangle {
        return {top: parentRectangle.top + topRectangle.height + DockingConstants.DOCKING_BORDER_WIDTH,
                left: parentRectangle.left,
                width: parentRectangle.width,
                height: parentRectangle.height - topRectangle.height - DockingConstants.DOCKING_BORDER_WIDTH
               };
    }

    
     static computeLeftRectangle(parentRectangle:DomRectangle, percent:number):DomRectangle {
        return {top: parentRectangle.top,
                left: parentRectangle.left,
                width: Math.floor(parentRectangle.width * percent * 0.01) - DockingConstants.DOCKING_BORDER_WIDTH,
                height: parentRectangle.height
               };
    }

     static computeRightRectangle(parentRectangle:DomRectangle, leftRectangle:DomRectangle):DomRectangle {
        return {top: parentRectangle.top,
                left: parentRectangle.left + leftRectangle.width + DockingConstants.DOCKING_BORDER_WIDTH,
                width: parentRectangle.width - leftRectangle.width - DockingConstants.DOCKING_BORDER_WIDTH,
                height: parentRectangle.height
               };
    }

     static computeVerticalSeparator(leftRectangle:DomRectangle, rightRectangle:DomRectangle) {
        return {
            horizontal: false,
            rectangle: {
                top: leftRectangle.top,
                left: leftRectangle.left + leftRectangle.width,
                width: rightRectangle.left - (leftRectangle.left + leftRectangle.width),
                height: leftRectangle.height
            }
        }
    }

     static computeHorizontalSeparator(topRectangle:DomRectangle, bottomRectangle:DomRectangle) {
        return {
            horizontal: true,
            rectangle: {
                top: topRectangle.top + topRectangle.height,
                left: topRectangle.left,
                width: topRectangle.width,
                height: bottomRectangle.top - (topRectangle.top + topRectangle.height)
            }
        }
    }

    /* msic */
    
     static getParent(ancestor:DockingTreeNode, child:DockingTreeNode):DockingTreeNode{

        if(ancestor.leaf) { return null; }

        if(ancestor.childA == child || ancestor.childB == child) { return ancestor; }
        
        let resultFromA = DockingTree.getParent(ancestor.childA, child);
        if(resultFromA) { return resultFromA; }
        
        let resultFromB = DockingTree.getParent(ancestor.childB, child);
        if(resultFromB) { return resultFromB; }
        
    }

     static isPointInRectangle(x:number, y:number, rectangle:DomRectangle, offset:number = 0){
        if(rectangle.left - offset < x && x < (rectangle.left + rectangle.width + offset) ) {
            if(rectangle.top - offset < y && y < (rectangle.top + rectangle.height + offset) ) {
                return true;
            }            
        }        
        return false;        
    }
    
}
