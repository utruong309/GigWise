import os
import json
from pymongo import MongoClient
from shapely.geometry import MultiPoint
from sklearn.cluster import DBSCAN
import numpy as np
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

def fetch_data():
    client = MongoClient(MONGO_URI)
    db = client["gigwise"]
    collection = db["deliveries"]
    data = list(collection.find({}, {"lat": 1, "lng": 1, "time": 1, "tip": 1, "total": 1}))
    return data

def preprocess(data):
    coords = []
    for doc in data:
        try:
            time = datetime.strptime(doc.get("time", "00:00"), "%H:%M")
            hour = time.hour
        except:
            hour = 0
        coords.append([doc["lat"], doc["lng"], hour])
    return np.array(coords)

def run_clustering(data, coords, eps=0.02, min_samples=3):
    db = DBSCAN(eps=eps, min_samples=min_samples).fit(coords)
    result = []
    for label in set(db.labels_):
        if label == -1: continue
        cluster_points = [d for d, l in zip(data, db.labels_) if l == label]
        lats = [p["lat"] for p in cluster_points]
        lngs = [p["lng"] for p in cluster_points]
        tips = [p.get("tip", 0) for p in cluster_points]
        totals = [p.get("total", 0) for p in cluster_points]
        hours = []
        for p in cluster_points:
            try:
                hours.append(datetime.strptime(p.get("time", "00:00"), "%H:%M").hour)
            except:
                hours.append(0)
        points = list(zip(lats, lngs))
        polygon = MultiPoint(points).convex_hull.exterior.coords[:]
        result.append({
            "cluster": int(label),
            "center": [np.mean(lats), np.mean(lngs)],
            "polygon": polygon,
            "total_earnings": sum(totals),
            "avg_tip": np.mean(tips),
            "active_hour": max(set(hours), key=hours.count)
        })
    with open("cluster_output.json", "w") as f:
        json.dump(result, f)

if __name__ == "__main__":
    data = fetch_data()
    coords = preprocess(data)
    run_clustering(data, coords)