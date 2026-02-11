import {Injectable, ErrorHandler} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from "rxjs";

////////////////////////////////////////////////////////////////////////////////
// MA THIS CLASS IS A COPY OF ANGULAR ONE
// The main difference is that the class log the exceptions back to the server
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class TcErrorHandler implements ErrorHandler {

    private logLines:string[] = [];

    private unauthorizedRequestStream:Subject<void>;

    constructor(private http:HttpClient) {
        window.setInterval(() => this._processExceptions(), 30 * 1000);
        this.unauthorizedRequestStream = new Subject<void>();
    }

    handleError(error:Error) {

        if( ('status' in error) && (error as ExtendedError).status == 401) {
            // authorization error, we need to relogin
            console.log("authorization error received!!!!");
            this.unauthorizedRequestStream.next();
        }

        let originalError = this._findOriginalError(error as ExtendedError);
        let originalStack = this._findOriginalStack(error as ExtendedError);
        let context = this._findContext(error as ExtendedError);

        let logData:string[] = [];

        this._log("EXCEPTION: " + this._extractMessage(error));

        if (originalError) {
            this._log("ORIGINAL EXCEPTION: " + this._extractMessage(originalError));
        }
        if (originalStack) {
            this._log('ORIGINAL STACKTRACE:');
            this._log(originalStack);
        }
        if (context) {
            this._log('ERROR CONTEXT:');
            this._log(context);
        }

        this._log('-------------------------');

    }

    getUnauthorizedRequestStream() {
        return this.unauthorizedRequestStream;
    }

    private _log(line:string) {
        console.error(line);
        this.logLines.push(line);
    }


    private _extractMessage(error:Error):string {
        return error.message ? `ERROR MESSAGE:  ${error.message}` : `ERROR:  ${error.toString()}`;
    }

    private _findContext(error:ExtendedError):string {
        if (error) {
            return error.context ? error.context :
                this._findContext(error.originalError);
        }
        return null;
    }

    private _findOriginalError(error:ExtendedError):Error {
        let e = error.originalError;
        while (e && e.originalError) {
            e = e.originalError;
        }
        return e;
    }

    private _findOriginalStack(error:ExtendedError):string {
        if (!(error instanceof Error))
            return null;
        let e = error;
        let stack = e.stack;
        while (e instanceof Error && e.originalError) {
            e = e.originalError;
            if (e instanceof Error && e.stack) {
                stack = e.stack;
            }
        }
        return stack;
    }

    private _processExceptions() {
        // if(this.logLines.length && this.credentialsService.isLoggedIn()) {
        //     let username:string = this.credentialsService.username;
        //     let version:string = Config.getVersion();
        //     if(Config.isProd()) {
        //         this.http.post(Tc.url(`/l/error/v/${version}/u/${username}`), JSON.stringify(this.logLines)).subscribe(() => {}, error => {});
        //     }
        //     this.logLines = [];
        // }
    }

}

interface ExtendedError extends Error {
    status: number,
    context: string,
    originalError:ExtendedError
}
