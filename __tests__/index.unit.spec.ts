import { SubService } from "../assembly/index";
import { Service, Subscriber } from "../assembly/models";
import { Constants } from "../assembly/constants";
import { Context, u128, VMContext } from "near-sdk-as";

const ONE_NEAR: u128 = u128.from("1000000000000000000000000")
let contract: SubService;

describe("Main Flow", () => {
    it('Tests the flow of the app', () => {

        // Testing service creation
        // expect(() => { contract.addService('gloriajeans.testnet', 'Gloria Jeans', 'Free Coffee', '2020-07-10T15:00:00.000') }).toThrow(Constants.ACCESS_DENIED);

        setContext('hamzatest.testnet', u128.from(0));
        const service1 = contract.addService('gloriajeans.testnet', 'Gloria Jeans', 'Free Coffee', '2023-07-10T15:00:00.000');
        // log(service1);
        // expect(service1.provider).toBe('gloriajeans.testnet');
        // expect(service1.redeemCount).toBe(0);

        // const service2 = contract.addService('hamzatest.testnet', '1 Hour with hamza', 'Amaizing offer to spend one hour with the -renound- Hamza Tahir!', '2023-07-10T15:00:00.000');
        // expect(service2.provider).toBe('hamzatest.testnet');
        // expect(service2.redeemCount).toBe(0);

        // Testing subscribtion
        // setContext('htahir.testnet', Constants.SUB_FEES);
        // const subscriber1Sub1 = contract.subscribe();
        // expect(subscriber1Sub1.accountId).toBe('htahir.testnet');
        // expect(subscriber1Sub1.servicesRedeemed.length).toBe(0);
        // expect(subscriber1Sub1.expiryDate).toBe(subscriber1Sub1.subscriptionDate - contract.calcSubDuration());

        // setContext('htahir.testnet', u128.sub(Constants.SUB_FEES, u128.from(1)));
        // expect(() => { contract.subscribe() }).toThrow(Constants.NOT_ENOUGH_CREDIT);

        // setContext('htahir.testnet', Constants.SUB_FEES);
        // const subscriber1Sub2 = contract.subscribe();
        // expect(subscriber1Sub1.expiryDate).toBeLessThan(subscriber1Sub2.expiryDate);

        // setContext('hamzatest.testnet', Constants.SUB_FEES);
        // const subscriber2 = contract.subscribe();
        // expect(subscriber2.accountId).toBe('hamzatest.testnet');
        // expect(subscriber2.servicesRedeemed.length).toBe(0);
        // expect(subscriber2.expiryDate).toBe(subscriber2.subscriptionDate - contract.calcSubDuration());

        // setContext('gloriajeans.testnet', Constants.SUB_FEES);
        // const subscriber3 = contract.subscribe();
        // expect(subscriber3.accountId).toBe('gloriajeans.testnet');
        // expect(subscriber3.servicesRedeemed.length).toBe(0);
        // expect(subscriber3.expiryDate).toBe(subscriber3.subscriptionDate - contract.calcSubDuration());

        
        // // Testing redeemtion
        // setContext('hamzatest.testnet', u128.from(0));
        // expect(contract.redeem(service1.id).redeemCount).toBe(1);
        
        // setContext('htahir.testnet', u128.from(0));
        // expect(contract.redeem(service1.id).redeemCount).toBe(2);

        // setContext('gloriajeans.testnet', u128.from(0));
        // expect(contract.redeem(service1.id).redeemCount).toBe(3);

        // setContext('htahir.testnet', u128.from(0));
        // expect(contract.redeem(service2.id).redeemCount).toBe(1);

        // // Testing profit distribution
        // expect(() => { contract.distributeRevenue() }).toThrow(Constants.ACCESS_DENIED);

        // setContext('hamzatest.testnet', u128.from(0));
        // expect(contract.distributeRevenue()).toBe(4);

        // setContext('hamzatest.testnet', u128.from(0));

        // expect(contract.getServiceById(service1.id).redeemCount).toBe(0);

        // expect(contract.getServiceById(service2.id).redeemCount).toBe(0);
        
    });
});

function setContext(account: string, amount: u128): void {
    VMContext.setSigner_account_id(account);
    VMContext.setAttached_deposit(amount);
    VMContext.setBlock_timestamp(1656691204149000000); //2022-07-01T16:00:00.000 UTC
}

function toYocto(amount: number): u128 {
    return u128.mul(ONE_NEAR, u128.from(amount));
}