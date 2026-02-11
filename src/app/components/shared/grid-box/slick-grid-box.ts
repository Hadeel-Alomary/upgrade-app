import {ChangeDetectorRef} from "@angular/core";
import {GridData, SlickGrid, SlickGridHost} from '../slick-grid/slick-grid';
import {GridBox, GridBoxProperties} from "./grid-box";
// import {GridColumnPropertiesRequest, GridColumnPropertiesCaller} from '../../modals/index';
import {ChannelRequestType, Accessor, GridColumn} from '../../../services/index';
import {AppBrowserUtils, Tc} from '../../../utils/index';
import {ColumnDefinition} from '../../../services/slick-grid/slick-grid-columns.service';
import SlickData = Slick.SlickData;
import {MarketWatchCategory} from '../../marketwatch';
import {FeatureType} from '../../../services/auhtorization/feature';
import {GridBoxType} from './grid-box-type';

import remove from 'lodash/remove';
// const remove = require("lodash/remove");

export abstract class SlickGridBox<T extends GridBoxProperties, D extends GridData> extends GridBox<T> implements SlickGridHost {

    protected slickGrid:SlickGrid<D>;

    private static freeMarketWatchColumnsForFreeUser : string[] = ['flag','news','alert','name','symbol','close','changePercent','bidPrice','bidVolume','askPrice','askVolume'];

    constructor(public  cd:ChangeDetectorRef, public accessor:Accessor) {
        super(accessor);
    }

    protected resizeSlickGrid() {
        setTimeout(() => {
            // MA resizing happens on loading, and we could destroy box by then (as in auto-closing trading windows)
            // So, don't resize if destroyed
            if(!this.isDestroyed() && this.slickGrid) {


                this.slickGrid.resize();
            }
        });
    }

    protected initSlickGrid(options:Slick.GridOptions<SlickData> = {}, metaDataFn:Function = null) {
        this.slickGrid = new SlickGrid<D>("#" + this.id,
                                       this.getColumns(),
                                       this,
                                       this.accessor.miscStateService.getFontSize(),
                                       this.accessor.languageService,
                                       this.accessor.slickGridFormatterService,
                                       options,
                                       metaDataFn);
    }

    public onResize(){
        window.setTimeout(() => {
            // MA resizing happens on loading, and we could destroy box by then (as in auto-closing trading windows)
            // So, don't resize if destroyed
            if(!this.isDestroyed() && this.slickGrid) {
                this.slickGrid.resize();
            }
        }, 0);
    }

    handleMobileRotateColumnWidth() {
        if(AppBrowserUtils.isMobile() && this.slickGrid) {
            setTimeout(()=>{
                let forceFitColumns = AppBrowserUtils.isMobileRotated();
                if(forceFitColumns) {
                    this.setGridForceFitColumns(true);
                } else {
                    this.setGridForceFitColumns(false);
                    this.slickGrid.resizeColumnWidthsBasedOnTheirData();
                }
            })
        }
    }

    /* columns - viewing and editing */

    public getDefaultColumns():GridColumn[]{
        return this.accessor.slickGridColumnsService.getDefaultColumns(this.type);
    };

    private getColumnDefinitions():ColumnDefinition[]{
        return this.accessor.slickGridColumnsService.getColumnsDefinition(this.type);
    };

    protected getColumns():ColumnDefinition[] {
        if(!this.slickGridBoxProperties.gridColumns) {
            this.slickGridBoxProperties.gridColumns  = this.getDefaultColumns();
        }
        let result:ColumnDefinition[] = this.buildColumnDefinitions(this.slickGridBoxProperties.gridColumns);
        // MA filter out any excluded columns (which is used to toggle icon columns in marketwatch)
        this.getExcludedColumns().forEach(excludedColumnId => remove(result, (d: ColumnDefinition) => d.id == excludedColumnId));
        return result;
    }

    protected getExcludedColumns():string[] {
        return [];
    }



     buildColumnDefinitions(gridColumns:GridColumn[]): ColumnDefinition[] {
        let definitions = this.getColumnDefinitions().slice(0); // clone definitions
        let result:ColumnDefinition[] = [];
        gridColumns.forEach(gridColumn => {
            let definition = definitions.find( (d:ColumnDefinition) => d.id == gridColumn.id);
            if(!definition){
                definition = this.getGridColumnBackwardCompatibilityDefinition(gridColumn.id, definitions);
            }
            if(gridColumn.width) {
                definition.width = gridColumn.width;
            } else {
                // MA for "mobile" screen, use mobileWidth if specified
                if(AppBrowserUtils.isMobile() && definition.mobileWidth) {
                    definition.width = definition.mobileWidth;
                }
            }

            // update free columns
            if(!this.accessor.authorizationService.isSubscriber()) {
                if (this.type == GridBoxType.Marketwatch)
                    definition.isFreeForRegisteredUser = SlickGridBox.freeMarketWatchColumnsForFreeUser.includes(definition.id);
                else
                    definition.isFreeForRegisteredUser = true;
            }

            result.push(definition);
        });
        return result;
    }

