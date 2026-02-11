import {ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, HostListener, Injector, Input, Output, ViewContainerRef} from '@angular/core';
import { CustomTooltipComponent } from './custom-tooltip.component';
import {AppMarketInfoUtils, MarketUtils} from '../../../utils';
import {LanguageService} from '../../../services/state/language';

@Directive({
    selector: '[custom-tooltip]'
})
export class CustomTooltipDirective {
    private tooltip: HTMLElement;
    private shouldShowTooltip = false;
    private hostHovered = false;
    private tooltipHovered = false;
    private customTooltipRef: ComponentRef<CustomTooltipComponent>;
    @Input() symbol: string;
    @Input() marketAbbr: string;
    @Input() isChart: boolean = false;

    @Input() name: string = ''
    @Input() flagAnnotation: string = '';
    @Output() openCompanyFinancialStatement: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private cfResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef,
        private injector: Injector,
        private languageService: LanguageService
    ) {}

    @HostListener('mouseenter')
    onMouseEnter() {
        this.hostHovered = true;
        this.shouldShowTooltip = true;
        this.showTooltip();
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.hostHovered = false;
        setTimeout(() => {
            if (!this.hostHovered && !this.tooltipHovered) {
                this.shouldShowTooltip = false;
                this.hideTooltip();
            }
        }, 100); // Adjust the delay duration (in milliseconds) as needed
    }

    @HostListener('mouseover', ['$event'])
    onTooltipMouseOver(event: MouseEvent) {
        event.stopPropagation();
        this.tooltipHovered = true;
    }

    @HostListener('mouseout', ['$event'])
    onTooltipMouseOut(event: MouseEvent) {
        event.stopPropagation();
        this.tooltipHovered = false;
        setTimeout(() => {
            if (!this.hostHovered && !this.tooltipHovered) {
                this.shouldShowTooltip = false;
                this.hideTooltip();
            }
        }, 100);
    }

    public showTooltip() {
        if (this.customTooltipRef) {
            return;
        }

        if (this.shouldShowTooltip) {
            let customTooltipComponentFactory = this.cfResolver.resolveComponentFactory(CustomTooltipComponent);
            this.customTooltipRef = this.vcRef.createComponent(customTooltipComponentFactory, null, this.injector);

            if (!this.flagAnnotation) {
                //Market Summary doesn't have symbol so we need to use MarketAbbr as Input.
                let marketAbbr = this.marketAbbr ? this.marketAbbr : MarketUtils.marketAbbr(this.symbol);
                this.customTooltipRef.instance.symbol = this.symbol ? MarketUtils.symbolWithoutMarket(this.symbol) : '';
                this.customTooltipRef.instance.marketName = AppMarketInfoUtils.getMarketNameByAbbreviation(marketAbbr, this.languageService.arabic);
                this.customTooltipRef.instance.isChart = this.isChart;
            } else {
                this.customTooltipRef.instance.flagAnnotation = this.flagAnnotation;
                this.customTooltipRef.instance.name = this.name;
                this.customTooltipRef.instance.symbol = this.symbol;


                this.customTooltipRef.instance.openCompanyFinancialStatement.subscribe((symbol: string) => {
                    this.openCompanyFinancialStatement.emit(symbol);
                });

            }

            // Add event listeners for the tooltip element
            this.tooltip = this.customTooltipRef.location.nativeElement;
            this.tooltip.addEventListener('mouseover', this.onTooltipMouseOver.bind(this));
            this.tooltip.addEventListener('mouseout', this.onTooltipMouseOut.bind(this));
        }
    }


    public hideTooltip() {
        if (this.customTooltipRef) {
            this.customTooltipRef.destroy();
            this.customTooltipRef = null;

            // Remove event listeners for the tooltip element
            if (this.tooltip) {
                this.tooltip.removeEventListener('mouseover', this.onTooltipMouseOver.bind(this));
                this.tooltip.removeEventListener('mouseout', this.onTooltipMouseOut.bind(this));
                this.tooltip = null;
            }
        }
    }

}
