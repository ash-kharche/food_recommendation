import numpy as np
import scipy.stats
import scipy.spatial
#from sklearn.cross_validation import KFold poonam commented this
from sklearn.model_selection import KFold #cross_validation is deprecated
import random
from sklearn.metrics import mean_squared_error
from math import sqrt
import math
import warnings
import sys

warnings.simplefilter("error")

def readingFile(filename):
        f = open(filename,"r")
        data = []
        for row in f:
                r = row.split(',')
                e = [int(r[0]), int(r[1]), int(r[2])]
                data.append(e)
        return data


#print("Hey I m in Hybrid::  sys.argv[3]  " +sys.argv[3])
recommend_data = readingFile(sys.argv[3])
print("\nrecommend_data  " +recommend_data)
sys.stdout.flush() #poonam added this
