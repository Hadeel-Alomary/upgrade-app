import {AbstractStreamer} from './abstract-streamer';
import {Subject} from 'rxjs';
import {HeartbeatMessage} from '../shared/message';
import {HeartbeatManager} from './heartbeat-manager';
import {MessageType} from '../shared';
import {Tc} from '../../../utils';
import {StreamerType} from '../shared/streamerType';

export class FinancialStreamer extends AbstractStreamer {

    private financialStreamer: Subject<{ [p: string]: string }>

    constructor(heartbeatManager:HeartbeatManager) {
        super(heartbeatManager, StreamerType.Financial);
        this.financialStreamer = new Subject<{ [p: string]: string }>()
    }

    protected getHeartBeatTopic(): string {
        return 'HB.HB.all';
    }

    onDestroy() {
        super.onDestroy();
    }

    public getFinancialStreamer(): Subject<{ [p: string]: string }>{
        return this.financialStreamer;
    }

    public subscribeFinancialStreamer(topic: string): void {
        this.subscribeTopic(topic);
    }

    public unSubscribeFinancialStreamer(topic: string): void {
        this.unSubscribeTopic(topic);
    }
    protected onMessageReceive(message:{[key:string]:unknown}){
        let messageType:MessageType = this.getMessageType(message['topic'] as string);
        switch (messageType){
            case MessageType.FINANCIAL:
                this.processFinancialMessage(message as {[key:string]:string});
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message as unknown as HeartbeatMessage);
                break;
            default:
                Tc.error('unknown message type: ' + MessageType[messageType]);
        }
    }


    private processFinancialMessage(message: { [p: string]: string }) {
        this.financialStreamer.next(message)
    }
}
