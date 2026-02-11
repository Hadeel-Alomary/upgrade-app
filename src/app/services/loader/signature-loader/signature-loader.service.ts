import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tc, AppTcTracker} from '../../../utils/index';
// import {ChartSignatureState} from '../../settings/signature/signature.service';
import {CredentialsStateService} from '../../state';


@Injectable()
export class SignatureLoader {

    constructor(private http: HttpClient){}

    // getSignature():Observable<ChartSignatureState> {
    //     return this.http.get<ChartSignatureState>(Tc.url(`/m/liveweb/signature`));
    // }
    //
    // saveSignature(signature:ChartSignatureState) {
    //     AppTcTracker.trackSaveSignature();
    //     let data:string = JSON.stringify(signature);
    //     this.http.post<SaveSignatureResponse>(Tc.url(`/m/liveweb/signature`), data).pipe(
    //         tap((res: SaveSignatureResponse) => {
    //             Tc.assert(res.success, "fail to save signature");
    //         })).subscribe();
    // }

    deleteSignature(){
        AppTcTracker.trackDeleteSignature();
        this.http.get<SaveSignatureResponse>(Tc.url(`/m/liveweb/signature/delete`)).pipe(
            tap((res: SaveSignatureResponse) => {
                Tc.assert(res.success, "fail to delete signature");
            })).subscribe();
    }

}


export interface SaveSignatureResponse {
    success: boolean
}



