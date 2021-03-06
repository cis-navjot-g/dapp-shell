import { EscrowMessageType } from '../enums/EscrowMessageType';
import { BidMessageType } from '../enums/BidMessageType';

export interface ActionMessageInterface {
    action: EscrowMessageType | BidMessageType;
    listing: string;
    objects?: any; // todo: class for object key value pair
}
