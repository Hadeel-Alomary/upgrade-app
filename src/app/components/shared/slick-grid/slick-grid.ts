import {Tc, DomUtils, AppBrowserUtils} from '../../../utils/index';
import {FontSize, LanguageType, LanguageService, SlickGridFormatterService, SlickGridFormatter} from '../../../services/index';
import {ColumnDefinition} from '../../../services/slick-grid/slick-grid-columns.service';
import SlickData = Slick.SlickData;
import EventData = Slick.EventData;
import OnRowsChangedEventData = Slick.Data.OnRowsChangedEventData;
import OnRowCountChangedEventData = Slick.Data.OnRowCountChangedEventData;
import OnSortEventArgs = Slick.OnSortEventArgs;
import OnClickEventArgs = Slick.OnClickEventArgs;
import OnSelectedRowsChangedEventArgs = Slick.OnSelectedRowsChangedEventArgs;
import OnDblClickEventArgs = Slick.OnDblClickEventArgs;
import OnMouseOverEventArgs = Slick.OnMouseOverEventArgs;
import OnScrollEventArgs = Slick.OnScrollEventArgs;
import OnContextMenuEventArgs = Slick.OnContextMenuEventArgs;
import cloneDeep from 'lodash/cloneDeep';
// const cloneDeep = require("lodash/cloneDeep");

export interface SlickGridHost {
    filterGrid(item:SlickData):boolean;
    showContextMenu(item:SlickData, left:number, top:number,columnId:string):void;
    onColumnsChange(columns:ColumnDefinition[]):void;
    onGridItemSelected(item:SlickData):void;
    onGridClick(item:SlickData, left:number, top:number, row:number, cell:number, target?: EventTarget):void;
    onGridMouseOver(item:SlickData, left:number, top:number, target?: EventTarget):void;
    onGridDoubleClick(item:SlickData, columnId:string, row:number, cell:number):void;
    onGridLongPress(item:SlickData,row:number, cell:number):void;
}

export class SlickGrid<T extends GridData> {

     grid:Slick.Grid<T>;
     autoColumnSize:Slick.AutoColumnSize;
     dataView:Slick.Data.DataView<T>;
     columns:ColumnDefinition[];

     sortColumn:string;
     sortAsc:boolean;
     host:SlickGridHost;
     lastSelectedItem:T;
     ownerItems:T[];

     idField:string;

     lastShownTooltipId:string = "";
     lastShownTooltipCellId:string = "";

    slickGridFormatterService:SlickGridFormatterService;

    customToolTip: HTMLElement;
    shouldShowTooltip = false;
    hostHovered = false;
    tooltipHovered = false;

    private readonly minMomentDate = moment.utc('0001-01-01');
    private readonly maxMomentDate = moment.utc('9999-01-01');

