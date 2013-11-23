xquery version "1.0";

declare function local:setOrderID() as empty(){
	let $count := doc("/db/testCollection/counter.xml")/orderCounter/count
	return ( update value doc("/db/testCollection/purchaseOrderTest.xml")/order/@orderID with $count,
	update value $count with $count+1)
};
declare function local:insertOrder() as empty(){
	(:Insert the new order into the orders table:)	
	update insert doc("/db/testCollection/purchaseOrderTest.xml")/order into doc("/db/testCollection/ordersList.xml")/ordersList
};

declare function local:main() as empty(){
	(:Updates the inventory table with the proper inventory count:)
	for $product in doc("/db/testCollection/purchaseOrderTest.xml")/order/productsList/product
		for $invent in doc("/db/testCollection/testInventorylist.xml")/productInventory/product
			where $product/@productID = $invent/@productID
			return update value $invent/quantity with $invent/quantity -1
		};

local:setOrderID(),
local:insertOrder(),	
local:main()
