import { context, ContractPromiseBatch, PersistentMap, PersistentVector, storage, u128 } from "near-sdk-as";
import { Constants } from "./constants";
import { Service, Subscriber } from "./models";
import { BASE_TO_CONVERT, percentageToYocto } from "./utils";

@nearBindgen
export class SubService {

  services: PersistentMap<string, Service> = new PersistentMap<string, Service>("services");
  services_ids: PersistentVector<string> = new PersistentVector<string>("services_ids");
  subscribers: PersistentVector<Subscriber> = new PersistentVector<Subscriber>("subscribers");
  admins: Array<string> = ['hamzatest.testnet'];


  private _toMillisecond(nanoSeconds: u64): u64 {
    return nanoSeconds / 1000000;
  }

  private _calcSubDuration(): u64 {
    let subDays:u64 = 30;
    let secondsInDay:u64 = 86400;
    let subMilliseconds:u64 = subDays * secondsInDay * 1000;
    return subMilliseconds;
  }

  private _percentageToYocto(x: number): u128 {
    let amountBase = (x * BASE_TO_CONVERT);
    return u128.div(percentageToYocto(u128.from(amountBase)), u128.from(BASE_TO_CONVERT));
  }

  @mutateState()
  distributeRevenue(): number {
    assert(this.admins.includes(context.sender), Constants.ACCESS_DENIED);
    let totalRedeems = storage.getPrimitive(Constants.REDEEMS_KEY, 0); 
    for (let i = 0; i < this.services_ids.length; i++) {
      let service = this.services.getSome(this.services_ids[i]);
      let percentage = service.redeemCount / totalRedeems
      if (percentage > 0) {
        ContractPromiseBatch.create(service.provider).transfer(this._percentageToYocto(percentage));
        service.redeemCount = 0;
        this.services.set(service.id, service)
      }
    }
    storage.set(Constants.REDEEMS_KEY, 0);

    return totalRedeems;
  }

    /**
   * @param provider service provider account
   * @param title service title
   * @param description service description
   */
     @mutateState()
     addService(provider:string, title:string, description:string): Service {
   
       assert(this.admins.includes(context.sender), Constants.ACCESS_DENIED);
       let currentTime: u64 = this._toMillisecond(context.blockTimestamp);
       let id = (provider + '/' + currentTime.toString()).toUpperCase();
   
       let service = new Service(
         id,
         provider,
         title,
         description,
         0,
         currentTime,
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
    let currentTime: u64 = this._toMillisecond(context.blockTimestamp);

    let service = this.services.getSome(id);
    this.services.set(id, service);
    return service;
  }

  @mutateState()
  subscribe(): Subscriber {

    assert(context.attachedDeposit >= Constants.SUB_FEES, Constants.NOT_ENOUGH_CREDIT);
    let currentTimestamp: u64 = this._toMillisecond(context.blockTimestamp);
    let expiryTimestamp: u64 = currentTimestamp + this._calcSubDuration();
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
    assert(!subscriber.servicesRedeemed.includes(service.id), Constants.ALREADY_REDEEMED);

    let totalRedeems = storage.getPrimitive(Constants.REDEEMS_KEY, 0) + 1;
    storage.set(Constants.REDEEMS_KEY, totalRedeems);
    subscriber.servicesRedeemed.push(service.id);
    service.redeemCount++;

    // update services with service
    this.services.set(service.id, service);
    // update subscribers with subscriber
    this.subscribers.replace(subscriberIndex, subscriber);

    return service;
  }

}