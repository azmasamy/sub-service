import { AccountId } from "./utils";



@nearBindgen
export class Service {
  id: string;
  provider: AccountId;
  title: String;
  description: String;
  redeemCount: number;
  registerationDate: u64;

  constructor(
    id: string,
    provider: AccountId,
    title: String,
    description: String,
    redeemCount: number,
    registerationDate: u64,
  ) {
    this.id = id;
    this.provider = provider;
    this.title = title;
    this.description = description;
    this.redeemCount = redeemCount;
    this.registerationDate = registerationDate;
  }
}

@nearBindgen
export class Subscriber {
  accountId: AccountId;
  subscriptionDate: u64;
  expiryDate: u64;
  servicesRedeemed: Array<String>;

  constructor(
    accountId: AccountId = '',
    subscriptionDate: u64 = 0,
    expiryDate: u64 = 0,
    servicesRedeemed: Array<String> = [],
  ) {
    this.accountId = accountId;
    this.subscriptionDate = subscriptionDate;
    this.expiryDate = expiryDate;
    this.servicesRedeemed = servicesRedeemed;
  }

  isNotEmpty(): bool {
    if (this.accountId == '')
      return false;
    else
      return true;
  }
}