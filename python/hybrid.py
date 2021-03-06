import numpy as np
import scipy.stats
import scipy.spatial
#from sklearn.cross_validation import KFold
from sklearn.model_selection import KFold #cross_validation is deprecated
import random
from sklearn.metrics import mean_squared_error
from math import sqrt
import math
import warnings
import sys

users = sys.argv[1]
items = sys.argv[2]

file1 = sys.argv[3];
file2 = sys.argv[4]
file3 = sys.argv[5]
file4 = sys.argv[6]
file5 = sys.argv[7]
file6 = sys.argv[8]

def readingFile(filename):
        f = open(filename,"r")
        data = []
        for row in f:
                r = row.split(',')
                e = [int(r[0]), int(r[1]), int(r[2])]
                data.append(e)
        return data

def userData(filename):
    data = []
    try:
        f = open(filename,"r")
        for row in f:
                r = row.split(',')
                e = [int(r[0]), int(r[1]), int(r[2])]
                data.append(e)
    except:
        print("Exception: userData")
    return data

def itemData(filename):
        f = open(filename,"r")
        data = np.zeros((int(items),18))
        genre = {"Veg":0, "Non-veg":1, "Diabetes":2, "Cholestrol":3}
        for row in f:
                r = row.split(',')
                g = r[len(r)-1].split('|')
                for e in g:
                        if e.strip() not in genre.keys():
                                continue
                        else:
                                data[int(r[0])-1][genre[e.strip()]] = 1

        return data

def similarity_item(data):
        #print ("Hello similarity item")
        item_similarity_cosine = np.zeros((int(items),int(items)))
        item_similarity_jaccard = np.zeros((int(items),int(items)))
        item_similarity_pearson = np.zeros((int(items),int(items)))
        for item1 in range(int(items)):
                #print (item1)
                for item2 in range(int(items)):
                        if np.count_nonzero(data[item1]) and np.count_nonzero(data[item2]):
                                item_similarity_cosine[item1][item2] = 1-scipy.spatial.distance.cosine(data[item1],data[item2])
                                item_similarity_jaccard[item1][item2] = 1-scipy.spatial.distance.jaccard(data[item1],data[item2])
                                try:
                                        if not math.isnan(scipy.stats.pearsonr(data[item1],data[item2])[0]):
                                                item_similarity_pearson[item1][item2] = scipy.stats.pearsonr(data[item1],data[item2])[0]
                                        else:
                                                item_similarity_pearson[item1][item2] = 0
                                except:
                                        item_similarity_pearson[item1][item2] = 0

                        #f_i_d.write(str(item1) + "," + str(item2) + "," + str(item_similarity_cosine[item1][item2]) + "," + str(item_similarity_jaccard[item1][item2]) + "," + str(item_similarity_pearson[item1][item2]) + "\n")
        #f_i_d.close()
        return item_similarity_cosine, item_similarity_jaccard, item_similarity_pearson

def similarity_user(data):
        #print ("Hello similarity user")
        #f_i_d = open("sim_user_hybrid.txt","w")
        user_similarity_cosine = np.zeros((int(users),int(users)))
        user_similarity_jaccard = np.zeros((int(users),int(users)))
        user_similarity_pearson = np.zeros((int(users),int(users)))
        for user1 in range(int(users)):
                #print (user1)
                for user2 in range(int(users)):
                        if np.count_nonzero(data[user1]) and np.count_nonzero(data[user2]):
                                user_similarity_cosine[user1][user2] = 1-scipy.spatial.distance.cosine(data[user1],data[user2])
                                user_similarity_jaccard[user1][user2] = 1-scipy.spatial.distance.jaccard(data[user1],data[user2])
                                try:
                                        if not math.isnan(scipy.stats.pearsonr(data[user1],data[user2])[0]):
                                                user_similarity_pearson[user1][user2] = scipy.stats.pearsonr(data[user1],data[user2])[0]
                                        else:
                                                user_similarity_pearson[user1][user2] = 0
                                except:
                                        user_similarity_pearson[user1][user2] = 0

        return user_similarity_cosine, user_similarity_jaccard, user_similarity_pearson

