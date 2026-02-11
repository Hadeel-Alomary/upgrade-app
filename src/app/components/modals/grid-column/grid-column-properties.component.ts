import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';

import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';

import {ChannelListener} from '../shared/channel-listener';

import {ConfirmationCaller, ConfirmationRequest} from '../popup/confirmation/confirmation.component';

import {AppModeStateService, AuthorizationService, ChannelRequest, ChannelRequestType, LanguageService, SharedChannel} from '../../../services/index';
import {AppBrowserUtils} from '../../../utils';
import {ColumnDefinition} from '../../../services/slick-grid/slick-grid-columns.service';
import {MarketWatchCategory, MarketWatchCategoryType} from '../../marketwatch/market-watch-category';
import {FeatureType} from '../../../services/auhtorization/feature';
import {GridBoxType} from '../../shared/grid-box';

const isEqual = require("lodash/isEqual");

@Component({
    selector: 'grid-column-properties',
    templateUrl:'./grid-column-properties.component.html',
    styleUrls:['./grid-column-properties.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders:[BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class GridColumnPropertiesComponent extends ChannelListener<GridColumnPropertiesRequest> implements ConfirmationCaller, OnDestroy {

    @ViewChild("propertiesModal") public propertiesModal: ModalDirective;

     selectedColumnIds:string[];
     outSelectBoxSelection:ColumnDefinition[] = [];
     inSelectBoxSelection:ColumnDefinition[] = [];

     categories: MarketWatchCategory[];
     selectedCategory: number;
     gridBoxType: GridBoxType;

    constructor( public cd:ChangeDetectorRef, public sharedChannel:SharedChannel, public languageService:LanguageService,public authorizationService: AuthorizationService, public appModeStateService: AppModeStateService){
        super(sharedChannel, ChannelRequestType.GridColumnProperties);
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    public isCategorySelected(category: MarketWatchCategory): boolean {
        return category.type == this.selectedCategory;
    }

    public onCategoryTypeChange(newCategory: string) {
        this.selectedCategory = +newCategory;
    }

    /* channel request callbacks */

    onConfirmation(confirmed:boolean){
        if(confirmed) {
            this.selectedColumnIds = this.channelRequest.defaultGridColumns.slice(0);
        }
        this.propertiesModal.show();
        this.cd.markForCheck();
    }

    /* channel requests */

    protected onChannelRequest() {
        this.propertiesModal.show();
        this.selectedColumnIds = this.channelRequest.selectedGridColumns.slice(0);
        this.categories = this.channelRequest.categories;
        this.gridBoxType = this.channelRequest.gridBoxType;
        if (this.categories && this.categories.length > 0) {
            this.selectedCategory = this.categories[0].type;
        }
        this.cd.markForCheck();
    }

    /* template events */

     onOutSelectBoxSelection(event:ColumnDefinition | ColumnDefinition[]){
        this.outSelectBoxSelection = Array.isArray(event) ? event : [event];
    }

     onInSelectBoxSelection(event:ColumnDefinition | ColumnDefinition[]){
        this.inSelectBoxSelection = Array.isArray(event) ? event : [event];
    }

     onDoubleClickOutSelectBox(column:ColumnDefinition) {
        this.selectedColumnIds.push(column.id);
    }

     onDoubleClickInSelectBox(column:ColumnDefinition) {
        this.selectedColumnIds.splice(this.selectedColumnIds.indexOf(column.id), 1);
    }

     onAddColumn() {
        this.outSelectBoxSelection.forEach(column => this.selectedColumnIds.push(column.id));
        this.outSelectBoxSelection = [];
    }

     onRemoveColumn() {
        this.inSelectBoxSelection.forEach(column => this.selectedColumnIds.splice(this.selectedColumnIds.indexOf(column.id), 1));
        this.inSelectBoxSelection = [];
    }

     onOrderColumnsUp() {
        if(this.inSelectBoxSelection.length == 1){
            let selectedColumnId = this.inSelectBoxSelection[0].id;
            if(selectedColumnId == this.selectedColumnIds[0]) {
                return; // first element in array
            }
            let index = this.selectedColumnIds.indexOf(selectedColumnId);

            let previousColumnId = this.selectedColumnIds[index - 1];
            let defColumn = this.channelRequest.definitions.find(col => col.id == previousColumnId)
            if(defColumn.excludeInProperties){
                // Ehab: When having a fixed column then click order top multiple times, that's cause the ordered column will be on the top(first column) before the fixed column(s) which is wrong.
                return;
            }
            this.selectedColumnIds.splice(index, 1);
            this.selectedColumnIds.splice(index - 1, 0, selectedColumnId);
        }
    }

     onOrderColumnsDown() {
        if(this.inSelectBoxSelection.length == 1){
            let selectedColumnId = this.inSelectBoxSelection[0].id;
            if(selectedColumnId == this.selectedColumnIds[this.selectedColumnIds.length - 1]) {
                return; // last element in array
            }
            let index = this.selectedColumnIds.indexOf(selectedColumnId);
            this.selectedColumnIds.splice(index, 1);
            this.selectedColumnIds.splice(index + 1, 0, selectedColumnId);
        }
    }

     onRestoreOriginalSettings() {
        let message:string = this.languageService.translate("هل تريد استعادة إعدادات الأعمدة الأصلية؟");
        let confirmationRequest:ConfirmationRequest = {type: ChannelRequestType.Confirmation, messageLine: message,  caller: this};
        this.sharedChannel.request(confirmationRequest);
        this.propertiesModal.hide();
    }

    onDone() {
        let changed: boolean = !isEqual(this.channelRequest.selectedGridColumns, this.selectedColumnIds);
        if (changed) {
            let isMarketwatchProperties = this.gridBoxType == GridBoxType.Marketwatch;
            if (isMarketwatchProperties && this.isUnAuthorizedMarketWatchColumns()) {
                this.authorizationService.authorize(FeatureType.SUBSCRIBED_COLUMNS, () => {
                    this.channelRequest.caller.onGridColumnsChange(this.selectedColumnIds);
                });
            } else {
                this.channelRequest.caller.onGridColumnsChange(this.selectedColumnIds);
            }
        }
        this.propertiesModal.hide();
    }

    private isUnAuthorizedMarketWatchColumns() {
         if(this.authorizationService.isAdvanceSubscriber() || this.authorizationService.isProfessionalSubscriber()) {
             return false;
         } else if (this.authorizationService.isBasicSubscriber()) {
             for (let column of this.inColumns) {
                 if (['technicalscope'].includes(column.id)) {
                     return true;
                 }
             }
             return false;
        } else { //Visitor OR Register
             let freeColumnIds: string[] = ['previousClose', 'issuedshares', 'parvalue', 'liquidityFlow', 'liquidityNet', 'liquidityInflowPercent'];
             let freeColumnCategories: MarketWatchCategoryType[] = [MarketWatchCategoryType.EssentialColumn];
             for (let column of this.inColumns) {
                 if (!freeColumnCategories.includes(column.category) && !freeColumnIds.includes(column.id)) {
                     return true;
                 }
             }
             return false;
        }
        return true;
    }

    /* template helpers */

     get inColumns():ColumnDefinition[] {
        let defs = this.selectedColumnIds.map(c => this.channelRequest.definitions.find(d => d.id == c));
        return defs.filter(d => !d.excludeInProperties); // remove columns that are excluded
    }

     get outColumns():ColumnDefinition[] {
         let columns = this.appModeStateService.isDerayahMode() ? this.channelRequest.definitions.filter(column => column.id != 'technicalscope') : this.channelRequest.definitions;
         let defs = columns.filter(d => d.name && !this.selectedColumnIds.includes(d.id) && (!d.category || (d.category  && d.category == this.selectedCategory)));
         return defs.filter(d => !d.excludeInProperties); // remove columns that are excluded
    }

    public getHeight(): string {
         if(!AppBrowserUtils.isMobile()){
             return this.categories ? '545': '510';
         }else {
             return this.categories ? '495': '460';
         }
    }

    getSelectBoxWidth():string {
         return AppBrowserUtils.isMobile() ? "100%" : "200";
    }

    getSelectBoxHeight():number {
        return AppBrowserUtils.isMobile() ? 330 : 350;
    }


}

export interface GridColumnPropertiesRequest extends ChannelRequest {
    caller: GridColumnPropertiesCaller,
    definitions: ColumnDefinition[],
    defaultGridColumns: string[],
    selectedGridColumns: string[],
    gridBoxType: GridBoxType
    categories?: MarketWatchCategory[]
}

export interface GridColumnPropertiesCaller {
    onGridColumnsChange(newGridColumns:string[]):void;
}
