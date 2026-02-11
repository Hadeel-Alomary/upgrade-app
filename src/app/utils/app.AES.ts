// https://github.com/stevedomin/jsbn

import {defer, Observable} from 'rxjs';
import {AppStringUtils} from './app.string.utils';

export class AppAES {

  public static encrypt(stringToEncrypt: string, publicKey: string): Observable<string> {
    return defer(() => {
      // Convert hex string to Uint8Array
      const keyBytes = AppStringUtils.convertHexStringToByteArray(publicKey) as Uint8Array;

      const inputBytes = new TextEncoder().encode(stringToEncrypt);

      const iv = new Uint8Array(16); // AES-CBC IV
      iv.fill(0);

      // Import the key for AES-CBC
      return window.crypto.subtle.importKey(
        'raw',
        keyBytes as unknown as ArrayBuffer, // ← Type-safe cast to ArrayBuffer
        { name: 'AES-CBC' } as AesKeyAlgorithm,
        false,
        ['encrypt']
      ).then(cryptoKey => {
        return window.crypto.subtle.encrypt(
          { name: 'AES-CBC', iv },
          cryptoKey,
          inputBytes
        );
      }).then(encryptedBytes => {
        const byteArray = new Uint8Array(encryptedBytes);
        let binaryString = '';
        for (let i = 0; i < byteArray.length; i++) {
          binaryString += String.fromCharCode(byteArray[i]);
        }
        return btoa(binaryString);
      });
    });
  }

}
