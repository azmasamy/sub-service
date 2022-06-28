#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo --------------------------------------------
echo
echo "Subscribing..."
echo
near call  "$CONTRACT" subscribe --accountId="htahir.testnet" --amount=10