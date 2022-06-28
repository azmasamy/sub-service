import { context, datetime, PersistentMap, PersistentVector } from "near-sdk-as";
import { Constants, Service, Subscriber } from "./models";

@nearBindgen
export class SubService {

  services: PersistentMap<string, Service> = new PersistentMap<string, Service>("services");
  services_ids: PersistentVector<string> = new PersistentVector<string>("services_ids");
  subscribers: PersistentVector<Subscriber> = new PersistentVector<Subscriber>("subscribers");
  admins: Array<string> = ['hamzatest.testnet'];


  private _toMillisecond(nanoSeconds: u64): u64 {
    return nanoSeconds / 1000000;
  }

  /**
   * @param discription service description
   * @param provider service provider name
   * @param expiryDate service expirty date in the following format (2020-07-10T15:00:00.000)
   */
  @mutateState()
  addService(discription: string, provider: string, expiryDate: string): Service {

    assert(this.admins.includes(context.sender), Constants.ACCESS_DENIED);
    let expiryDateTimestamp: u64 = Date.fromString(expiryDate).getTime();
    let currentTime: u64 = this._toMillisecond(context.blockTimestamp);
    assert(expiryDateTimestamp > currentTime, Constants.INVALID_EXPIRY_DATE);
    let id = (provider + '/' + currentTime.toString()).toUpperCase();

    let service = new Service(
      id,
      provider,
      discription,
      0,
      currentTime,
      expiryDateTimestamp,
    );

    this.services.set(id, service);
    this.services_ids.push(id);

    return service;
  }

  getServices(): Map<string, Service> {
    const res: Map<string, Service> = new Map<string, Service>();
    for (let i = 0; i < this.services_ids.length; i++) {
      res.set(this.services_ids[i], this.services.getSome(this.services_ids[i]));
    }
    return res;
  }

  getActiveServices(): Map<string, Service> {
    let currentTimestamp: u64 = this._toMillisecond(context.blockTimestamp);
    const res: Map<string, Service> = new Map<string, Service>();
    for (let i = 0; i < this.services_ids.length; i++) {
      if (this.services.getSome(this.services_ids[i]).expiryDate > currentTimestamp) {
        res.set(this.services_ids[i], this.services.getSome(this.services_ids[i]));
      }
    }
    return res;
  }

  /**
   * @param id service id
   */
  getServiceById(id: string): Service {
    return this.services.getSome(id);
  }

  /**
   * @param id service id
   * @param expiryDate service expirty date in the following format (2020-07-10T15:00:00.000)
   */
  @mutateState()
  renewService(id: string, expiryDate: string): Service {
    assert(this.admins.includes(context.sender), Constants.ACCESS_DENIED);
    let expiryDateTimestamp: u64 = Date.fromString(expiryDate).getTime();
    let currentTime: u64 = this._toMillisecond(context.blockTimestamp);
    assert(expiryDateTimestamp > currentTime, Constants.INVALID_EXPIRY_DATE);

    let service = this.services.getSome(id);
    service.expiryDate = expiryDateTimestamp;
    this.services.set(id, service);
    return service;
  }

  @mutateState()
  subscribe(): Subscriber {

    assert(context.attachedDeposit >= Constants.SUB_FEES, Constants.NOT_ENOUGH_CREDIT);
    let currentTimestamp: u64 = this._toMillisecond(context.blockTimestamp);
    let expiryTimestamp: u64 = currentTimestamp + Constants.calcSubDuration();
    let subscriber: Subscriber = new Subscriber();
    let subscriberIndex = 0;

    for (; subscriberIndex < this.subscribers.length; subscriberIndex++) {
      if (this.subscribers[subscriberIndex].accountId == context.sender) {
        subscriber = this.subscribers[subscriberIndex];
        break;
      }
    }

    if (subscriber.isNotEmpty()) {
      subscriber.expiryDate = expiryTimestamp;
      subscriber.servicesRedeemed = [];
      this.subscribers.replace(subscriberIndex, subscriber)
    } else {
      subscriber = new Subscriber(
        context.sender,
        currentTimestamp,
        expiryTimestamp,
        []
      );
      this.subscribers.push(subscriber);
    }
    return subscriber;
  }

  getSubscribers(): Array<Subscriber> {
    const res: Array<Subscriber> = new Array<Subscriber>();
    for (let i = 0; i < this.subscribers.length; i++) {
      res.push(this.subscribers[i]);
    }
    return res;
  }

  getActiveSubscribers(): Array<Subscriber> {
    let currentTimestamp: u64 = this._toMillisecond(context.blockTimestamp);
    const res: Array<Subscriber> = new Array<Subscriber>();
    for (let i = 0; i < this.subscribers.length; i++) {
      if (this.subscribers[i].expiryDate > currentTimestamp) {
        res.push(this.subscribers[i]);
      }
    }
    return res;
  }

  /**
   * @param serviceId service id that you want to redeem
   */
  @mutateState()
  redeem(serviceId: string): Service {
    let currentTimestamp: u64 = this._toMillisecond(context.blockTimestamp);
    let subscriber: Subscriber = new Subscriber();
    let subscriberIndex = 0;
    for (let subscriberIndex = 0; subscriberIndex < this.subscribers.length; subscriberIndex++) {
      if (this.subscribers[subscriberIndex].accountId == context.sender) {
        subscriber = this.subscribers[subscriberIndex];
      }
    }
    assert(subscriber.isNotEmpty(), Constants.NOT_SUBSCRIBER);
    assert(subscriber.expiryDate > currentTimestamp, Constants.SUBSCRIBTION_EXPIRED);
    let service = this.services.getSome(serviceId);
    assert(service.expiryDate > currentTimestamp, Constants.SERVICE_EXPIRED);
    assert(!subscriber.servicesRedeemed.includes(service.id), Constants.ALREADY_REDEEMED);

    subscriber.servicesRedeemed.push(service.id);
    service.redeemCount++;

    // update services with service
    this.services.set(service.id, service);
    // update subscribers with subscriber
    this.subscribers.replace(subscriberIndex, subscriber);

    return service;
  }

}