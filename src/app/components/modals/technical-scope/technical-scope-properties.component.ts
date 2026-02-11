import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {BS_VIEW_PROVIDERS, ModalDirective} from '../../../ng2-bootstrap/ng2-bootstrap';
import {ChannelListener} from '../shared';
import {ChannelRequest, ChannelRequestType, SharedChannel} from '../../../services/shared-channel';
import {TechnicalScopeCategory} from './technical-scope-category';
import {TechnicalScopeCategoryType} from '../../../services/data/technical-scope/technical-scope-signal';
import {AppBrowserUtils} from '../../../utils';

const isEqual = require("lodash/isEqual");
const difference = require("lodash/difference");

@Component({
    selector: 'technical-scope-properties',
    templateUrl: './technical-scope-properties.component.html',
    styleUrls: ['./technical-scope-properties.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [BS_VIEW_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})
export class TechnicalScopePropertiesComponent extends ChannelListener<TechnicalScopePropertiesRequest> implements OnDestroy {

    @ViewChild("propertiesModal") public propertiesModal: ModalDirective;

    selectedSignalIds: string[];
    outSelectBoxSelection: Signal[] = [];
    inSelectBoxSelection: Signal[] = [];
    allCategories: TechnicalScopeCategory[];
    selectedCategory: TechnicalScopeCategoryType;

    constructor(public cd:ChangeDetectorRef, public sharedChannel:SharedChannel) {
        super(sharedChannel , ChannelRequestType.TechnicalScopeProperties);
        this.initTechnicalScopeCategory();
    }

    ngOnDestroy() {
        this.onDestroy();
    }

    public initTechnicalScopeCategory(): void {
        this.allCategories = TechnicalScopeCategory.getAllCategories();
        this.selectedCategory = TechnicalScopeCategory.getDefaultCategory();
    }

    protected onChannelRequest(): void {
        this.propertiesModal.show();
        this.selectedSignalIds = this.getSelectedSignalsInRequest();
        this.cd.markForCheck();
    }

    private getSelectedSignalsInRequest():string[] {
        return difference(this.channelRequest.definitions.map(entry => entry.id), this.channelRequest.excludedSignals);
    }

    public isCategorySelected(category:TechnicalScopeCategory): boolean {
        return category.type == this.selectedCategory;
    }

    public onOutSelectBoxSelection(event:Signal): void {
        this.outSelectBoxSelection = Array.isArray(event) ? event : [event];
    }

    public onInSelectBoxSelection(event:Signal): void {
        this.inSelectBoxSelection = Array.isArray(event) ? event : [event];
    }

    public onDoubleClickOutSelectBox(signal:Signal): void {
        this.selectedSignalIds.push(signal.id);
        this.outSelectBoxSelection = [];
    }

    public onDoubleClickInSelectBox(signal:Signal): void {
        this.selectedSignalIds.splice(this.selectedSignalIds.indexOf(signal.id), 1);
        this.inSelectBoxSelection = [];
    }

    public onAddSignals(): void {
        this.outSelectBoxSelection.forEach(signal => this.selectedSignalIds.push(signal.id));
        this.outSelectBoxSelection = [];
    }

    public onRemoveSignals(): void {
        this.inSelectBoxSelection.forEach(signal => this.selectedSignalIds.splice(this.selectedSignalIds.indexOf(signal.id), 1));
        this.inSelectBoxSelection = [];
    }

    public onDone(): void {
        let changed: boolean = !isEqual(this.getSelectedSignalsInRequest(), this.selectedSignalIds);
        if(changed) {
            this.channelRequest.caller.onChoosingSignals(this.getExcludedSignalsIds());
        }
        this.propertiesModal.hide();
    }

    public getInSignals(): Signal[] {
        return this.selectedSignalIds.map(c => this.channelRequest.definitions.find( d => d.id == c));
    }

    public getOutSignals(): Signal[] {
        return this.channelRequest.definitions.filter(d => d.category == this.selectedCategory && !this.selectedSignalIds.includes(d.id));
    }

    private getExcludedSignalsIds(): string[] {
        return difference(this.channelRequest.definitions.map(entry => entry.id), this.selectedSignalIds);
    }

    public onCategoryTypeChange(categoryType: string): void {
       this.selectedCategory = +categoryType;
    }

    getSelectBoxHeight(): number {
        return AppBrowserUtils.isMobile() ? 360 : 400;
    }

    getSelectBoxWidth(element: HTMLElement): number {
        return AppBrowserUtils.isMobile() ? element.clientWidth : 315;
    }

}

export interface TechnicalScopePropertiesRequest extends ChannelRequest {
    caller: TechnicalScopePropertiesCaller,
    definitions: Signal[],
    excludedSignals: string[]
}

export interface  TechnicalScopePropertiesCaller {
    onChoosingSignals(excludedSignals: string[]): void;
}

interface Signal {
    id: string,
    name: string,
    category: TechnicalScopeCategoryType
}
