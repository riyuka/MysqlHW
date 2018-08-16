CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PS4", "Video Games", 299.99, 200), ("Sony TV", "Electronics", 499.99, 100), ("LG TV", "Electronics", 379.99, 150), ("Nike running shoes", "Shoes", 99.99, 200), ("Lancome Cream", "Beauty", 89.99, 500), ("Columbia jacket", "Clothes", 159.99, 220), ("PES2019", "Video Games", 69.99, 400), ("Canon EOS T6", "Electronics", 4449, 90), ("Adidas sandals", "Shoes", 68.99, 350), ("American doll set", "Toys", 132.99, 110);





















CREATE TABLE (
	id INT NOT NULL AUTO_INCREMENT,
	product_id INT NOT NULL,
	amount INT NOT NULL,
	name VARCHAR(255) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (product_id) REFERENCES products(id)
);