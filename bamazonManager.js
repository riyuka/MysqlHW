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
        showDatabaseManager();
    }
});

function showDatabaseManager() {
    {
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Hello! What do you want to do?",
            choices: ["View products for sale", 'View low inventory', "Add to inventory", "Add a new product", 'Exit']
        }).then(function(data) {
            switch (data.action) {
                case 'View products for sale':
                    viewProduct(function(){
                        showDatabaseManager()
                    });
                    break;
    
                case 'View low inventory':
                    viewLowInv(function(){
                        showDatabaseManager()
                    });
                    break;
    
                case 'Add to inventory':
                    addToInv();
                    break;
    
                case 'Add a new product':
                    addNewP();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        })
    };
}

var viewProduct = function(run) {
    connection.query('SELECT * FROM products', function(err, data) {
        var table = new Table({
            head: ['id', 'product_name', 'department_name', 'price', 'stock_quantity']
        });
        console.log("All the items: ");
        for (var i = 0; i < data.length; i++) {
            table.push([data[i].id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity]);
        }
        console.log(table.toString());
        run();
    })
};

var viewLowInv = function(run) {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5',
        function(err, data) {
            if (err) throw err;
            if (data.length === 0) {
                console.log("===There are currently no items with low inventory.===")
                run();
            } else {
                var table = new Table({
                    head: ['id', 'product_name', 'department_name', 'price', 'stock_quantity']
                });
                for (var i = 0; i < data.length; i++) {
                    table.push([data[i].id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity]);
                }
                console.log("Low Unit items:")
                console.log(table.toString());
                run();
            }
        });
};

function addToInv() {
    var InvItems = [];
    connection.query('SELECT product_name FROM products', function(err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            InvItems.push(data[i].product_name)
        }
        inquirer.prompt([{
            name: 'choices',
            type: 'checkbox',
            message: 'Which product do you want to add inventory for?',
            choices: InvItems
        }]).then(function(managerData) {
            
                addUnit(managerData.choices);
            
        });
    });
}
function addUnit(itemNames) {
    var item = itemNames.shift();
    var itemUnit;
    connection.query('SELECT stock_quantity FROM products WHERE ?', {
        product_name: item
    }, function(err, data) {
        if (err) throw err;
        itemUnit = data[0].stock_quantity;
        itemUnit = parseInt(itemUnit)
    });
    inquirer.prompt([{
        name: 'amount',
        type: 'text',
        message: 'How many ' + item + ' would you like to add?',
        validate: function(str) {
            if (isNaN(parseInt(str))) {
                console.log('Sorry that is not a valid number!');
                return false;
            } else {
                return true;
            }
        }
    }]).then(function(managerData) {
        var amount = managerData.amount
        amount = parseInt(amount);
        connection.query('UPDATE products SET ? WHERE ?', [{
            stock_quantity: itemUnit += amount
        }, {
            product_name: item
        }], function(err) {
            if (err) throw err;
        });
        if (itemNames.length != 0) {
            addUnit(itemNames);
        } else {
            console.log("Your inventory has been updated.");
            showDatabaseManager();
        }
    });
}

function addNewP() {
    var departments = [];
    connection.query('SELECT department_name FROM products', function(err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            departments.push(data[i].department_name);
        }
    });
    inquirer.prompt([{
        name: 'item',
        type: 'text',
        message: 'Please enter the name of the product.'
    }, {
        name: 'department',
        type: 'list',
        message: 'Please choose the department you would like to add your product to.',
        choices: departments
    }, {
        name: 'price',
        type: 'text',
        message: 'Please enter the price for this product.'
    }, {
        name: 'unit',
        type: 'text',
        message: 'Plese enter the Unit Quantity for this item to be entered into current Inventory'
    }]).then(function(user) {
        var item = {
                product_name: user.item,
                department_name: user.department,
                price: user.price,
                stock_quantity: user.unit
            }
        connection.query('INSERT INTO Products SET ?', item,
            function(err) {
                if (err) throw err;
                console.log(item.product_name + ' has been added successfully.');
                showDatabaseManager();
            });
    });
}
