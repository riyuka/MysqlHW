# MysqlHW

Running this `bamazonCustomer` node application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

1. The app should then prompt users with two messages.

   * The first should ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.

2. Once the customer has placed the order, the application should check if the store has enough of the product to meet the customer's request.

   * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

3. However, if the store _does_ have enough of the product, It should fulfill the customer's order.
   * Updating the SQL database to reflect the remaining quantity.
   * Once the update goes through, show the customer the total cost of their purchase.

