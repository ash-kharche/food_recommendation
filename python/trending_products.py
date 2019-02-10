#!/usr/bin/python
import sys
import psycopg2

conn = psycopg2.connect(database = "de7pit5nq8p35l", user = "uvzjkvhjhvrevn", password = "e9fa122e883f4af209c53c4586f1e7d2e38fee3495a03873c0191b98cea73fb2", host = "ec2-54-243-223-245.compute-1.amazonaws.com", port = "5432")
cursor = conn.cursor()

postgreSQL_select_Query = "SELECT * FROM products ORDER BY rating DESC LIMIT 5"
#postgreSQL_select_Query = "SELECT product_id, product_name, price, rating FROM products ORDER BY rating DESC LIMIT 5"

cursor.execute(postgreSQL_select_Query)

rows = cursor.fetchall()

cursor.close()
conn.commit()
conn.close()

#https://medium.com/@PyGuyCharles/python-sql-to-json-and-beyond-3e3a36d32853
#https://www.peterbe.com/plog/from-postgres-to-json-strings

#columns = ('product_id', 'product_name', 'price', 'rating')

#results = []
#for row in trending_products:
#        results.append(dict(zip(columns, row)))

#print(json.dumps(results, indent=2))


return json.dumps( [dict(ix) for ix in rows] )

#print(trending_products)
#sys.stdout.flush()
