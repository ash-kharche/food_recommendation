#!/usr/bin/python
import sys
import psycopg2

conn = psycopg2.connect(database = "de7pit5nq8p35l", user = "uvzjkvhjhvrevn", password = "e9fa122e883f4af209c53c4586f1e7d2e38fee3495a03873c0191b98cea73fb2", host = "ec2-54-243-223-245.compute-1.amazonaws.com", port = "5432")
#print ("Opened database successfully")

cur = conn.cursor()
# execute a statement
#print('PostgreSQL database version:')

#cur.execute("SELECT * FROM products ORDER BY rating DESC FETCH FIRST 3 ROWS ONLY";)
postgreSQL_select_Query = "select * from collections"
cursor.execute(postgreSQL_select_Query)

# display the PostgreSQL database server version
trending_products = cur.fetchall()


# close the communication with the PostgreSQL
cur.close()

conn.commit()
conn.close()

print(trending_products)
sys.stdout.flush()
