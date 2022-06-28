#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo --------------------------------------------
echo
echo "Getting all subscribers..."
echo
near view  "$CONTRACT" getSubscribers
echo
echo
echo --------------------------------------------
echo
echo "Getting active subscribers..."
echo
near view  "$CONTRACT" getActiveSubscribers