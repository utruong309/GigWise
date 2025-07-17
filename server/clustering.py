import pandas as pd
from sklearn.cluster import DBSCAN
import json
from shapely.geometry import MultiPoint
import sys

def load_data(csv_path):
    return pd.read_csv(csv_path)

def preprocess(df):
    df['hour'] = pd.to_datetime(df['time'], errors='coerce').dt.hour.fillna(0)
    coords = df[['lat', 'lng', 'hour']].to_numpy()
    return coords

def cluster_and_export(df, coords, eps=0.5, min_samples=3):
    db = DBSCAN(eps=eps, min_samples=min_samples).fit(coords)
    df['cluster'] = db.labels_
    
    result = []
    for cluster_id in set(db.labels_):
        if cluster_id == -1:
            continue
        cluster_df = df[df['cluster'] == cluster_id]
        points = list(zip(cluster_df['lat'], cluster_df['lng']))
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
        json.dump(result, f)

if __name__ == '__main__':
    csv_path = sys.argv[1]
    df = load_data(csv_path)
    coords = preprocess(df)
    cluster_and_export(df, coords)