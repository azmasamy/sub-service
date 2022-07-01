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