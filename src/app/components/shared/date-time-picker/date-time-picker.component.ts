import{
    Component,
    OnInit,
    AfterViewInit,
    Output,
    EventEmitter,
    Input,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    OnChanges,
    ChangeDetectorRef
} from '@angular/core';

import {StringUtils} from '../../../utils/index';
import DatepickerOptions = JQueryUI.DatepickerOptions;


@Component({
    selector:'date-time-picker',
    templateUrl:'./date-time-picker.component.html',
    styleUrls:['./date-time-picker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class DateTimePickerComponent implements OnInit, AfterViewInit, OnChanges{

    @Input() options:ExtendedDateTimePickerOptions;
    @Input() date:string;
    @Input() minDate:string;
    @Input() maxDate:string;
    @Input() disabled: boolean = false;
    @Output() dateChange:EventEmitter<string> = new EventEmitter<string>();

     id:string = StringUtils.guid();
     picker:JQuery;
     initiated:boolean = false;

     defaultOptions:ExtendedDateTimePickerOptions = {
        useCurrent: false,
        format:'YYYY-MM-DD',
        ignoreReadonly: true
    };

    constructor( public cd:ChangeDetectorRef){}

    ngOnInit(){
        if(!this.options){
            this.options = this.defaultOptions;
        }
        if(this.minDate) {
            this.options.minDate = this.minDate;
        }
        if(this.maxDate) {
            this.options.maxDate = this.maxDate;
        }
    }

    ngAfterViewInit(){
        this.picker = $(`#${this.id}`).datetimepicker(this.options);
        this.picker.on("dp.change", this.onDateChange.bind(this));

        this.setPickerDate();
        this.initiated = true;
    }

    ngOnChanges(){
        if(!this.initiated){
            return;
        }

        this.setPickerDate();
    }

     get format(){
        return this.options.format ? this.options.format : this.defaultOptions.format;
    }

     setPickerDate(){
        if(this.date == null) {
            this.picker.data("DateTimePicker").date(null);
        }
        let formattedValue = moment(this.date , this.format).format(this.format);
        this.picker.data("DateTimePicker").date(formattedValue);
    }


    /* Template events */

     onDateChange(e:DateChangeEvent){
        let date = moment(e.date , this.format);
        if(date.isValid()) {
            this.date = date.format(this.format);
        } else {
            this.date = null;
        }

        this.dateChange.emit(this.date);
    }

}

interface DateChangeEvent {
    date:Date;
}

export interface ExtendedDateTimePickerOptions extends DatepickerOptions{
    useCurrent?: boolean,
    format?:string,
    ignoreReadonly?: boolean
}
