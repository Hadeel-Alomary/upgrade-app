import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    EventEmitter,
    Input,
    Output,
    OnChanges
} from "@angular/core";

import {LanguageService} from '../../../services/index';

@Component({
    standalone:true,
    selector: 'select-box',
    templateUrl:'./select-box.component.html',
    styleUrls:['./select-box.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class SelectBoxComponent implements OnChanges {

    @Input() entries:SelectionEntry[] = [];
    @Input() selection:SelectionEntry | SelectionEntry[];
    @Input() ticked:boolean = false;
    @Input() width:number;
    @Input() height:number;
    @Input() translate:boolean = false;//NK should we translate the entries

    @Output() outputSelection = new EventEmitter();
    @Output() outputDoubleClick = new EventEmitter();

    // MA double click state tracking
     lastClickTime:number = 0;
     lastSelectedEntry:SelectionEntry;

    constructor(public languageService:LanguageService){}

    ngOnChanges() {
    }

    /* template events */

    onSelect(entry:SelectionEntry) {

        // MA we used to handle double click using dblclick event.
        // However, this event is not firing correctly when we have consequent double click cases
        // which is common for select-box.
        // due to this, we are handling double-click manually within the click handler

        if( (this.lastSelectedEntry === entry) && ((Date.now() - this.lastClickTime) < 500)) {
            // same click on last entry within short duration, consider it double click
            this.outputDoubleClick.emit(entry);
            this.lastClickTime = 0;
            return;
        }

        // update doubleclick tracking state
        this.lastSelectedEntry = entry;
        this.lastClickTime = Date.now();

        // handle click
        this.selection = entry;
        this.outputSelection.emit(this.selection);

    }

    onMouseDown($event:MouseEvent){
        // MA prevent text selection -- http://stackoverflow.com/questions/880512/prevent-text-selection-after-double-click
        $event.preventDefault();
    }


    /* template helpers */

    isSelected(entry:SelectionEntry) {

        if(!this.selection){ return false; }

        let selected:boolean = false;

        if(Array.isArray(this.selection)){
            selected = this.selection.find( (e:SelectionEntry) => e == entry) != null;
        } else {
            selected = this.selection == entry;
        }

        return selected;

    }

     name(entry:SelectionEntry):string {
        if(this.translate){
            return this.languageService.translate(entry.name);
        }
        return entry.name;
    }

}

interface SelectionEntry {
    name:string
}

