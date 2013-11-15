xquery version "1.0";

import module namespace request="http://exist-db.org/xquery/request";
import module namespace session="http://exist-db.org/xquery/session";
import module namespace util="http://exist-db.org/xquery/util";
	

let $id := request:get-parameter('orderID', '')


(:Update the orders history table with the order that is now processed:)
for $order in doc("/db/testCollection/ordersList.xml")/ordersList/order
	where $order/@orderID = $orderID
	return update insert $order into doc("/db/testCollection/ordersHistory.xml")/orders
