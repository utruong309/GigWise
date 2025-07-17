import pandas as pd
from sklearn.cluster import DBSCAN
import json
from shapely.geometry import MultiPoint
from pymongo import MongoClient

MONGO_URI = 'mongodb+srv://uyenthutruong09:HMf8gMHD20PwWqn0@cluster0.docbatu.mongodb.net/gigwise?retryWrites=true&w=majority&appName=Cluster0'
DB_NAME = 'gigwise'
COLLECTION_NAME = 'deliveries'

def fetch_data_from_mongo():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    data = list(collection.find({}, {'_id': 0, 'lat': 1, 'lng': 1, 'time': 1, 'tip': 1, 'total': 1}))
    return pd.DataFrame(data)

def preprocess(df):
    df['hour'] = pd.to_datetime(df['time'], errors='coerce').dt.hour.fillna(0)
    coords = df[['lat', 'lng', 'hour']].to_numpy()
    return coords

def cluster_and_export(df, coords, eps=0.02, min_samples=3):
    db = DBSCAN(eps=eps, min_samples=min_samples).fit(coords)
    df['cluster'] = db.labels_

    result = []
    for cluster_id in set(db.labels_):
        if cluster_id == -1:
            continue
        cluster_df = df[df['cluster'] == cluster_id]
        points = list(zip(cluster_df['lat'], cluster_df['lng']))
        if len(points) < 3:
            continue  # convex_hull needs at least 3 points
        polygon = MultiPoint(points).convex_hull.exterior.coords[:]
        stats = {
            'cluster': int(cluster_id),
            'polygon': polygon,
            'center': [cluster_df['lat'].mean(), cluster_df['lng'].mean()],
            'total_earnings': float(cluster_df['total'].sum()),
            'avg_tip': float(cluster_df['tip'].mean()),
            'active_hour': int(cluster_df['hour'].mode().iloc[0])
        }
        result.append(stats)

    with open('cluster_output.json', 'w') as f:
        json.dump(result, f, indent=2)

if __name__ == '__main__':
    df = fetch_data_from_mongo()
    coords = preprocess(df)
    cluster_and_export(df, coords)