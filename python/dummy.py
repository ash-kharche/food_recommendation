#!/usr/bin/python
import sys
import json

rows = {"name":"poonam"}
print(json.dumps(rows, indent=2))
sys.stdout.flush()