    constructor(
        selector:string,
        columns:ColumnDefinition[],
        host:SlickGridHost,
        fontSize:FontSize,
        languageService:LanguageService,
        slickGridFormatterService:SlickGridFormatterService,
        options:Slick.GridOptions<T> = {},
        metaDataFn:Function = null){

        this.host = host;

        this.slickGridFormatterService = slickGridFormatterService;

        this.columns = this.prepareColumnsForGrid(columns);

        this.dataView = new Slick.Data.DataView();

        // MA metaDataFn can be used for custom settings, as in colSpan
        if(metaDataFn) {
            this.dataView.getItemMetadata  = (row:number):Slick.RowMetadata<T> => {
                return metaDataFn(this.dataView.getItem(row));
            };
        }

        // set rowHeight for the grid
        options['rowHeight'] = this.getRowHeightFromFontSize(fontSize);

        // MA for mobile only, force rendering immediately on scroll to avoid strong white flickers
        options['forceSyncScrolling'] = AppBrowserUtils.isMobile();

        this.grid = new Slick.Grid<T>(selector, this.dataView, this.columns, options);

        if(AppBrowserUtils.isMobile()) {
            this.autoColumnSize = new Slick.AutoColumnSize();
            this.grid.registerPlugin(this.autoColumnSize);
        }

        this.grid.setSelectionModel(new Slick.RowSelectionModel());

        this.dataView.onRowCountChanged.subscribe((e:EventData, args:OnRowCountChangedEventData) => {
            this.grid.updateRowCount();
            this.grid.render();
        });

        this.dataView.onRowsChanged.subscribe((e:EventData, args:OnRowsChangedEventData) => {
            this.grid.invalidateRows(args.rows);
            this.grid.render();
        });


        this.grid.onSort.subscribe((e:EventData, args:OnSortEventArgs<T>) => {
            // MA I am getting a click to sort back to ascending from descending.
            // instead, at this time, I like to reset sorting.
            if(this.sortAsc === false) {
                this.resetSorting();
                return;
            }
            this.sortColumn = args.sortCol.field;
            this.sortAsc = args.sortAsc;
            this.sort();
        });

        this.initTooltipHandling(languageService.getLanguage());

        this.dataView.syncGridSelection(this.grid, true);

        this.grid.onContextMenu.subscribe((e:MouseEvent, args:OnContextMenuEventArgs<T>) => {
            e.preventDefault();
            this.removeTooltip();
            let cell:Slick.Cell = this.grid.getCellFromEvent(e);
            let columnId = this.columns[args.cell].id;
            let item:T = this.dataView.getItem(cell.row);

            this.host.showContextMenu(item, e.pageX, e.pageY, columnId);
        });

        this.grid.onColumnsResized.subscribe(() => {
            this.host.onColumnsChange(this.grid.getColumns());
        });

        this.grid.onColumnsReordered.subscribe(() => {
            this.host.onColumnsChange(this.grid.getColumns());
        });

        this.grid.onClick.subscribe((e:MouseEvent, args:OnClickEventArgs<T>) => {
            let item:T = this.dataView.getItem(args.row);
            this.host.onGridClick(item, e.clientX, e.clientY, args.row, args.cell, e.target);
        });

        this.grid.onMouseOver.subscribe((e:MouseEvent) => {
            let cell: Slick.Cell = this.grid.getCellFromEvent(e);
            let item:T = this.dataView.getItem(cell.row);

            this.host.onGridMouseOver(item, e.clientX, e.clientY, e.target);
        });

        this.grid.onSelectedRowsChanged.subscribe((e:EventData, args:OnSelectedRowsChangedEventArgs<T>) => {
            if( 0 < args.rows.length ) {
                // MA onSelectedRowsChanged keeps firing all the time (could be related due to resetting
                // selection during real-time sorting, needs further research).
                // for now, only fire this if the "value" of the selection changes
                let item:T = this.dataView.getItem(args.rows[0]);
                if( item != this.lastSelectedItem ) {
                    this.lastSelectedItem = item;
                    this.host.onGridItemSelected(item);
                }
            }

        });

        this.grid.onScroll.subscribe((e:EventData, args: OnScrollEventArgs<T>) =>{
            this.removeTooltip();
        });

        this.grid.onDblClick.subscribe((e:EventData, args:OnDblClickEventArgs<T>) =>{
            let item:T = this.dataView.getItem(args.row);
            let columnId = this.columns[args.cell].id;
            this.host.onGridDoubleClick(item, columnId, args.row, args.cell);
        });

        this.initFilter();

    }

    toggleScrollable(prevent:boolean) {
        this.grid.toggleScrollable(prevent);
        this.refresh();
    }

    invalidate(){
        this.grid.invalidate();
    }

    resize() {
        this.grid.resizeCanvas();
        this.grid.invalidate();
    }

    resizeColumnWidthsBasedOnTheirData() {
        // only do column resizing for mobile devices (exclude tablets as they have wider screens)
        if(AppBrowserUtils.isMobileScreenDimensions()) {
            this.autoColumnSize.resizeAllColumns();
        }
    }

    selectItem(id:string){
        let rowIndex:number = this.dataView.getRowById(id);
        this.grid.setSelectedRows([rowIndex]);
        this.grid.scrollRowIntoView(rowIndex, false);
    }

    selectFirstVisibleItem(){
        let item = this.dataView.getItem(0);
        this.selectItem(item.id);
    }

    updateItem(item:T) {
        this.dataView.updateItem(item.id, item);
    }

    addOrUpdateItem(item:T) {
        if(this.dataView.getItemById(item.id)) {
            this.updateItem(item);
        } else {
            this.addItem(item);
        }
    }

    addItemToTop(item:T) {
        this.dataView.insertItem(0, item);
    }

    trimSize(trimmingSize:number, trimmedSize:number) {
        // MA for performance reasons, trim grid size to trimmedSize if its current size is larger than trimmingSize
        if(this.dataView.getItems().length > trimmingSize) {
            this.dataView.trimSize(trimmedSize);
        }
    }

    addItem(item:T) {
        this.dataView.addItem(item);
    }

    addItems(items:T[]) {
        this.dataView.beginUpdate();
        items.forEach(item => this.dataView.addItem(item));
        this.dataView.endUpdate();
    }

