echo "deleting $CONTRACT $OWNER and setting $OWNER as the master account..."
echo
near delete $CONTRACT $OWNER
echo "Creating contract..."
echo
near create-account "$CONTRACT" --masterAccount "$OWNER" --initialBalance 1
echo --------------------------------------------
echo
echo "building the contract (release build)..."
echo
yarn asb --target release
echo --------------------------------------------
echo
echo "deploying the contract..."
echo
echo
near deploy --accountId "$CONTRACT" --wasmFile="./build/release/sub-service.wasm"
echo --------------------------------------------
echo
echo "Creating a service..."
echo
near call  "$CONTRACT" addService '{"provider":"gloriajeans.testnet", "title":"Free Coffee", "description":"Enjoy a free nescafe with gloria jeans special offer", "expiryDate":"2023-07-29T23:50:50.100"}' --accountId="hamzatest.testnet"
echo --------------------------------------------
echo
echo "Creating a service..."
echo
near call  "$CONTRACT" addService '{"provider":"htahir.testnet", "title":"1 hour with hamza", "description":"Amaizing offer!", "expiryDate":"2023-07-29T23:50:50.100"}' --accountId="hamzatest.testnet"
echo --------------------------------------------
echo
echo "Testing adding a service by a non-admin assertion..."
echo
near call  "$CONTRACT" addService '{"provider":"htahir.testnet", "title":"test admin assertion", "description":"test1", "expiryDate":"2023-07-29T23:50:50.100"}' --accountId="htahir.testnet"
echo --------------------------------------------
echo
echo "Testing adding a service with older expiry date assertion..."
echo
near call  "$CONTRACT" addService '{"provider":"hamzatest.testnet", "title":"test expiry date assertion ", "description":"test2", "expiryDate":"2022-07-01T19:00:00.100"}' --accountId="hamzatest.testnet"
echo --------------------------------------------
echo
echo "Subscribing..."
echo
near call  "$CONTRACT" subscribe --accountId="hamzatest.testnet" --amount=10
echo --------------------------------------------
echo
echo "Subscribing..."
echo
near call  "$CONTRACT" subscribe --accountId="htahir.testnet" --amount=10
echo --------------------------------------------
echo
echo "Subscribing..."
echo
near call  "$CONTRACT" subscribe --accountId="gloriajeans.testnet" --amount=10
echo --------------------------------------------
echo
echo "Resubscribing..."
echo
near call  "$CONTRACT" subscribe --accountId="gloriajeans.testnet" --amount=10
echo --------------------------------------------
echo
echo "Testing subscribing with insuffetiont fees assertion..."
echo
near call  "$CONTRACT" subscribe --accountId="gloriajeans.testnet" --amount=9.9











































