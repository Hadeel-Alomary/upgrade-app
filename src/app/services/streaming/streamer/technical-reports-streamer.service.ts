import {Subject} from 'rxjs';
import {HeartbeatMessage, LiquidityMessage, MessageType} from '../shared/index';
import {MarketUtils, Tc} from '../../../utils/index';
import {HeartbeatManager} from './heartbeat-manager';
import {AbstractStreamer} from './abstract-streamer';
import {Market} from '../../loader';
import {DebugModeService} from '../../debug-mode';

export class TechnicalReportsStreamer extends AbstractStreamer{

    private liquidityStreamer:Subject<LiquidityMessage>;
    private market:Market;

    constructor(heartbeatManager:HeartbeatManager, private streamerMarket:Market, private debugModeService:DebugModeService){

        super(heartbeatManager, 'TECHNICAL_REPORTS_' + streamerMarket.abbreviation);

        this.market = streamerMarket;
        this.liquidityStreamer = new Subject();

        if(this.debugModeService.connectToDebugStreamer()) {
            this.initChannel(this.debugModeService.getDebugStreamerUrl(), false);
        } else {
            this.initChannel(this.market.technicalReportStreamingUrl, false);
        }
    }

    protected getHeartBeatTopic(): string {
        return 'HB.HB.GP';
    }

    onDestroy() {
        super.onDestroy();
    }

    public getLiquidityStreamer():Subject<LiquidityMessage>{
        return this.liquidityStreamer;
    }

    public subscribeLiquidity(intervalString: string, market: string) {
        if(market !== 'USA' && market !== 'FRX') {
            this.subscribeTopic(`${intervalString}.liquidity.${market}`);
        }
    }

    protected onMessageReceive(message:{[key:string]:unknown}){
        let messageType:MessageType = this.getMessageType(message['topic'] as string);
        switch (messageType){
            case MessageType.LIQUIDITY:
                this.processLiquidityMessage(message as {[key:string]:string});
                break;
            case MessageType.HEARTBEAT:
                this.processHeartbeatMessage(message as unknown as HeartbeatMessage);
                break;
            default:
                Tc.error('unknown message type: ' + MessageType[messageType]);
        }
    }

    protected processLiquidityMessage(message: {[key:string]:string}){
        let topicParts: string[] = MarketUtils.splitTopic(message['topic']);
        let liquidityMessage: LiquidityMessage = {
            topic: message['topic'],
            symbol: `${message['symbol']}.${topicParts[2]}`,
            interval: topicParts[0],
            time: message['time'],
            percent: message['percent'],
            inflowAmount: message['inf-amnt'],
            inflowVolume: message['inf-vol'],
            outflowAmount: message['outf-amnt'],
            outflowVolume: message['outf-vol'],
            netAmount: message['net-amnt'],
            netVolume: message['net-vol']
        };
        this.liquidityStreamer.next(liquidityMessage);
    }
}
