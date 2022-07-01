import { u128 } from "near-sdk-as";
import { Money, toYocto } from "./utils";

export class Constants {
    static ACCESS_DENIED:string = 'Access Denied';
    static INVALID_EXPIRY_DATE:string = 'Expiry date must be later than the current date';
    static NOT_SUBSCRIBER:string = 'You are not a subscriber';
    static SUBSCRIBTION_EXPIRED:string = 'Your subscribtion has expired';
    static SERVICE_EXPIRED:string = 'This service has expired';
    static ALREADY_REDEEMED:string = 'You have already redeemed this service';
    static SUB_FEES:Money = u128.from(toYocto(10));
    static CONTRACT_PROFIT:Money = u128.from(toYocto(2));
    static TOTAL_SERVICES_REVINUE:Money = u128.sub(Constants.SUB_FEES, Constants.CONTRACT_PROFIT);
    static NOT_ENOUGH_CREDIT:string = "Attached deposit must cover the subscription fees (" + Constants.SUB_FEES.toString() + " YOCTO)";
    static REDEEMS_KEY:string = 'totalRedeems';
  }