#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo --------------------------------------------
echo
echo "Distributing Revenue..."
echo
near call  "$CONTRACT" distributeRevenue --accountId=hamzatest.testnet