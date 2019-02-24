### HEROKU CLI
heroku logs --tail --app food-recommendation


### DATABASE
- OLD database - heroku pg:psql postgresql-flat-61884 --app food-recommendation
- heroku pg:psql postgresql-opaque-28613 --app food-recommendation

- psql postgres   (local machine)
- \dt --> show tables

#### Check DataType of columns of table
- \d+ table_name
- \d+ PRODUCTS

#### Column Datatype change
To change the data type of the products column to JSON in collections table, you use the statement below:
- ALTER TABLE collections ALTER COLUMN products TYPE JSON USING products::json;
- ALTER TABLE products ALTER COLUMN is_veg TYPE REAL USING is_veg::real;
- ALTER TABLE products ALTER COLUMN price TYPE INTEGER USING price::integer;
- ALTER TABLE products ALTER COLUMN ingredients SET DEFAULT array[]::integer[];

#### TABLE creation
###### USERS
- CREATE TABLE users(user_id serial PRIMARY KEY, user_name VARCHAR (50) NOT NULL, password VARCHAR (50) NOT NULL, email VARCHAR (100) UNIQUE NOT NULL, mobile_number VARCHAR (15) UNIQUE NOT NULL);

###### COLLECTIONS
- CREATE TABLE collections(collection_id serial PRIMARY KEY, collection_name VARCHAR (50) NOT NULL, image_url VARCHAR (200) NOT NULL, products JSON);  //TODO poonma check JSON datatype

###### PRODUCTS
- CREATE TABLE products(product_id serial PRIMARY KEY, product_name VARCHAR (50) NOT NULL, description VARCHAR (200) NOT NULL, image_url VARCHAR (200) NOT NULL, collection_id INTEGER, collection_name VARCHAR (50) NOT NULL, is_veg INTEGER, rating REAL);

- CREATE TABLE trending_products(product_id INTEGER, product_name VARCHAR (50) NOT NULL, description VARCHAR (200) NOT NULL, image_url VARCHAR (200) NOT NULL, collection_id INTEGER, collection_name VARCHAR (50) NOT NULL, is_veg INTEGER, rating REAL);

- CREATE TABLE recommended_products(product_id INTEGER, product_name VARCHAR (50) NOT NULL, description VARCHAR (200) NOT NULL, image_url VARCHAR (200) NOT NULL, collection_id INTEGER, collection_name VARCHAR (50) NOT NULL, is_veg INTEGER, rating REAL);

###### ORDERS
- CREATE TABLE orders(order_id serial PRIMARY KEY, date VARCHAR (200), total_amount INTEGER, order_address VARCHAR (200)); 

#### POPULATE DUMMY DATA

###### USERS
- COPY users(user_id, username, password, email) FROM ‘/Users/poonamkharche/Downloads/MyData/dummy.csv' WITH DELIMITER ',' CSV HEADER;

###### COLLECTIONS
- COPY collections(id, collection_id, collection_name, description, image_url, products) FROM '/Users/poonamkharche/Downloads/MyData/poonam/collections_csv.csv' WITH DELIMITER ',' CSV HEADER; 

 - \copy collections FROM /Users/poonamkharche/Downloads/MyData/poonam/dummy_data/collections_csv.csv


#### FETCH DATA
- select * from public.users;
