export interface FlashMessage {
    type: FlashMessageType,
    duration: number,
    messageText: string,
    buttonText?: string,
    buttonUrl?: string,
    buttonCb?: () => void
}

export enum FlashMessageType {
    INFO, WARNING, ERROR, SUCCESS, NOTICE
}