    getItemById(id:string) {
        return this.dataView.getItemById(id);
    }

    flash(item:T, upColumns:string[], downColumns:string[]){
        let rowIndex:number = this.dataView.getRowById(item.id);
        upColumns.forEach(column => {
            this.grid.flashCell(rowIndex, this.grid.getColumnIndex(column), 500, 'flashing-up');
        });
        downColumns.forEach(column => {
            this.grid.flashCell(rowIndex, this.grid.getColumnIndex(column), 500, 'flashing-down');
        });
    }

    updateCellBackground(item:T , column:string , range:number , color:string) {
        let rowIndex: number = this.dataView.getRowById(item.id);
        let columnIndex : number = this.grid.getColumnIndex(column);

        let cell = $(this.grid.getCellNode(rowIndex, columnIndex));
        cell.css('background', `linear-gradient(to right, ${color} ${range}%, transparent ${range}%)`);
    }

    getMaxAbsValueInColumn(columnName:string) : number {
        let filteredItems = this.dataView.getFilteredItems().map(item => Math.abs(item[columnName]));

        return Math.max(...filteredItems);
    }

    public getCellWidth(item:T , column:string): number {
        let rowIndex: number = this.dataView.getRowById(item.id);
        let columnIndex : number = this.grid.getColumnIndex(column);

        let cellBox = this.grid.getCellNodeBox(rowIndex , columnIndex);
        return Math.abs(cellBox.left - cellBox.right);
    }

    beginUpdate() {
        this.dataView.beginUpdate();
    }

    endUpdate() {
        this.dataView.endUpdate();
    }

    refresh() {
        this.dataView.refresh();
    }

    setItems(items:T[], idProperty:string = "id"){
        this.ownerItems = items;
        this.idField = idProperty;
        this.initDataViewItems();
    }

    sortIfNeeded(changedColumns:string[]){
        if(changedColumns.includes(this.sortColumn)){
            this.sort();
        }
    }

    sortByColumn(column: string, isAsc: boolean){
        this.sortColumn = column;
        this.sortAsc = isAsc;
        this.sort();
    }

    setColumns(columns:ColumnDefinition[]) {
        this.columns = this.prepareColumnsForGrid(columns);
        this.grid.setColumns(this.columns);
    }

    numberOfRows():number {
        return this.dataView.getLength();
    }

    removeTooltip() {
        if(this.lastShownTooltipId) {
            $("#" + this.lastShownTooltipId).remove();
            this.lastShownTooltipId = null;
            this.lastShownTooltipCellId = null;
        }
    }

    destroy() {
        this.grid.destroy();
    }

     resetSorting() {
        // reset my sort state
        this.sortAsc = null;
        this.sortColumn = null;
        // reset sorting in grid
        this.grid.setSortColumns([]);
        // reset items, so I can reset DataView to orignal sort state
        this.initDataViewItems();
    }

    public resetGrid(): void {
        this.setColumns([]);
        this.setItems([]);
        // Ehab Needed because when using setItems the grid is automatically select the last selected item
        // Ehab So if listen on onGridItemSelected you will get wrong item selected.
        this.selectItem('');
    }

     initDataViewItems(){
        // MA slice for cloning array http://stackoverflow.com/questions/3978492/javascript-fastest-way-to-duplicate-an-array-slice-vs-for-loop
        // MA clone is needed since we will re-ordering the items and such, and we don't want to affect other screens displaying same items
        let clone:T[] = this.ownerItems.slice();
         //NK Tell the grid to make the "idField" its unique id
         //NK the default value for it is 'id'
        this.dataView.setItems(clone, this.idField);
    }

    getOptions():Slick.GridOptions<T> {
        return this.grid.getOptions();
    }

    setOptions(options:Slick.GridOptions<T>) {
        // MA https://stackoverflow.com/questions/11459194/updating-slickgrid-options-after-initialization
        this.grid.setOptions(options);
        this.resize();
    }

     private prepareColumnsForGrid(columns:ColumnDefinition[]){

        let clone = cloneDeep(columns); // clone (to decouple)

        clone.forEach( (column:ColumnDefinition) => {
            // MA reflect any cssClasses on the header as well
            if(column.cssClass){
                column.headerCssClass = column.cssClass;
            }
            // MA init "formatter" function from formatterTypes that are defined in column definition
            if(column.formatterTypes) {
                column.formatter = this.slickGridFormatterService.getFormatter(column.formatterTypes);
            }
            column.toolTip = column.name; // Add tooltip

            if(AppBrowserUtils.isMobile()){
                column.name = column.mobileName ? column.mobileName : column.name
            }
        });

        return clone;

    }

