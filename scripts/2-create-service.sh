#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo --------------------------------------------
echo
echo "Creating a service..."
echo
near call  "$CONTRACT" addService '{"discription":"Free Coffee", "provider":"Gloria Jeans", "expiryDate":"2022-06-29T23:50:50.100"}' --accountId="hamzatest.testnet"