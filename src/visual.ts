"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import * as tooltip from 'powerbi-visuals-utils-tooltiputils';
import * as moment from "moment";
import * as d3 from "d3";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import { VisualSettings } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private visualSettings: VisualSettings;
    private tooltipServiceWrapper: tooltip.ITooltipServiceWrapper;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.target = options.element;
        this.initTooltip(options);
    }

    public update(options: VisualUpdateOptions) {
        console.log('Visual update', options);

        const dataView = options.dataViews[0];
        this.visualSettings = VisualSettings.parse<VisualSettings>(dataView);

        // this is replaced with local date just for testing purposes
        // this.date = <Date>dataView.single.value;
        
        this.renderTooltip();

        this.target.innerHTML = '<div class="container">' + this.date + '</div>';
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }

    private renderTooltip() {
        this.tooltipServiceWrapper.addTooltip(
            d3.select(this.target),
            (tooltipEvent: tooltip.TooltipEventArgs<number>) => this.getTooltipData(),
            (tooltipEvent: tooltip.TooltipEventArgs<number>) => null);
    }

    private initTooltip(options: VisualConstructorOptions) {  
        this.tooltipServiceWrapper = tooltip.createTooltipServiceWrapper(options.host.tooltipService, options.element);
        console.log(this.tooltipServiceWrapper);
    }

    private getTooltipData(): powerbi.extensibility.VisualTooltipDataItem[] {
        // Each item in the list adds another section to the tooltip. 
        // By default, the section title (the display name) appears on the left, with the value on the right.
  
        return [
            {
                displayName: "Section 1",
                value: "This is section 1 content",
                header: "Header"
            },
            {
                displayName: "Section 2",
                value: "This is section 2",
            },
        ];
    }

    private get date() : string {
        let now = moment();
        return now.format("MMMM Do YYYY HH:mm:ss");
    }

}