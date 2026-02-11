import {ChannelRequest} from '../../../../services';
import {Feature} from '../../../../services/auhtorization/feature';

// MA NEEDED TO BE IN SEPARATE CLASS TO BREAK CIRCULAR DEPENDENCY WITH AuthorizationService

export interface UpgradeMessageChannelRequest extends ChannelRequest {
    upgradeMessageType: UpgradeMessageType;
    feature?: Feature;
    isMarketAuthorized? : boolean;
    isValidFeatureCount? : boolean;
    isMarketGridBoxIncludedInPages?: boolean,
    AllowedFeatureCount? : number;
}

export enum UpgradeMessageType {
    PROFESSIONAL_SUBSCRIPTION,
    ADVANCED_SUBSCRIPTION,
    BASIC_SUBSCRIPTION
}
