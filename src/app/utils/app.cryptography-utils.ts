import {defer, Observable} from 'rxjs';
// import {Tc} from "tc-web-chart-lib";

export class AppCryptographyUtils {

     public static sha1Hash(message: string): Observable<string> {
         //Ehab Important: you must open app from https url to make window.crypto.subtle working
         // Tc.assert(window.location.protocol == 'https:','To use sha1Hash you must enter app in https protocol.');
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        return defer(()=>{
            return window.crypto.subtle.digest('SHA-1', data).then(hash => {
                let result: string = '';
                const view = new DataView(hash);
                for (let i = 0; i < hash.byteLength; i += 4) {
                    result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
                }

                return result;
            })
        });
    };


    public static sha256(input: string): Observable<string> {
        return defer(() => {
            const encoder = new TextEncoder();
            const data = encoder.encode(input);

            return window.crypto.subtle.digest('SHA-256', data)
                .then(hashBuffer => {
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    return hashHex;
                });
        });
    }


}
