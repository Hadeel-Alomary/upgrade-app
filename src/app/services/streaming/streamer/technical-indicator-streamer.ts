import {AbstractStreamer} from './abstract-streamer';
import {Subject} from 'rxjs';
import {HeartbeatManager} from './heartbeat-manager';
import {Market} from '../../loader/loader';
import {HeartbeatMessage, MessageType} from '../shared';
import {Tc} from '../../../utils';
import {DebugModeService} from '../../debug-mode';
import {AuthorizationService} from '../../auhtorization';

export class TechnicalIndicatorStreamer extends AbstractStreamer {
    private technicalIndicatorStreamer: Subject<Object>;

    constructor(heartbeatManager:HeartbeatManager, private streamerMarket:Market, private debugModeService:DebugModeService, private authorizationService: AuthorizationService) {
        super(heartbeatManager, `I_${streamerMarket.abbreviation}`);

        this.technicalIndicatorStreamer = new Subject<Object>();

        if(this.debugModeService.connectToDebugStreamer()) {
            this.initChannel(this.debugModeService.getDebugStreamerUrl(), true);
        } else {
            this.initChannel(streamerMarket.technicalIndicatorStreamUrl, true);
        }
    }

    onDestroy() {
        super.onDestroy();
    }

    public getTechnicalIndicator(): Subject<Object> {
        return this.technicalIndicatorStreamer;
    }

    public subscribeTechnicalIndicatorTopic(topic: string) {
        if (!this.authorizationService.isSubscriber()) {return}
        this.subscribeTopic(topic);
    }

    public unSubscribeTechnicalIndicatorTopic(topic: string) {
        this.unSubscribeTopic(topic)
    }

    protected onMessageReceive(message:{[key:string]:unknown}): void {
        let messageType:MessageType = this.getMessageType(message['topic'] as string);
        switch (messageType) {
            case MessageType.TECHNICAL_INDICATOR:
                this.processTechnicalIndicatorMessage(message  as {[key: string]:string});
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message as unknown as HeartbeatMessage);
                break;
            default:
                Tc.error('unknown message type: ' + MessageType[messageType]);
        }
    }

    private processTechnicalIndicatorMessage(message: { [key: string]: string }) {
        this.technicalIndicatorStreamer.next(message);

    }
}
