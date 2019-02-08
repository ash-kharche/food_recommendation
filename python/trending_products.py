#!/usr/bin/python
import sys
import psycopg2

conn = psycopg2.connect(database = "de7pit5nq8p35l", user = "uvzjkvhjhvrevn", password = "e9fa122e883f4af209c53c4586f1e7d2e38fee3495a03873c0191b98cea73fb2", host = "ec2-54-243-223-245.compute-1.amazonaws.com", port = "5432")
cursor = conn.cursor()

postgreSQL_select_Query = "SELECT * FROM products ORDER BY rating DESC LIMIT 5"
cursor.execute(postgreSQL_select_Query)

trending_products = cursor.fetchall()

cursor.close()
conn.commit()
conn.close()

print(trending_products)
sys.stdout.flush()