    public onGridColumnProperties() {
        this.accessor.authorizationService.authorize((FeatureType.MARKET_WATCH_COLUMN_SETTINGS),() => {
            // let channelRequest:GridColumnPropertiesRequest =
            //     {type: ChannelRequestType.GridColumnProperties,
            //         caller: this,
            //         definitions: this.getColumnDefinitions(),
            //         defaultGridColumns: this.getDefaultColumns().map(c => c.id),
            //         selectedGridColumns: this.slickGridBoxProperties.gridColumns.map(c => c.id),
            //         gridBoxType: this.type,
            //         categories: this.getColumnsCategories(),
            //
            //     };
            // this.accessor.sharedChannel.request(channelRequest);
        })

    }

    protected getColumnsCategories(): MarketWatchCategory[] {
        return [];
    }

    private getGridColumnBackwardCompatibilityDefinition(oldId:string, definitions:ColumnDefinition[]) {
        let newId: string;

        if (oldId == 'arabic') {
            newId = 'name';
        } else if (oldId == 'messageArabic') {
            newId = 'message';
        }  else if (oldId == 'effectOnIndex') {
            newId = 'effectIndex';
        }  else if (oldId == 'effectOnSector') {
            newId = 'effectSector';
        }  else if (oldId == 'volumeAtClosingPrice') {
            newId = 'volumeOnClosingPrice';
        }  else if (oldId == 'valueAtClosingPrice') {
            newId = 'valueOnClosingPrice';
        }  else if (oldId == 'tradesAtClosingPrice') {
            newId = 'tradesOnClosingPrice';
        } else {
            Tc.error("Unknown grid column id " + oldId);
        }

        return definitions.find(col => col.id == newId);
    }

    // implementation of GridColumnPropertiesCaller
    onGridColumnsChange(newColumns:string[]) {
        let newGridColumns:GridColumn[] = newColumns.map(c => {return {id: c}; });
        this.slickGridBoxProperties.gridColumns = newGridColumns;
        this.slickGrid.setColumns(this.getColumns());
        this.afterGridColumnsChange();
        this.cd.markForCheck();
    }

    protected afterGridColumnsChange(): void { }

    protected setGridForceFitColumns(forceFitColumns:boolean) {
        let options:Slick.GridOptions<SlickData>  = this.slickGrid.getOptions();
        if(options.forceFitColumns !== forceFitColumns){
            options.forceFitColumns = forceFitColumns;
            this.slickGrid.setOptions(options);
            this.cd.markForCheck();
        }
    }

    /* slick grid host functions */

    filterGrid(filter:D):boolean{
        return true;
    }

    onColumnsChange(slickColumns:ColumnDefinition[]) {

        // MA we need to construct new GridColumn[] to capture new ordering
        let newGridColumns:GridColumn[] = [];

        slickColumns.forEach( (gridColumn:ColumnDefinition) => {
            let column:GridColumn = this.slickGridBoxProperties.gridColumns.find( (c:GridColumn) => c.id == gridColumn.id);
            column.width = gridColumn.width; // set width
            newGridColumns.push(column);
        });

        this.slickGridBoxProperties.gridColumns = newGridColumns;
        this.resizeSlickGrid();
    }

    onGridItemSelected(item:D){ } // MA override it to handle selection

    onGridClick(item:D, left:number, top:number, row:number, column:number, target?: EventTarget){ } // MA override it to handle grid click
    onGridMouseOver(item:D, left:number, top:number, target?: EventTarget){ } // MA override it to handle grid click

    onGridDoubleClick(item:D, columnId:string, row:number, cell:number){};

    onGridLongPress(item:D,row:number, column:number){} // handle mobile grid long press

    get slickGridBoxProperties(): SlickGridBoxProperties {
        return <SlickGridBoxProperties>this.p;
    }

    /* context menu */
    contextMenu:{left:number, top:number, item:D, columnId:string} = {left:0, top:0, item: null, columnId: null};
    annotationDelayed: { left: number, top: number, item:D } = {left: 0, top: 0, item: null};
    upgradeAnnotation:  { left: number, top: number, item:D } = {left: 0, top: 0, item: null};

    showContextMenu(item:D, left:number, top:number, columnId:string) { }

    protected openContextMenu(left:number, top:number, item:D ,columnId?:string) {
        this.contextMenu = {left: left, top: top, item: item, columnId:columnId};
    }

    protected openAnnotationDelayed(left: number, top: number, item:D) {
        this.annotationDelayed = {left: left, top: top, item: item};
    }

    protected openUpgradeAnnotation(left: number, top: number, item:D) {
        this.upgradeAnnotation = {left: left, top: top, item: item};
    }

    public getContextMenuPosition():{x:number, y:number}{
        return {x: this.contextMenu.left, y:this.contextMenu.top};
    }

    public getContextMenuItem() {
        return this.contextMenu.item;
    }

    public getContextMenuColumnId() {
        return this.contextMenu.columnId;
    }

    public onContextMenu(event:MouseEvent) {
        if(AppBrowserUtils.isDesktop()) {
            this.openContextMenu(event.clientX, event.clientY, null , null);
            event.preventDefault();
            event.stopPropagation();
        }
    }
}

export interface SlickGridBoxProperties extends GridBoxProperties {
    gridColumns:GridColumn[];
}
