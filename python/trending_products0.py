#!/usr/bin/python
import sys
import psycopg2
from psycopg2.extras import RealDictCursor
import json

#try:
    #import simplejson as json
#except ImportError:
    #import json

conn = psycopg2.connect(database = "de7pit5nq8p35l", user = "uvzjkvhjhvrevn", password = "e9fa122e883f4af209c53c4586f1e7d2e38fee3495a03873c0191b98cea73fb2", host = "ec2-54-243-223-245.compute-1.amazonaws.com", port = "5432")
cursor = conn.cursor(cursor_factory=RealDictCursor)

postgreSQL_select_Query = "SELECT * FROM collections"
#postgreSQL_select_Query = "SELECT product_id, product_name, price, rating FROM products ORDER BY rating DESC LIMIT 5"

rows = cursor.execute(postgreSQL_select_Query).fetchall()

cursor.close()
conn.commit()
conn.close()

#https://medium.com/@PyGuyCharles/python-sql-to-json-and-beyond-3e3a36d32853
#https://www.peterbe.com/plog/from-postgres-to-json-strings

#columns = ('product_id', 'product_name', 'price', 'rating')

#results = []
#for row in rows:
#        results.append(dict(zip(columns, row)))
#rows = {"name":"poonam"}
#print(json.dumps(rows, indent=2))

rows = {name:"poonam"}
return json.dumps(rows, indent=2)

#print(trending_products)
#sys.stdout.flush()
