#!/usr/bin/python
import sys
import psycopg2

#print ("Trying to connect to database...")

conn = psycopg2.connect(database = "de7pit5nq8p35l", user = "uvzjkvhjhvrevn", password = "e9fa122e883f4af209c53c4586f1e7d2e38fee3495a03873c0191b98cea73fb2", host = "ec2-54-243-223-245.compute-1.amazonaws.com", port = "5432")
#print ("Opened database successfully")

cur = conn.cursor()
# execute a statement
#print('PostgreSQL database version:')

cur.execute('SELECT version()')

# display the PostgreSQL database server version
db_version = cur.fetchone()


# close the communication with the PostgreSQL
cur.close()

conn.commit()
conn.close()

print(db_version)
sys.stdout.flush()
