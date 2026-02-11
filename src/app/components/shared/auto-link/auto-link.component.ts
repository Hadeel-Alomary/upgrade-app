import {Component, Output, EventEmitter, ViewEncapsulation, Input, ChangeDetectionStrategy} from "@angular/core";
import { AutoLinkType } from '../../../services/index';
import { Tc, AppTcTracker } from '../../../utils/index';

@Component({
    selector: 'auto-link',
    templateUrl:'./auto-link.component.html',
    styleUrls:['./auto-link.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AutoLinkComponent  {

    @Input() autoLink: AutoLinkType = AutoLinkType.None;

    @Output() outputAutoLink = new EventEmitter();

    // MA we can't use enum values directly in template
     noneAutoLink:AutoLinkType = AutoLinkType.None;

     colorTypes:AutoLinkType[] =
        [AutoLinkType.Green, AutoLinkType.Red, AutoLinkType.Blue,
         AutoLinkType.Brown, AutoLinkType.Yellow];

     setAutoLink(autoLink:AutoLinkType){
        this.autoLink = autoLink;
        this.outputAutoLink.emit(autoLink);
        AppTcTracker.trackAutoLink();
    }

     coloredAutoLinks():AutoLinkType[] {
        return [AutoLinkType.Green,
                AutoLinkType.Red,
                AutoLinkType.Blue,
                AutoLinkType.Brown,
                AutoLinkType.Yellow];
    }

     text:{[key:string]:string} = {
        'none'   : 'لا يوجد ربط',
        'green'  : 'أخضر',
        'red'    : 'أحمر',
        'blue'   : 'أزرق',
        'brown'  : 'بني',
        'yellow' : 'أصفر'
    };

     autoLinkColor(autoLink:AutoLinkType):string {

        switch(autoLink) {
        case AutoLinkType.None:
            return 'none';
        case AutoLinkType.Green:
            return 'green';
        case AutoLinkType.Red:
            return 'red';
        case AutoLinkType.Blue:
            return 'blue';
        case AutoLinkType.Brown:
            return 'brown';
        case AutoLinkType.Yellow:
            return 'yellow';
        }

        Tc.error("unknown auto link " + autoLink);

        return null;

    }

}
