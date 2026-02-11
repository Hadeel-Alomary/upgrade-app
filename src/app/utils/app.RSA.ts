// https://github.com/stevedomin/jsbn

export class AppRSA {

    static encrypt(messageToEncrypt: string, publicKeyModulus: string, publicKeyExponent: string): string {
        let rsa = new RSAKey();
        rsa.setPublic(publicKeyModulus, publicKeyExponent);

        return rsa.encrypt(messageToEncrypt);
    }

}
