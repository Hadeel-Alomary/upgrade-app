import {SlickGridFormatter} from "../slick-grid-formatter-type";
import {ColumnDefinition} from '../slick-grid-columns.service';
import {GridData} from '../../../components/shared/slick-grid/slick-grid';

export interface Formatter{
    getFormattersTypes():SlickGridFormatter[];
    format(formatter:SlickGridFormatter, row:number, cell:number, value:unknown, columnDef:ColumnDefinition, dataContext:GridData):string;
}