    // https://github.com/mleibman/SlickGrid/wiki/DataView
     sort() {
        if(!this.sortColumn) return;
        let column:ColumnDefinition = this.columns.find((column:ColumnDefinition) => column.field == this.sortColumn);

        if(!column) return; // to prevent sortType of undefined error if sort column is hidden.
        var numberComparer = (a:T, b:T) => {
            if(isNaN(a[this.sortColumn] as number) && isNaN(b[this.sortColumn] as number)) {
                return (a['id'] > b['id']) ? 1 : -1; // consistent sorting when both are NaNs
            }
            if(isNaN(b[this.sortColumn] as number)){
                return this.sortAsc ? -1 : 1; // always push NaN to the end
            }
            if(isNaN(a[this.sortColumn] as number)){
                return this.sortAsc ? 1 : -1; // always push NaN to the end
            }
            if(a[this.sortColumn] == b[this.sortColumn]){ // consistent, for same value, sort by id
                return (a['id'] > b['id']) ? 1 : -1;
            }
            return (+(a[this.sortColumn] as string) > +(b[this.sortColumn] as string)) ? 1 : -1;
        }

        var stringComparer = (a:T, b:T) => {
            let isObjectData = typeof(a[this.sortColumn]) == 'object' && typeof(b[this.sortColumn]) == 'object';

            // Assert that object has 'name' property if it's an object
            if (isObjectData) {
                Tc.assert('name' in a[this.sortColumn], `a.${this.sortColumn} must contain a 'name' property`);
                Tc.assert('name' in b[this.sortColumn], `b.${this.sortColumn} must contain a 'name' property`);
            }


            let hasName = isObjectData ? a[this.sortColumn].name !== undefined : false;

            let aSortColumn: string = hasName ? a[this.sortColumn].name : a[this.sortColumn];
            let bSortColumn: string = hasName ? b[this.sortColumn].name : b[this.sortColumn];

            let aString = this.isEmpty(aSortColumn) ? '' : (aSortColumn  as string).toLowerCase();
            let bString = this.isEmpty(bSortColumn) ? '' : (bSortColumn  as string).toLowerCase();

            if(aString == bString){ // consistent, for same value, sort by id
                return (a['id'] > b['id']) ? 1 : -1;
            }

            return aString > bString ? 1 : -1;
        }

        var fieldComparer = (a:T, b:T) => {

            let field1 = a[this.sortColumn] as GridSortingField;
            let field2 = b[this.sortColumn] as GridSortingField;
            let value1 = field1 ? field1[column['sortField']] : '';
            let value2 = field2 ? field2[column['sortField']] : '';

            if(value1 == value2){ // consistent, for same value, sort by id
                return (a['id'] > b['id']) ? 1 : -1;
            }
            return (value1 > value2) ? 1 : -1;
        }


        var twoFieldsComparer = (a:T, b:T) => {
            let field1RowA = a[column['sortField1']] as GridSortingField;
            let field1RowB = b[column['sortField1']] as GridSortingField;

            let field2RowA = a[column['sortField2']] as GridSortingField;
            let field2RowB = b[column['sortField2']] as GridSortingField;


            let field1Value1 = field1RowA ? field1RowA[column['sortField']] : '';
            let field1Value2 = field1RowB ? field1RowB[column['sortField']] : '';
            let field2Value1 = field2RowA ? field2RowA[column['sortField']] : '';
            let field2Value2 = field2RowB ? field2RowB[column['sortField']] : '';

            if(field1Value1 == field1Value2){

                if(field2Value1 == field2Value2) {
                    return (a['id'] > b['id']) ? 1 : -1;
                }

                return (field2Value1 > field2Value2) ? 1 : -1;
            }

            return (field1Value1 > field1Value2) ? 1 : -1;
        };

        let dateComparer = (a:T, b:T) => {

            let field1 = a[this.sortColumn] as Date;
            let field2 = b[this.sortColumn] as Date;
            let dateFormat = column['dateFormat'];

            let value1 = field1 ? moment(field1, dateFormat) : null;
            let value2 = field2 ? moment(field2, dateFormat) : null;

            if(!value1 || !value1.isValid()) {
                value1 = this.sortAsc ? this.maxMomentDate : this.minMomentDate;
            }

            if(!value2 || !value2.isValid()) {
                value2 = this.sortAsc ? this.maxMomentDate : this.minMomentDate;
            }

            if (value1 == value2) { // consistent, for same value, sort by id
                return (a['id'] > b['id']) ? 1 : -1;
            }
            return (value1 > value2) ? 1 : -1;
        };

        let comparer = numberComparer;
        if(column['sortType'] && (column['sortType'] == 'string')) {
            comparer = stringComparer;
        }
        if(column['sortType'] && (column['sortType'] == 'field')) {
            comparer = fieldComparer;
        }
        if(column['sortType'] && (column['sortType'] == 'two-fields')){
            comparer = twoFieldsComparer;
        }
        if(column['sortType'] && (column['sortType'] == 'date')){
            comparer = dateComparer;
        }

        this.dataView.sort(comparer, this.sortAsc);

    }

