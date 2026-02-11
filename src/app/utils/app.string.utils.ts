
export class AppStringUtils {

    public static convertHexStringToByteArray(hex: string): Uint8Array {
        if (hex.startsWith('0x')) {
            hex = hex.slice(2);
        }
        let result = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            result[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return result;
    }
}
