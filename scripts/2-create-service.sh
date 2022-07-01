echo --------------------------------------------
echo
echo "Creating a service..."
echo
near call  "$CONTRACT" addService '{"provider":"htahir.testnet", "title":"1 hour with hamza", "description":"Amaizing offer!", "expiryDate":"2022-07-29T23:50:50.100"}' --accountId="hamzatest.testnet"