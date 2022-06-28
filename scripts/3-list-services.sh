#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e
echo --------------------------------------------
echo
echo "Getting all services..."
echo
near view  "$CONTRACT" getServices
echo
echo
echo --------------------------------------------
echo
echo "Getting available services..."
echo
near view  "$CONTRACT" getActiveServices