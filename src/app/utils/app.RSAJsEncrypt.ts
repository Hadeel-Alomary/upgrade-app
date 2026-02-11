// Based on https://codepen.io/SoftTick/pen/poGMLJm

export class AppRSAJsEncrypt {

    static encrypt(messageToEncrypt: string, publicKey: string): string {
        const jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(publicKey);
        const encryptedText = jsEncrypt.encrypt(messageToEncrypt) as string;

        return encryptedText;
    }

    static decrypt(publicKeyEncryptedMessage: string, privateKey: string): string {
        const jsEncrypt = new JSEncrypt();
        jsEncrypt.setPrivateKey(privateKey);
        const decryptedText = jsEncrypt.decrypt(publicKeyEncryptedMessage) as string;

        return decryptedText;
    }

}
