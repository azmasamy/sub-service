# sub-service


## Note!
This project is meant for educational purposes only. It was developed as a part of the [NEAR](https://near.org/) certififed developer program. It is not production-ready and it misses a lot of test, validations and business logic. The project is built using  [NEAR](https://near.org/) 's AssemblyScript SDK and the deployment scripts uses  [NEAR-CLI](https://docs.near.org/docs/tools/near-cli) 

## About
The project simulates a subscribtion service where you can subscribe monthly and get amaizing offeres from international companies for a fee much smaller than the fees of all the offered services combined.

### The Admins
The admins (a hard-coded list of near accounts that can add services) create services that can be redeemed by a user in the span of a specific period that the admin specify when creating the service.
- `addService` required parameters are ("discription", "provider", and "expiryDate").


### The Users
The users can see all available services and choose to subscribe for a month. During this month they can redeem any available service once. They can also resubscribe after the month is over or even before if they want to redeem the same service more than one time.
- `getServices` gets all added services.
- `getAvailableServices` gets all unexpired services.
- `subscribe` with an attached near amount of 10N which is the subscribtion fees.
- `getSubscribers` lists all the subscribers.
- `getActiveSubscribers` lists all subscribers that have unexpired subscribtion.
- `redeem` redeems a service. required parameter is (serviceId). which you can get by viewing the available services i.e. `getAvailableServices`.


## Runing the sample validation contract
You have to login in the cli and set the enviornment variables "$CONTRACT" and "$OWNER" before running the scripts. 

`export OWNER=msaudi2.testnet`

`export CONTRACT=validate.msaudi2.testnet`

Also don't forget to add the $OWNER or any other near account you have access to the list of admins hard-coded in the contract.

`admins: Array<string> = ['hamzatest.testnet'];`

### Scripts 
`./scripts/0-check-account.sh`
Run this to delete the old account if exitsis, and create a new one with the specified CONTRACT environment variable. 
 
`./scripts/1-build-deploy.sh`
Run this to build, and deploy the contract.
 
`./scripts/2-create-service.sh`
Run this to create a service. don't forget to edit the parameters and add a future date for the `expiryDate` parameter. Also edit the `--accountId` wich will call the contract method (Must be in the admins hard-coded list).

`./scripts/3-list-services.sh`
Run this to view all services in the state and also view all available (unexpired) services.

`./scripts/4-subscribe.sh`
Run this to subscribe a user to the contract. don't forget to change the `--accountId` with the near account you want to use to subscribe to the contract.

`./scripts/5-list-subs.sh`
Run this to view all subscribers in the state and also view all subscribers who have valid (unexpired) subscribtions.

`./scripts/6-redeem.sh`
Run this to redeem an available (unexpired) service. don't forget to change the `--accountId` to the near account you used to subscribe to the contract.

`./scripts/3-list-services.sh`
Run this again to view changes to the service `redeemCount`.

`./scripts/5-list-subs.sh`
Run this again to view changes to the account `redeemedServices`.


## Future enhancements
- Modify the redeem function to work in a real-life scenario where the user can use an interface to redeem the service using barcode.
- Better handling of Gas and money transfer.
- Adding tests.
