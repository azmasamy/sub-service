echo --------------------------------------------
echo
echo "Getting all services..."
echo
near view  "$CONTRACT" getServices
echo
echo
echo --------------------------------------------
echo
echo "Getting active services..."
echo
near view  "$CONTRACT" getActiveServices