var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) {
        throw err;
    } else {
        console.log("connected as id " + connection.threadId + "\n");
        showDatabaseCustomer();
    }
});

function showDatabaseCustomer() {
    connection.query("SELECT * FROM products", function(err, data) {
        //console.log(data); 
        var table = new Table({
            head: ['ID', 'Product Name', 'Price']
        });
        for (var i = 0; i < data.length; i++) {
            table.push([data[i].id, data[i].product_name, data[i].price.toFixed(2)]);
        }
        console.log(table.toString());

        inquirer.prompt([{
            type: "input",
            name: "chooseItem",
            message: "which item do you want to buy? Please enter id only.",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
            type: "input",
            name: "chooseUnit",
            message: "How many do you want to buy?",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

        ]).then(function(userData) {
            var choiceId = userData.chooseItem - 1;
            var choiceUnit = userData.chooseUnit;
            if (choiceUnit > data[choiceId].stock_quantity) {
                console.log("Sorry, insufficient Quanity. There are only " + data[choiceId].stock_quantity + " left." + "\n");
                showDatabaseCustomer();

            } else {
                console.log("Total for " + "(" + choiceUnit + ")" + " - " + data[choiceId].product_name + " is: " + data[choiceId].price.toFixed(2) * choiceUnit +"\n");
                console.log("======Your order has been placed!======\n")
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: data[choiceId].stock_quantity - choiceUnit
                }, {
                    id: data[choiceId].id
                }], function(err, data) {
                    console.log(err);
                    showDatabaseCustomer();
                });
            };
        });
    });
};