def crossValidation1(data, user_data, item_data):
        k_fold = KFold(n_splits=10)

        for train_indices, test_indices in k_fold.split(data):
                train = [data[i] for i in train_indices]
                test = [data[i] for i in test_indices]

        M = np.zeros((int(users),int(items)))

        for e in train:
            print(e)
            try:
                M[e[0]-1][e[1]-1] = e[2]
            except IndexError as error:
                print(error)

        #print(M)

def crossValidation(data, user_data, item_data):
        k_fold = KFold(n_splits=10) #poonam

        sim_user_cosine, sim_user_jaccard, sim_user_pearson = similarity_user(user_data)
        sim_item_cosine, sim_item_jaccard, sim_item_pearson = similarity_item(item_data)


        rmse_cosine = []
        rmse_jaccard = []
        rmse_pearson = []

        for train_indices, test_indices in k_fold.split(data):
                train = [data[i] for i in train_indices]
                test = [data[i] for i in test_indices]

                M = np.zeros((int(users),int(items)))

                for e in train:
                    M[e[0]-1][e[1]-1] = e[2]


                true_rate = []
                pred_rate_cosine = []
                pred_rate_jaccard = []
                pred_rate_pearson = []

                for e in test:
                        user = e[0]
                        item = e[1]
                        true_rate.append(e[2])

                        user_pred_cosine = 3.0
                        item_pred_cosine = 3.0

                        user_pred_jaccard = 3.0
                        item_pred_jaccard = 3.0

                        user_pred_pearson = 3.0
                        item_pred_pearson = 3.0

                        #item-based
                        if np.count_nonzero(M[:,item-1]):
                                sim_cosine = sim_item_cosine[item-1]
                                sim_jaccard = sim_item_jaccard[item-1]
                                sim_pearson = sim_item_pearson[item-1]
                                ind = (M[user-1] > 0)
                                #ind[item-1] = False
                                normal_cosine = np.sum(np.absolute(sim_cosine[ind]))
                                normal_jaccard = np.sum(np.absolute(sim_jaccard[ind]))
                                normal_pearson = np.sum(np.absolute(sim_pearson[ind]))
                                if normal_cosine > 0:
                                        item_pred_cosine = np.dot(sim_cosine,M[user-1])/normal_cosine

                                if normal_jaccard > 0:
                                        item_pred_jaccard = np.dot(sim_jaccard,M[user-1])/normal_jaccard

                                if normal_pearson > 0:
                                        item_pred_pearson = np.dot(sim_pearson,M[user-1])/normal_pearson

                        if item_pred_cosine < 0:
                                item_pred_cosine = 0

                        if item_pred_cosine > 5:
                                item_pred_cosine = 5

                        if item_pred_jaccard < 0:
                                item_pred_jaccard = 0

                        if item_pred_jaccard > 5:
                                item_pred_jaccard = 5

                        if item_pred_pearson < 0:
                                item_pred_pearson = 0

                        if item_pred_pearson > 5:
                                item_pred_pearson = 5

                        #user-based
                        if np.count_nonzero(M[user-1]):
                                sim_cosine = sim_user_cosine[user-1]
                                sim_jaccard = sim_user_jaccard[user-1]
                                sim_pearson = sim_user_pearson[user-1]
                                ind = (M[:,item-1] > 0)
                                #ind[user-1] = False
                                normal_cosine = np.sum(np.absolute(sim_cosine[ind]))
                                normal_jaccard = np.sum(np.absolute(sim_jaccard[ind]))
                                normal_pearson = np.sum(np.absolute(sim_pearson[ind]))
                                if normal_cosine > 0:
                                        user_pred_cosine = np.dot(sim_cosine,M[:,item-1])/normal_cosine

                                if normal_jaccard > 0:
                                        user_pred_jaccard = np.dot(sim_jaccard,M[:,item-1])/normal_jaccard

                                if normal_pearson > 0:
                                        user_pred_pearson = np.dot(sim_pearson,M[:,item-1])/normal_pearson

                        if user_pred_cosine < 0:
                                user_pred_cosine = 0

                        if user_pred_cosine > 5:
                                user_pred_cosine = 5

                        if user_pred_jaccard < 0:
                                user_pred_jaccard = 0

                        if user_pred_jaccard > 5:
                                user_pred_jaccard = 5

                        if user_pred_pearson < 0:
                                user_pred_pearson = 0

                        if user_pred_pearson > 5:
                                user_pred_pearson = 5

                        if (user_pred_cosine != 0 and user_pred_cosine != 5) and (item_pred_cosine != 0 and item_pred_cosine != 5):
                                pred_cosine = (user_pred_cosine + item_pred_cosine)/2
                        else:
                                if (user_pred_cosine == 0 or user_pred_cosine == 5):
                                        if (item_pred_cosine != 0 and item_pred_cosine != 5):
                                                pred_cosine = item_pred_cosine
                                        else:
                                                pred_cosine = 3.0
                                else:
                                        if (user_pred_cosine != 0 and user_pred_cosine != 5):
                                                pred_cosine = user_pred_cosine
                                        else:
                                                pred_cosine = 3.0

                        if (user_pred_jaccard != 0 and user_pred_jaccard != 5) and (item_pred_jaccard != 0 and item_pred_jaccard != 5):
                                pred_jaccard = (user_pred_jaccard + item_pred_jaccard)/2
                        else:
                                if (user_pred_jaccard == 0 or user_pred_jaccard == 5):
                                        if (item_pred_jaccard != 0 and item_pred_jaccard != 5):
                                                pred_jaccard = item_pred_jaccard
                                        else:
                                                pred_jaccard = 3.0
                                else:
                                        if (user_pred_jaccard != 0 and user_pred_jaccard != 5):
                                                pred_jaccard = user_pred_jaccard
                                        else:
                                                pred_jaccard = 3.0

                        if (user_pred_pearson != 0 and user_pred_pearson != 5) and (item_pred_pearson != 0 and item_pred_pearson != 5):
                                pred_pearson = (user_pred_pearson + item_pred_pearson)/2
                        else:
                                if (user_pred_pearson == 0 or user_pred_pearson == 5):
                                        if (item_pred_pearson != 0 and item_pred_pearson != 5):
                                                pred_pearson = item_pred_pearson
                                        else:
                                                pred_pearson = 3.0
                                else:
                                        if (user_pred_pearson != 0 and user_pred_pearson != 5):
                                                pred_pearson = user_pred_pearson
                                        else:
                                                pred_pearson = 3.0

                        #print ("pedcosine" + "\n" + str(user) + "\t" + str(item) + "\t" + str(e[2]) + "\t" + str(pred_cosine) + "\t" + str(pred_jaccard) + "\t" + str(pred_pearson))
                        pred_rate_cosine.append(pred_cosine)
                        pred_rate_jaccard.append(pred_jaccard)
                        pred_rate_pearson.append(pred_pearson)

                rmse_cosine.append(sqrt(mean_squared_error(true_rate, pred_rate_cosine)))
                rmse_jaccard.append(sqrt(mean_squared_error(true_rate, pred_rate_jaccard)))
                rmse_pearson.append(sqrt(mean_squared_error(true_rate, pred_rate_pearson)))

        rmse_cosine = sum(rmse_cosine) / float(len(rmse_cosine))
        rmse_pearson = sum(rmse_pearson) / float(len(rmse_pearson))
        rmse_jaccard = sum(rmse_jaccard) / float(len(rmse_jaccard))


        f_rmse = open(file4,"w")
        f_rmse.write(str(rmse_cosine) + "\t" + str(rmse_jaccard) + "\t" + str(rmse_pearson) + "\n")

        rmse = [rmse_cosine, rmse_jaccard, rmse_pearson]
        req_sim = rmse.index(min(rmse))

        f_rmse.write(str(req_sim))
        f_rmse.close()

        if req_sim == 0:
                sim_mat_user = sim_user_cosine
                sim_mat_item = sim_item_cosine

        if req_sim == 1:
                sim_mat_user = sim_user_jaccard
                sim_mat_item = sim_item_jaccard

        if req_sim == 2:
                sim_mat_user = sim_user_pearson
                sim_mat_item = sim_item_pearson

        return sim_mat_user, sim_mat_item