    private isEmpty(value: string): boolean{
        return value == '' || value == null || value == undefined;
    }

     initFilter(){
        this.dataView.setFilterArgs({'host': this.host});
        this.dataView.setFilter(function(item:T, args:SlickFilterOptions) {
            let host:SlickGridHost = args.host;
            return host.filterGrid(item);
        });
    }

    private initTooltipHandling(language:LanguageType){
        // MA Handling bootstrap tooltip within the grid.
        // Slick cells are deleted whenever an update comes, and therefore, we cannot use bootstrap lib
        // to bind the tooltip to its element (since element will be destroyed with no notification)
        //
        // Next are steps used to handle tooltip in SlickGrid:
        // 1. Don't use data-toggle for SlickGrid tooltips and keep using it in app.component to set
        //    tooltip for elements outside the grid that play nicely with boostrap.
        //
        // 2. Instead, in grid, every tooltip cell should have grid-tooltip class to know that cell needs tooltip
        //
        // 3. use onMouseEnter and onMouseLeave by SlickGrid to show/hide the tooltip.
        //
        // 4. Handle multiple onMouseEnter which is resulted from cell being recreated. Do that through
        //    using a cellId = row + '-' + cell indices and track last cell for which tooltip displayed
        //
        // 5. When entering a new cell, if a tooltip is presented from previous cell, then "forcibly" remove the
        //    tooltip by "deleting the div"! This is done since the owner cell may be deleted by the grid,
        //    and therefore, can't guarantee that we can call "bootstrap" way to destroy
        //    which should be something as in: $(e.target).find('[title]').tooltip('destroy');
        //
        // 6. Be able to track tooltip div by ids that boostrap sets in aria-describedby attribute
        //

        this.grid.onMouseOver.subscribe((e: MouseEvent, args: OnMouseOverEventArgs<T>) => {
            let getCellIndex = function (cell: Slick.Cell) {
                return cell.row + '-' + cell.cell;
            };

            // entering same cell twice (false positive, we are already in cell)
            if (this.lastShownTooltipCellId == getCellIndex(args.grid.getCellFromEvent(e))) {
                return; // same cell with tooltip shown, do nothing
            }

            this.removeTooltip(); // if there is tooltip, it is for previous cell, so remove it

            if ((e.target as HTMLElement).classList.contains('grid-tooltip')) { // entering a cell that requires tooltip, create it
                let hasToolTip = (e.target as HTMLElement).hasAttribute('data-original-title');
                if (hasToolTip) {
                    $(e.target).tooltip({
                        trigger: 'manual', container: 'body', placement: (tooltip: HTMLElement, element: HTMLElement) => {
                            return DomUtils.tooltipPosition(language, element);
                        }
                    });
                    $(e.target).tooltip('show');
                    this.lastShownTooltipId = $(e.target).attr('aria-describedby');
                    this.lastShownTooltipCellId = getCellIndex(args.grid.getCellFromEvent(e));
                    this.hostHovered = true;
                    this.shouldShowTooltip = true;
                }

            }
        });
    }

     getRowHeightFromFontSize(fontSize:FontSize):number {

        let isMobile = AppBrowserUtils.isMobile();
        switch(fontSize){
        case FontSize.Small:
            return isMobile ? 25 : 21;
        case FontSize.Normal:
            return isMobile ? 25 : 23;
        case FontSize.Large:
            return 30;
        }

        Tc.error("unknown font size " + fontSize);

    }


}


interface SlickFilterOptions {
    host: SlickGridHost;
}

export interface GridData extends SlickData {
    id:string,
    sortColumn?:string,
    rowCustomFormatters?: SlickGridFormatter[]
}

export interface GridSortingField {
}




