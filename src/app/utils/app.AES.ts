// https://github.com/stevedomin/jsbn

import {defer, Observable} from 'rxjs';
import {AppStringUtils} from './app.string.utils';

export class AppAES {

    public static encrypt(stringToEncrypt: string, publicKey: string): Observable<string> {
        return defer(() => {
            let key = AppStringUtils.convertHexStringToByteArray(publicKey);
            let inputBytes = new TextEncoder().encode(stringToEncrypt);

            let iv = new Uint8Array(16);
            iv.fill(0);

            return window.crypto.subtle.importKey('raw', key, {name: 'AES-CBC'} as AesKeyAlgorithm, false, ['encrypt']
            ).then(cryptoKey => {
                return window.crypto.subtle.encrypt({name: 'AES-CBC', iv: iv}, cryptoKey, inputBytes);
            }).then(encryptedBytes => {
                let byteArray = new Uint8Array(encryptedBytes);
                let binaryString = '';
                for (let i = 0; i < byteArray.length; i++) {
                    binaryString += String.fromCharCode(byteArray[i]);
                }
                return btoa(binaryString);
            });
        });
    }

}
