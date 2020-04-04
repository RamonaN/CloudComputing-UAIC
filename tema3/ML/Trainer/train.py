import datetime

from google.cloud import storage
from google.cloud import firestore

from firebase_admin import credentials, firestore
from firebase_admin import db
import firebase_admin

import pandas as pd
import numpy as np
import joblib
from sklearn.neighbors import NearestNeighbors

import warnings
warnings.filterwarnings('ignore')


cred = credentials.ApplicationDefault()
app = firebase_admin.initialize_app(cred)
store = firestore.client()

def get_collection_asDF(colection_name):
    doc_ref = store.collection(colection_name)
    try:
        docs = doc_ref.get()
        data = [doc.to_dict() for doc in docs]        
        df = pd.DataFrame(data)
        return df
    except google.cloud.exceptions.NotFound:
        print(u'Missing data')
        
books = get_collection_asDF('books')
ratings = get_collection_asDF('ratings')
users = get_collection_asDF('users')        
        
books.drop(['imagine'],axis=1,inplace=True)
books['an'] = books['an'].replace(0,np.nan)
books['an'].fillna(books['an'].mean(), inplace=True)
books['an'] = books['an'].astype(np.int32)    

users.drop(['nume','parola','isAdmin'],axis=1,inplace=True)
users.varsta.loc[(users.varsta >90) | (users.varsta<5)] = np.nan
users.varsta = users.varsta.fillna(users.varsta.mean())
users.varsta = users.varsta.astype(np.int32)
users.id = users.id.astype(np.int32)

ratings_new = ratings[ratings.isbn.isin(books.isbn)]
ratings = ratings[ratings.utilizator.isin(users.id)]
ratings_explicit = ratings_new[ratings_new.scor != 0]
ratings_implicit = ratings_new[ratings_new.scor == 0]
users_exp_ratings = users[users.id.isin(ratings_explicit.utilizator)]
users_imp_ratings = users[users.id.isin(ratings_implicit.utilizator)]

counts1 = ratings_explicit['utilizator'].value_counts()
ratings_explicit = ratings_explicit[ratings_explicit['utilizator'].isin(counts1[counts1 >= 1].index)]
counts = ratings_explicit['scor'].value_counts()
ratings_explicit = ratings_explicit[ratings_explicit['scor'].isin(counts[counts >= 1].index)]

ratings_matrix = ratings_explicit.pivot(index='utilizator', columns='isbn', values='scor')
ratings_matrix.fillna(0, inplace = True)
ratings_matrix = ratings_matrix.astype(np.int32)

model_knn_users = NearestNeighbors(metric = 'cosine', algorithm = 'brute') 
model_knn_users.fit(ratings_matrix)

model_knn_items = NearestNeighbors(metric = 'cosine', algorithm = 'brute') 
model_knn_items.fit(ratings_matrix.T)


def save(pipeline,model,BUCKET_NAME):
    
    joblib.dump(pipeline, model)

    # Upload the model to GCS
    bucket = storage.Client().bucket(BUCKET_NAME)
    blob = bucket.blob('{}/{}'.format(
        datetime.datetime.now().strftime('book_%Y%m%d_%H%M'),
        model))
    blob.upload_from_filename(model)
    
BUCKET_NAME =  "cc-homework-3-272910-aiplatform"
save(model_knn_users,'model_users.joblib',BUCKET_NAME)
save(model_knn_items,'model_items.joblib',BUCKET_NAME)
save(ratings_matrix,'ratings_matrix.joblib',BUCKET_NAME)
save(books,'books.joblib',BUCKET_NAME)
