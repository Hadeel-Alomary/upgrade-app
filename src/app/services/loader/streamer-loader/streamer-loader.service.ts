import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Tc} from '../../../utils/index';
import {StreamersResponse} from '../loader/loader.service';
import {TcAuthenticatedHttpClient} from "../../../utils/app.tc-authenticated-http-client.service";

@Injectable()
export class StreamerLoader {

    constructor(private http: HttpClient, private tcHttpClient: TcAuthenticatedHttpClient) {}

    public loadStreamerUrl(url:string): Observable<StreamersResponse> {
        return this.tcHttpClient.getWithAuth(Tc.url(url)).pipe(map((response:StreamersResponse) => response));
    }

}
