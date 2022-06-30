#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo --------------------------------------------
echo
echo "Creating a service..."
echo
near call  "$CONTRACT" addService '{"provider":"htahir.testnet", "title":"1 hour with hamza", "description":"Amaizing offer!"}' --accountId="hamzatest.testnet"