def predictRating1(data, user_data, item_data):
        sim_user, sim_item = crossValidation(data, user_data, item_data)

        M = np.zeros((int(users),int(items)))
        for e in data:
                M[e[0]-1][e[1]-1] = e[2]

        print(M)

def predictRating(data, user_data, item_data):
        sim_user, sim_item = crossValidation(data, user_data, item_data)

        M = np.zeros((int(users),int(items)))
        for e in data:
                M[e[0]-1][e[1]-1] = e[2]

        f = open(file5,"r")
        toBeRated = {"user":[], "item":[]}
        for row in f:
                r = row.split(',')
                toBeRated["item"].append(int(r[1]))
                toBeRated["user"].append(int(r[0]))

        f.close()

        pred_rate = []

        #fw = open('result3.csv','w')
        fw_w = open(file6,'w') #poonam changed file path

        l = len(toBeRated["user"])
        for e in range(l):
                user = toBeRated["user"][e]
                item = toBeRated["item"][e]

                user_pred = 3.0
                item_pred = 3.0

                #item-based
                if np.count_nonzero(M[:,item-1]):
                        sim = sim_item[item-1]
                        ind = (M[user-1] > 0)
                        #ind[item-1] = False
                        normal = np.sum(np.absolute(sim[ind]))
                        if normal > 0:
                                item_pred = np.dot(sim,M[user-1])/normal

                if item_pred < 0:
                        item_pred = 0

                if item_pred > 5:
                        item_pred = 5

                #user-based
                if np.count_nonzero(M[user-1]):
                        sim = sim_user[user-1]
                        ind = (M[:,item-1] > 0)
                        #ind[user-1] = False
                        normal = np.sum(np.absolute(sim[ind]))
                        if normal > 0:
                                user_pred = np.dot(sim,M[:,item-1])/normal

                if user_pred < 0:
                        user_pred = 0

                if user_pred > 5:
                        user_pred = 5

                if (user_pred != 0 and user_pred != 5) and (item_pred != 0 and item_pred != 5):
                                pred = (user_pred + item_pred)/2
                else:
                        if (user_pred == 0 or user_pred == 5):
                                if (item_pred != 0 and item_pred != 5):
                                        pred = item_pred
                                else:
                                        pred = 3.0
                        else:
                                if (user_pred != 0 and user_pred != 5):
                                        pred = user_pred
                                else:
                                        pred = 3.0

                #pred = (user_pred + item_pred)/2
                pred_rate.append(pred)
                #print("Main OUTPUT")
                #print (str(user) + "," + str(item) + "," + str(pred))
                print (str(item))
                fw_w.write(str(pred) + "\n")


        #fw.close()
        fw_w.close()


ratings_csv_data = readingFile(file1)
#print("ratings_csv_data")
#print(ratings_csv_data)

user_data = userData(file2)
#print("user_data")
#print(user_data)

item_data = itemData(file3)
#print("item_data")
#print(item_data)

#sim_item_cosine, sim_item_jaccard, sim_item_pearson = similarity_item(item_data)
#print(sim_item_cosine, sim_item_jaccard, sim_item_pearson)

#sim_user_cosine, sim_user_jaccard, sim_user_pearson = similarity_user(user_data)
#print(sim_user_cosine, sim_user_jaccard, sim_user_pearson)

#crossValidation(ratings_csv_data, user_data, item_data)

#sim_user, sim_item = crossValidation(ratings_csv_data, user_data, item_data)
#print(sim_user, sim_item)

predictRating(ratings_csv_data, user_data, item_data)

sys.stdout.flush()
