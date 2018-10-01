###
heroku logs --tail --app food-recommendation

### connect to database
GOTO --> C:\Program Files\PostgreSQL\10\bin

psql -h [**Host Name**] -U [**User Name**] [**database Name**]

psql -h ec2-174-129-225-9.compute-1.amazonaws.com -U vrmqaltlcnstmq dcc7k5gq0l7ikv

## USERS TABLE
CREATE TABLE users(
	user_id serial PRIMARY KEY, 
	user_name VARCHAR (50) NOT NULL, 
	password VARCHAR (50) NOT NULL, 
	email VARCHAR (50) UNIQUE NOT NULL, 
	mobile_number VARCHAR(15) NOT NULL, 
	created_at DATE, updated_at DATE);

#Dummy data in Users
INSERT INTO users(user_name, email, mobile_number, password) VALUES ("poonamk", "poo@gmail.com", 9029799650", "poonam");

## COLLECTIONS TABLE
CREATE TABLE collections(
	id serial PRIMARY KEY, 
	collection_id INTEGER, 
	collection_name VARCHAR (50) NOT NULL, 
	collection_image VARCHAR (300), 
	created_at DATE, updated_at DATE);

#Dummy data in Collections
INSERT INTO collections(collection_id, collection_name, collection_image) VALUES (1, 'Breakfast', 'https://product-assets.faasos.io/production/product/image_1520230938352_ADB.jpg');

INSERT INTO collections(collection_id, collection_name, collection_image) VALUES (2, 'Royal Food', 'https://product-assets.faasos.io/production/product/image_1520231419752_RIM.jpg');

INSERT INTO collections(collection_id, collection_name, collection_image) VALUES (3, 'Chai & Snacks', 'https://product-assets.faasos.io/production/product/image_1509529386482_push1.jpg');

INSERT INTO collections(collection_id, collection_name, collection_image) VALUES (4, "Continental", "https://product-assets.faasos.io/production/product/image_1520231486425_Super%20Saver%20Combos.jpg");

INSERT INTO collections(collection_id, collection_name, collection_image) VALUES (5, "Desserts", "https://product-assets.faasos.io/production/product/image_1520231278684_Elite.jpg");

INSERT INTO collections(collection_id, collection_name, collection_image) VALUES (6, "Fast Food", "https://product-assets.faasos.io/production/product/image_1520230938352_ADB.jpg");


## PRODUCTS TABLE
CREATE TABLE products(
	id serial PRIMARY KEY, 
	product_id INTEGER, 
	collection_id INTEGER, 
	product_name VARCHAR (50) NOT NULL, 
	product_image VARCHAR (50), 
	description VARCHAR (100), 
	is_veg INTEGER, 
	price INTEGER,
	tax INTEGER,
	spice_level INTEGER,
	chef_name VARCHAR (50),
	tags JSON,
	nutrients JSON,
	created_at DATE, updated_at DATE);

#Dummy data in Products
INSERT INTO products() VALUES ();

