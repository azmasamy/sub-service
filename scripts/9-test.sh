echo --------------------------------------------
echo
echo "Redeeming a service..."
echo
near call  "$CONTRACT" redeem '{"serviceId":"GLORIAJEANS.TESTNET/1656706095276"}' --accountId=hamzatest.testnet
echo --------------------------------------------
echo
echo "Redeeming a service..."
echo
near call  "$CONTRACT" redeem '{"serviceId":"GLORIAJEANS.TESTNET/1656706095276"}' --accountId=htahir.testnet
echo --------------------------------------------
echo
echo "Redeeming a service..."
echo
near call  "$CONTRACT" redeem '{"serviceId":"GLORIAJEANS.TESTNET/1656706095276"}' --accountId=gloriajeans.testnet
echo --------------------------------------------
echo
echo "Redeeming a service..."
echo
near call  "$CONTRACT" redeem '{"serviceId":"HTAHIR.TESTNET/1656706101022"}' --accountId=htahir.testnet
echo --------------------------------------------
echo
echo "Testing redeeming a service twice assertion..."
echo
near call  "$CONTRACT" redeem '{"serviceId":"GLORIAJEANS.TESTNET/1656706095276"}' --accountId=hamzatest.testnet
echo --------------------------------------------
echo
echo "Testing non-subscriber assertion..."
echo
near call  "$CONTRACT" redeem '{"serviceId":"GLORIAJEANS.TESTNET/1656706095276"}' --accountId=nonsub.testnet
echo --------------------------------------------
echo
echo "Distributing Revenue..."
echo
near call  "$CONTRACT" distributeRevenue --accountId=hamzatest.testnet
echo --------------------------------------------
echo
echo "Distributing Revenue (With 0 redemtions)..."
echo
near call  "$CONTRACT" distributeRevenue --accountId=hamzatest.testnet
echo --------------------------------------------
echo
echo "Testing distributing revenue non-admin assertion..."
echo
near call  "$CONTRACT" distributeRevenue --accountId=htahir.testnet