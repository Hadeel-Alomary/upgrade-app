import { Pipe } from "@angular/core";

@Pipe({name: 'isoDateFormatter'})
export class IsoDateFormatterPipe {
    transform(value:string) {
        let segments = value.split('-');
        return `${segments[2]}/${segments[1]}/${segments[0]}`;                
    }    
}
