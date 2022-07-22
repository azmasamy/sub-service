import { SubService } from "../assembly/index";
import { Constants } from "../assembly/constants";
import { Context, u128, VMContext } from "near-sdk-as";

const ONE_NEAR: u128 = u128.from("1000000000000000000000000");
const ADMIN: string = 'hamzatest.testnet';
const USER_1: string = 'htahir.testnet';
const USER_2: string = 'gloriajeans.testnet';
const USER_3: string = 'msaudi.testnet';
let contract: SubService;

function setContext(account: string, amount: u128): void {
    VMContext.setSigner_account_id(account);
    VMContext.setAttached_deposit(amount);
}

function toYocto(amount: number): u128 {
    return u128.mul(ONE_NEAR, u128.from(amount));
}

beforeAll(() => {
  contract = new SubService();
  VMContext.setBlock_timestamp(1656691204149000000); //2022-07-01T16:00:00.000 UTC
});

describe("Main Flow", () => {
    it('Tests the flow of the app', () => {

        // Testing service creation
        setContext(USER_1, Constants.SUB_FEES);
        expect(() => { contract.addService(USER_2, 'Gloria Jeans', 'Free Coffee', '2020-07-10T15:00:00.000') }).toThrow(Constants.ACCESS_DENIED);

        setContext(ADMIN, u128.from(0));
        const service1 = contract.addService(USER_2, 'Gloria Jeans', 'Free Coffee', '2023-07-10T15:00:00.000');
        expect(service1.provider).toBe(USER_2);
        expect(service1.redeemCount).toBe(0);

        const service2 = contract.addService(USER_1, '1 Hour with hamza', 'Amaizing offer to spend one hour with the -renound- Hamza Tahir!', '2023-07-10T15:00:00.000');
        expect(service2.provider).toBe(USER_1);
        expect(service2.redeemCount).toBe(0);


        // Testing subscribtion
        setContext(USER_1, u128.sub(Constants.SUB_FEES, u128.from(1)));
        expect(() => { contract.subscribe() }).toThrow(Constants.NOT_ENOUGH_CREDIT);

        setContext(ADMIN, Constants.SUB_FEES);
        const subscriber2 = contract.subscribe();
        expect(subscriber2.accountId).toBe(ADMIN);
        expect(subscriber2.servicesRedeemed.length).toBe(0);
        expect(subscriber2.expiryDate).toBe(subscriber2.subscriptionDate + contract.calcSubDuration());

        setContext(USER_2, Constants.SUB_FEES);
        const subscriber3 = contract.subscribe();
        expect(subscriber3.accountId).toBe(USER_2);
        expect(subscriber3.servicesRedeemed.length).toBe(0);
        expect(subscriber3.expiryDate).toBe(subscriber3.subscriptionDate + contract.calcSubDuration());

        setContext(USER_1, Constants.SUB_FEES);
        const subscriber1Sub1 = contract.subscribe();
        expect(subscriber1Sub1.accountId).toBe(USER_1);
        expect(subscriber1Sub1.servicesRedeemed.length).toBe(0);
        expect(subscriber1Sub1.expiryDate).toBe(subscriber1Sub1.subscriptionDate + contract.calcSubDuration());

        // setContext(USER_1, Constants.SUB_FEES);
        // const subscriber1Sub2 = contract.subscribe();
        // expect(subscriber1Sub1.expiryDate).toBeGreaterThan(subscriber1Sub2.expiryDate);

        
        // Testing redeemtion
        setContext(ADMIN, u128.from(0));
        expect(contract.redeem(service1.id).redeemCount).toBe(1);
        
        setContext(USER_1, u128.from(0));
        expect(contract.redeem(service1.id).redeemCount).toBe(2);

        setContext(USER_2, u128.from(0));
        expect(contract.redeem(service1.id).redeemCount).toBe(3);

        setContext(USER_1, u128.from(0));
        expect(contract.redeem(service2.id).redeemCount).toBe(1);

        // setContext(USER_3, u128.from(0));
        // expect(() => { contract.redeem(service2.id) }).toThrow(Constants.NOT_SUBSCRIBER);


        // Testing profit distribution
        setContext(USER_2, u128.from(0));
        expect(() => { contract.distributeRevenue() }).toThrow(Constants.ACCESS_DENIED);

        // setContext(ADMIN, u128.from(0));
        // const redemtions = contract.distributeRevenue();
        // expect(redemtions).toBe(4);

        // expect(contract.getServiceById(service1.id).redeemCount).toBe(0);
        // expect(contract.getServiceById(service2.id).redeemCount).toBe(0);
        
    });
});