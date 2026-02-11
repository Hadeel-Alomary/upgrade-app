import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tc} from '../../../utils/index';

@Injectable()
export class MyDrawingsLoader {

    constructor(private http: HttpClient){}

    // saveDrawing(id:string, drawing:MyDrawing) {
    //     let data:string = JSON.stringify(drawing);
    //     this.http.post(Tc.url(`/m/liveweb/drawings/${id}`), data)
    //         .subscribe((res: SaveDrawingResponse) => {
    //             Tc.assert(res.success, "fail to save drawing");
    //         });
    // }
    //
    // deleteDrawing(id:string) {
    //     this.http.get(Tc.url(`/m/liveweb/drawings/${id}/delete`)).subscribe();
    // }
    //
    // listDrawingIds():Observable<string[]> {
    //     return this.http.get<string[]>(Tc.url('/m/liveweb/drawings/list'));
    // }
    //
    // loadCompanyDrawings(symbol: string):Observable<MyDrawing[]> {
    //     return this.http.get<MyDrawing[]>(Tc.url('/m/liveweb/drawings/' + symbol + '/all'));
    // }
}

interface SaveDrawingResponse {
    success: boolean
}
