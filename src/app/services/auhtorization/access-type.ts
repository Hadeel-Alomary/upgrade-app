// MA: ORDERING IS IMPORTANT! ORDERING SHOULD GO FROM LEAST TO MOST IMPORTANT
import {Tc} from '../../utils';

export enum AccessType{
    VISITOR = 1,
    REGISTERED = 2,
    BASIC_SUBSCRIPTION = 3,
    ADVANCED_SUBSCRIPTION = 4,
    PROFESSIONAL_SUBSCRIPTION = 5
}

export class Access {

    static accesses:Access[] = [];

    constructor(public type:AccessType, public arabic:string, public english:string){}

    static getAccess(accessType:AccessType):Access {
        let result:Access = Access.getAccesses().find(access => access.type == accessType);
        Tc.assert(result != null, "fail to find access");
        return result;
    }

    private static getAccesses():Access[] {

        if(!Access.accesses.length) {
            Access.accesses.push(new Access(AccessType.VISITOR, 'زائر', 'Visitor'));
            Access.accesses.push(new Access(AccessType.REGISTERED, 'مجاني', 'Free'));
            Access.accesses.push(new Access(AccessType.BASIC_SUBSCRIPTION, 'أساسي', 'Basic'));
            Access.accesses.push(new Access(AccessType.ADVANCED_SUBSCRIPTION, 'متقدم', 'Advanced'));
            Access.accesses.push(new Access(AccessType.PROFESSIONAL_SUBSCRIPTION, 'احترافي ', 'Professional'));
        }
        return Access.accesses;
    }

}


